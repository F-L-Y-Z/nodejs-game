import { SERVER_BASE_URL } from './config.js'
import MahjongServer from './server/mahjong-server.js'

const POLL_INTERVAL_MS = 900

export default class MainController {
  constructor(view, authSession = null, roomOptions = {}) {
    this.view = view
    this.authSession = authSession
    this.roomOptions = roomOptions
    this.roomId = roomOptions.roomId || ''
    this.clientId = createClientId()
    this.localServer = null
    this.online = false
    this.pollTimer = null
    this.requestingSnapshot = false
    this.socket = null
    this.socketOpen = false

    if (authSession && authSession.token) {
      this.connect()
    } else {
      this.startLocal('未登录，使用本地单机模式。')
    }
  }

  setAuthSession(authSession) {
    this.authSession = authSession
    if (authSession && authSession.token && !this.online) {
      this.connect()
    }
  }

  async connect() {
    this.stopPolling()
    this.view.renderState(createStatusState('正在连接多人牌局...'))

    try {
      const user = (this.authSession && this.authSession.user) || {}
      const data = await this.request(this.getJoinPath(), {
        method: 'POST',
        data: {
          name: user.displayName || user.name || 'player',
          password: this.roomOptions.password || '',
          timeoutSeconds: this.roomOptions.timeoutSeconds || 30,
        },
      })
      this.online = true
      this.roomId = data.roomId || this.roomId
      this.localServer = null
      this.renderResponseState(data)
      this.startPolling()
      this.connectWebSocket()
    } catch (error) {
      console.warn('[wx-mahjong] multiplayer connect failed', error)
      if (error && error.statusCode === 401 && this.view.backToLogin) {
        this.view.backToLogin('登录已过期，请重新登录。')
      } else if (error && (error.statusCode === 404 || error.statusCode === 409 || error.statusCode === 410) && this.view.backToLobby) {
        this.view.backToLobby(error.message || '房间不可用，请重新创建或加入。')
      } else {
        this.startLocal('多人连接失败，已切换本地模式。')
      }
    }
  }

  restart() {
    if (this.online) this.sendAction('restart')
    else this.startLocal()
  }

  ready() {
    if (this.online) this.sendAction('ready')
  }

  leave() {
    if (this.online) this.sendAction('leave')
  }

  discard(index) {
    if (this.online) this.sendAction('discard', { index })
    else if (this.localServer) this.localServer.playerDiscard(index)
  }

  pass() {
    if (this.online) this.sendAction('pass')
    else if (this.localServer) this.localServer.playerPass()
  }

  peng() {
    if (this.online) this.sendAction('peng')
    else if (this.localServer) this.localServer.playerPeng()
  }

  gang(tile = null) {
    if (this.online) this.sendAction('gang', tile ? { tile } : {})
    else if (this.localServer) this.localServer.playerGang(tile)
  }

  hu() {
    if (this.online) this.sendAction('hu')
    else if (this.localServer) this.localServer.playerHu()
  }

  async sendAction(action, payload = {}) {
    if (!this.roomId) return
    if (this.socketOpen && this.socket) {
      console.info('[wx-mahjong] websocket action', { action, roomId: this.roomId, clientId: this.clientId })
      this.socket.send(JSON.stringify(Object.assign({ type: 'action', action }, payload)))
      return
    }
    console.warn('[wx-mahjong] http action fallback', { action, roomId: this.roomId, clientId: this.clientId })
    try {
      const data = await this.request(this.getActionPath(), {
        method: 'POST',
        data: Object.assign({ action }, payload),
      })
      if (data && data.left) {
        this.stopPolling()
        this.online = false
        if (this.view.backToLobby) this.view.backToLobby(data.message || '已退出房间。')
        return
      }
      this.renderResponseState(data)
      if (data && data.ok === false && this.view.showError) {
        this.view.showError(data.message || '当前不能执行该操作。')
      }
    } catch (error) {
      console.warn('[wx-mahjong] action failed', action, error)
      this.handleRequestError(error)
    }
  }

