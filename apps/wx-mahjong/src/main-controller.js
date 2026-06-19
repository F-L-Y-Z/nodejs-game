import MahjongServer from './server/mahjong-server.js'

export default class MainController {
  constructor(view) {
    this.view = view
    this.authSession = null
    this.restart()
  }

  setAuthSession(authSession) {
    this.authSession = authSession
  }

  restart() {
    this.server = new MahjongServer(state => this.view.renderState(state))
  }

  discard(index) {
    this.server.playerDiscard(index)
  }

  pass() {
    this.server.playerPass()
  }

  peng() {
    this.server.playerPeng()
  }

  gang(tile = null) {
    this.server.playerGang(tile)
  }

  hu() {
    this.server.playerHu()
  }
}
