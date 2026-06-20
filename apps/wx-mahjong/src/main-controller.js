import { Client } from 'colyseus.js'
import { SERVER_BASE_URL } from './config.js'

const ROOM_NAME = 'mahjong_room'
const CLIENT_MESSAGES = {
  MahjongAction: 'mahjong_action',
}
const SERVER_MESSAGES = {
  MahjongSnapshot: 'mahjong_snapshot',
  MahjongError: 'mahjong_error',
}

export default class MainController {
  constructor(view, authSession = null, roomOptions = {}) {
    this.view = view
    this.authSession = authSession
    this.roomOptions = roomOptions
    this.roomId = roomOptions.roomId || ''
    this.clientId = createClientId()
    this.client = null
    this.online = false
    this.room = null

    if (authSession && authSession.token) {
      this.connect()
    } else {
      this.handleMissingAuth()
    }
  }

  setAuthSession(authSession) {
    this.authSession = authSession
    if (authSession && authSession.token && !this.online) {
      this.connect()
    }
  }

  async connect() {
    this.closeRoom()
    this.view.renderState(createStatusState('正在连接多人牌局...'))

    try {
      const user = (this.authSession && this.authSession.user) || {}
      const options = {
        token: this.authSession.token,
        name: user.displayName || user.name || 'player',
        password: this.roomOptions.password || '',
        timeoutSeconds: this.roomOptions.timeoutSeconds || 30,
      }
      const client = this.createColyseusClient()
      const room = this.roomId
        ? await client.joinById(this.roomId, options)
        : await client.create(ROOM_NAME, options)

      this.client = client
      this.room = room
      this.online = true
      this.roomId = room.roomId || room.id || this.roomId
      this.bindRoom(room)
    } catch (error) {
      console.warn('[wx-mahjong] multiplayer connect failed', error)
      if (error && error.statusCode === 401 && this.view.backToLogin) {
        this.view.backToLogin('登录已过期，请重新登录。')
      } else if (error && (error.statusCode === 404 || error.statusCode === 409 || error.statusCode === 410) && this.view.backToLobby) {
        this.view.backToLobby(error.message || '房间不可用，请重新创建或加入。')
      } else {
        this.closeRoom()
        this.online = false
        if (this.view.backToLobby) this.view.backToLobby(error.message || '连接房间失败，请稍后重试。')
        else if (this.view.showError) this.view.showError(error.message || '连接房间失败，请稍后重试。')
      }
    }
  }

  restart() {
    if (this.online) this.sendAction('restart')
    else this.showDisconnectedError()
  }

  ready() {
    if (this.online) this.sendAction('ready')
    else this.showDisconnectedError()
  }

  leave() {
    if (this.online) this.sendAction('leave')
    else this.showDisconnectedError()
  }

  discard(index) {
    if (this.online) this.sendAction('discard', { index })
    else this.showDisconnectedError()
  }

  pass() {
    if (this.online) this.sendAction('pass')
    else this.showDisconnectedError()
  }

  peng() {
    if (this.online) this.sendAction('peng')
    else this.showDisconnectedError()
  }

  gang(tile = null) {
    if (this.online) this.sendAction('gang', tile ? { tile } : {})
    else this.showDisconnectedError()
  }

  hu() {
    if (this.online) this.sendAction('hu')
    else this.showDisconnectedError()
  }

  async sendAction(action, payload = {}) {
    if (!this.roomId) return
    if (!this.room) return
    console.info('[wx-mahjong] colyseus action', { action, roomId: this.roomId, clientId: this.clientId })
    try {
      this.room.send(CLIENT_MESSAGES.MahjongAction, Object.assign({ action }, payload))
    } catch (error) {
      console.warn('[wx-mahjong] action failed', action, error)
      this.handleRequestError(error)
    }
  }

  bindRoom(room) {
    console.info('[wx-mahjong] colyseus room joined', { roomId: this.roomId, clientId: this.clientId })
    room.onMessage(SERVER_MESSAGES.MahjongSnapshot, (data) => {
      if (data && data.left) {
        this.closeRoom()
        this.online = false
        if (this.view.backToLobby) this.view.backToLobby(data.message || '已退出房间。')
        return
      }
      this.renderResponseState({ roomId: this.roomId, state: data })
    })
    room.onMessage(SERVER_MESSAGES.MahjongError, (data = {}) => {
      const error = new Error(data.message || 'Colyseus request failed.')
      error.code = data.code
      error.statusCode = mapColyseusErrorStatus(data.code)
      this.handleRequestError(error)
    })
    room.onLeave((code) => {
      console.warn('[wx-mahjong] colyseus room left', { roomId: this.roomId, clientId: this.clientId, code })
      this.room = null
      this.online = false
    })
    room.onError((code, message) => {
      console.warn('[wx-mahjong] colyseus room error', { roomId: this.roomId, clientId: this.clientId, code, message })
      const error = new Error(message || 'Colyseus room error.')
      error.statusCode = mapColyseusErrorStatus(code)
      this.handleRequestError(error)
    })
  }

  renderResponseState(data) {
    if (data && data.roomId) this.roomId = data.roomId
    if (data && data.state) {
      data.state.roomId = this.roomId
      this.view.renderState(data.state)
    }
  }

  handleRequestError(error) {
    const statusCode = error && error.statusCode
    if (statusCode === 401) {
      this.closeRoom()
      this.online = false
      if (this.view.backToLogin) {
        this.view.backToLogin('登录已过期，请重新登录。')
        return
      }
    }
    if (statusCode === 409 && error.code === 'account_replaced') {
      this.closeRoom()
      this.online = false
      if (this.view.backToLobby) {
        this.view.backToLobby(error.message || '账号已在其他设备进入该房间。')
        return
      }
    }
    if (statusCode === 404 || statusCode === 410) {
      this.closeRoom()
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
    if (this.view.backToLobby) {
      this.view.backToLobby(error.message || '多人连接异常，请稍后重试。')
    }
  }

  closeRoom() {
    if (!this.room) return
    const room = this.room
    this.room = null
    room.leave()
  }

  createColyseusClient() {
    return new Client(getColyseusEndpoint())
  }

  handleMissingAuth() {
    this.online = false
    this.view.renderState(createStatusState('请先登录后进入房间。'))
    if (this.view.backToLogin) this.view.backToLogin('请先登录后进入房间。')
  }

  showDisconnectedError() {
    if (this.view.showError) this.view.showError('未连接到多人房间。')
  }
}

function createClientId() {
  return `wx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function getServerBaseUrl() {
  const value = globalThis.__WX_MAHJONG_SERVER_URL__ || SERVER_BASE_URL
  return String(value).replace(/\/+$/, '')
}

function getColyseusEndpoint() {
  const baseUrl = getServerBaseUrl()
  return baseUrl.indexOf('https://') === 0
    ? `wss://${baseUrl.slice('https://'.length)}`
    : baseUrl.indexOf('http://') === 0
      ? `ws://${baseUrl.slice('http://'.length)}`
      : baseUrl
}

function mapColyseusErrorStatus(code) {
  if (code === 'account_replaced' || code === 4409) return 409
  if (code === 'room_not_found' || code === 4212) return 404
  if (code === 'invalid_room_password' || code === 4403) return 403
  if (code === 4001 || code === 4401) return 401
  return 400
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