  startPolling() {
    this.stopPolling()
    console.warn('[wx-mahjong] http polling start', { roomId: this.roomId, clientId: this.clientId })
    this.pollTimer = setInterval(() => this.pollSnapshot(), POLL_INTERVAL_MS)
  }

  stopPolling() {
    if (!this.pollTimer) return
    console.info('[wx-mahjong] http polling stop', { roomId: this.roomId, clientId: this.clientId })
    clearInterval(this.pollTimer)
    this.pollTimer = null
  }

  async pollSnapshot() {
    if (!this.online || this.requestingSnapshot || !this.roomId) return
    this.requestingSnapshot = true
    try {
      const data = await this.request(`/mahjong/rooms/${this.roomId}/snapshot`, { method: 'GET' })
      this.renderResponseState(data)
    } catch (error) {
      console.warn('[wx-mahjong] snapshot poll failed', error)
      this.handleRequestError(error)
    } finally {
      this.requestingSnapshot = false
    }
  }

  async request(path, options = {}) {
    const response = await this.view.app.request({
      url: `${getServerBaseUrl()}${path}`,
      method: options.method || 'GET',
      header: {
        authorization: `Bearer ${this.authSession.token}`,
        'content-type': 'application/json',
        'x-client-id': this.clientId,
      },
      data: Object.assign({ clientId: this.clientId }, options.data || {}),
    })
    const data = response && response.data
    if (!response || response.statusCode < 200 || response.statusCode >= 300 || !data) {
      const error = new Error((data && data.message) || 'Mahjong request failed.')
      error.statusCode = response && response.statusCode
      error.code = data && data.code
      throw error
    }
    return data
  }

  connectWebSocket() {
    if (!this.online || !this.roomId || !this.authSession || !this.authSession.token) return
    this.closeSocket()

    const url = `${getWsBaseUrl()}/mahjong/ws?token=${encodeURIComponent(this.authSession.token)}&roomId=${encodeURIComponent(this.roomId)}&clientId=${encodeURIComponent(this.clientId)}`
    console.info('[wx-mahjong] websocket connecting', { url: maskSocketUrl(url), roomId: this.roomId, clientId: this.clientId })
    const socket = createSocket(url)
    if (!socket) {
      console.warn('[wx-mahjong] websocket unavailable, keep http polling')
      return
    }
    this.socket = socket

    socket.onOpen(() => {
      console.info('[wx-mahjong] websocket open', { roomId: this.roomId, clientId: this.clientId })
      this.socketOpen = true
      this.stopPolling()
    })
    socket.onMessage((message) => {
      this.handleSocketMessage(message)
    })
    socket.onClose((event) => {
      console.warn('[wx-mahjong] websocket close', { roomId: this.roomId, clientId: this.clientId, event })
      this.socketOpen = false
      this.socket = null
      if (this.online) this.startPolling()
    })
    socket.onError((error) => {
      console.warn('[wx-mahjong] websocket error', { roomId: this.roomId, clientId: this.clientId, error })
      this.socketOpen = false
      this.socket = null
      if (this.online) this.startPolling()
    })
  }

  handleSocketMessage(rawMessage) {
    let data = null
    try {
      data = JSON.parse(typeof rawMessage === 'string' ? rawMessage : rawMessage.data)
    } catch (error) {
      console.warn('[wx-mahjong] invalid websocket message', rawMessage)
      return
    }

    if (data.type === 'snapshot') {
      this.renderResponseState(data)
      return
    }
    if (data.type === 'action_result') {
      this.renderResponseState(data)
      if (data.ok === false && this.view.showError) {
        this.view.showError(data.message || '当前不能执行该操作。')
      }
      return
    }
    if (data.type === 'left') {
      this.closeSocket()
      this.stopPolling()
      this.online = false
      if (this.view.backToLobby) this.view.backToLobby(data.message || '已退出房间。')
      return
    }
    if (data.type === 'error') {
      const error = new Error(data.message || 'WebSocket request failed.')
      error.code = data.code
      error.statusCode = data.code === 'account_replaced' ? 409 : data.code === 'room_not_found' ? 404 : 400
      this.handleRequestError(error)
    }
  }

