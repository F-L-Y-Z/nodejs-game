import { SERVER_BASE_URL } from './config.js'
import MahjongServer from './server/mahjong-server.js'

const POLL_INTERVAL_MS = 900

export default class MainController {
  constructor(view, authSession = null) {
    this.view = view
    this.authSession = authSession
    this.localServer = null
    this.online = false
    this.pollTimer = null
    this.requestingSnapshot = false

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
      const data = await this.request('/mahjong/join', {
        method: 'POST',
        data: {
          name: user.displayName || user.name || 'player',
        },
      })
      this.online = true
      this.localServer = null
      this.renderResponseState(data)
      this.startPolling()
    } catch (error) {
      console.warn('[wx-mahjong] multiplayer connect failed', error)
      this.startLocal('多人连接失败，已切换本地模式。')
    }
  }

  restart() {
    if (this.online) this.sendAction('restart')
    else this.startLocal()
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
    try {
      const data = await this.request('/mahjong/action', {
        method: 'POST',
        data: Object.assign({ action }, payload),
      })
      this.renderResponseState(data)
    } catch (error) {
      console.warn('[wx-mahjong] action failed', action, error)
      this.startLocal('多人连接异常，已切换本地模式。')
    }
  }

  startPolling() {
    this.stopPolling()
    this.pollTimer = setInterval(() => this.pollSnapshot(), POLL_INTERVAL_MS)
  }

  stopPolling() {
    if (!this.pollTimer) return
    clearInterval(this.pollTimer)
    this.pollTimer = null
  }

  async pollSnapshot() {
    if (!this.online || this.requestingSnapshot) return
    this.requestingSnapshot = true
    try {
      const data = await this.request('/mahjong/snapshot', { method: 'GET' })
      this.renderResponseState(data)
    } catch (error) {
      console.warn('[wx-mahjong] snapshot poll failed', error)
      this.startLocal('多人连接异常，已切换本地模式。')
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
      },
      data: options.data || {},
    })
    const data = response && response.data
    if (!response || response.statusCode < 200 || response.statusCode >= 300 || !data || !data.ok) {
      throw new Error((data && data.message) || 'Mahjong request failed.')
    }
    return data
  }

  renderResponseState(data) {
    if (data && data.state) this.view.renderState(data.state)
  }

  startLocal(message = '') {
    this.stopPolling()
    this.online = false
    this.localServer = new MahjongServer((state) => {
      if (message) {
        state.message = message
        message = ''
      }
      this.view.renderState(state)
    })
  }
}

function getServerBaseUrl() {
  const value = globalThis.__WX_MAHJONG_SERVER_URL__ || SERVER_BASE_URL
  return String(value).replace(/\/+$/, '')
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