  renderResponseState(data) {
    if (data && data.roomId) this.roomId = data.roomId
    if (data && data.state) {
      data.state.roomId = this.roomId
      this.view.renderState(data.state)
    }
  }

  startLocal(message = '') {
    this.stopPolling()
    this.closeSocket()
    this.online = false
    this.localServer = new MahjongServer((state) => {
      if (message) {
        state.message = message
        message = ''
      }
      this.view.renderState(state)
    })
  }

  handleRequestError(error) {
    const statusCode = error && error.statusCode
    if (statusCode === 401) {
      this.stopPolling()
      this.closeSocket()
      this.online = false
      if (this.view.backToLogin) {
        this.view.backToLogin('登录已过期，请重新登录。')
        return
      }
    }
    if (statusCode === 409 && error.code === 'account_replaced') {
      this.stopPolling()
      this.closeSocket()
      this.online = false
      if (this.view.backToLobby) {
        this.view.backToLobby(error.message || '账号已在其他设备进入该房间。')
        return
      }
    }
    if (statusCode === 404 || statusCode === 410) {
      this.stopPolling()
      this.closeSocket()
      this.online = false
      if (this.view.backToLobby) {
        this.view.backToLobby(error.message || '房间已失效，请重新创建或加入。')
        return
      }
    }
    if (this.view.showError) {
      this.view.showError(error.message || '操作失败，请稍后重试。')
      return
    }
    this.startLocal('多人连接异常，已切换本地模式。')
  }

  closeSocket() {
    if (!this.socket) return
    const socket = this.socket
    this.socket = null
    this.socketOpen = false
    socket.close()
  }

  getJoinPath() {
    if (this.roomId) return `/mahjong/rooms/${this.roomId}/join`
    return '/mahjong/rooms'
  }

  getActionPath() {
    return `/mahjong/rooms/${this.roomId}/action`
  }
}

function createClientId() {
  return `wx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function getServerBaseUrl() {
  const value = globalThis.__WX_MAHJONG_SERVER_URL__ || SERVER_BASE_URL
  return String(value).replace(/\/+$/, '')
}

function getWsBaseUrl() {
  const baseUrl = getServerBaseUrl()
  if (baseUrl.indexOf('https://') === 0) return `wss://${baseUrl.slice('https://'.length)}`
  if (baseUrl.indexOf('http://') === 0) return `ws://${baseUrl.slice('http://'.length)}`
  return baseUrl
}

function maskSocketUrl(url) {
  return String(url).replace(/token=([^&]+)/, 'token=***')
}

function createSocket(url) {
  if (globalThis.wx && globalThis.wx.connectSocket) {
    const task = globalThis.wx.connectSocket({ url })
    return {
      send(data) {
        task.send({ data })
      },
      close() {
        task.close()
      },
      onOpen(handler) {
        task.onOpen(handler)
      },
      onMessage(handler) {
        task.onMessage((event) => handler(event.data))
      },
      onClose(handler) {
        task.onClose(handler)
      },
      onError(handler) {
        task.onError(handler)
      },
    }
  }

  if (globalThis.WebSocket) {
    const socket = new globalThis.WebSocket(url)
    return {
      send(data) {
        socket.send(data)
      },
      close() {
        socket.close()
      },
      onOpen(handler) {
        socket.addEventListener('open', handler)
      },
      onMessage(handler) {
        socket.addEventListener('message', (event) => handler(event.data))
      },
      onClose(handler) {
        socket.addEventListener('close', handler)
      },
      onError(handler) {
        socket.addEventListener('error', handler)
      },
    }
  }

  return null
}

function createStatusState(message) {
  return {
    phase: 'connecting',
    currentPlayer: 0,
    wallCount: 0,
    lastDiscard: null,
    message,
    winner: null,
    bird: null,
    actions: {},
    players: ['你', '下家', '对家', '上家'].map((name, index) => ({
      index,
      name,
      hand: [],
      drawnTile: null,
      handCount: 0,
      discards: [],
      melds: [],
    })),
  }
}
