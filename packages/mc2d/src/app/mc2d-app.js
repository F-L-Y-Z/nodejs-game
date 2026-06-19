import AssetManager from '../assets/asset-manager'
import AudioManager from '../assets/audio-manager'
import Container from '../display/container'
import LoginButton from '../display/graphics/login-button'
import InputManager from '../input/input-manager'
import EventEmitter from '../state/event-emitter'
import { applyCanvasScale } from './canvas-scale'
import Stage from './stage'

const noop = () => {}

export default class Mc2dApp extends EventEmitter {
  constructor(options = {}) {
    super()
    const { platform, canvas, fps = 60, autoRender = true } = options

    if (!platform) throw new Error('Mc2dApp requires a platform adapter')
    if (!canvas) throw new Error('Mc2dApp requires a canvas')

    this.platform = platform
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.fps = fps
    this.autoRender = autoRender
    this.running = false
    this.frameId = 0
    this.lastTime = 0
    this.scaleInitialized = false
    this.minFrameTime = fps > 0 ? 1000 / fps : 0

    this.assets = new AssetManager(platform)
    this.audio = new AudioManager(this.assets)
    this.stage = new Stage(this)
    this.rootLayer = new Container()
    this.effects = new Container()
    this.topLayer = new Container()
    this.layers = {
      root: this.rootLayer,
      effects: this.effects,
      top: this.topLayer,
    }
    this.input = new InputManager(this.stage, platform)
    this.input.bind(canvas)
    this.sharedContext = platform.getOpenDataContext ? platform.getOpenDataContext() : null
    this.sharedCanvas = this.sharedContext && this.sharedContext.canvas

    this.tick = this.tick.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleHide = this.handleHide.bind(this)
    if (platform.setFPS) platform.setFPS(fps)
    if (platform.onShow) this.unbindShow = platform.onShow(this.handleShow)
    if (platform.onHide) this.unbindHide = platform.onHide(this.handleHide)
    this.resize()
  }

  setRoot(root) {
    this.stage.removeChildren()
    this.rootLayer.removeChildren()
    this.stage.addChild(this.rootLayer)
    this.stage.addChild(this.effects)
    this.stage.addChild(this.topLayer)
    if (root) this.rootLayer.addChild(root)
    this.stage.requestRender()
    this.stage.layoutTree()
    this.stage.update(0)
    this.stage.layoutTree()
    this.render()
    return root
  }

  start(root = null) {
    if (root) this.setRoot(root)
    if (this.running) return
    this.running = true
    this.lastTime = 0
    this.frameId = this.platform.requestAnimationFrame(this.tick)
  }

  stop() {
    this.running = false
    if (this.frameId) this.platform.cancelAnimationFrame(this.frameId)
    this.frameId = 0
  }

  resize(info = null) {
    const systemInfo = info || this.platform.getSystemInfo()
    const width = systemInfo.windowWidth || systemInfo.width || this.canvas.width || 0
    const height = systemInfo.windowHeight || systemInfo.height || this.canvas.height || 0
    const pixelRatio = systemInfo.pixelRatio || 1

    this.systemInfo = systemInfo
    this.width = width
    this.height = height
    this.pixelRatio = pixelRatio

    const backingWidth = Math.round(width * pixelRatio)
    const backingHeight = Math.round(height * pixelRatio)
    const resized = this.canvas.width !== backingWidth || this.canvas.height !== backingHeight
    if (this.canvas.width !== backingWidth) this.canvas.width = backingWidth
    if (this.canvas.height !== backingHeight) this.canvas.height = backingHeight

    applyCanvasScale(this.ctx, pixelRatio, resized || !this.scaleInitialized)
    this.scaleInitialized = true
    this.stage.resize(width, height)
    Object.values(this.layers).forEach((layer) => layer.setFrame(0, 0, width, height))
    this.stage.layoutTree()
    this.stage.forEach((node) => {
      if (node.onScreenResize) node.onScreenResize(this.systemInfo)
    })
    if (this.sharedCanvas) {
      this.sharedCanvas.width = backingWidth
      this.sharedCanvas.height = backingHeight
      if (this.sharedContext.postMessage) {
        this.sharedContext.postMessage({
          command: 'resize',
          pixelRatio,
          width: backingWidth,
          height: backingHeight,
        })
      }
    }
    this.render()
  }

  tick(time = Date.now()) {
    if (!this.running) return
    const elapsed = this.lastTime ? time - this.lastTime : this.minFrameTime

    if (!this.minFrameTime || elapsed >= this.minFrameTime - 1) {
      this.lastTime = time
      const dt = elapsed / 1000
      this.stage.update(dt)
      this.stage.layoutTree()
      if (this.autoRender || this.stage.renderRequested) this.render()
    }

    this.frameId = this.platform.requestAnimationFrame(this.tick)
  }

  render() {
    applyCanvasScale(this.ctx, this.pixelRatio)
    this.stage.renderStage(this.ctx)
  }

  handleShow(event) {
    this.emit('show', event)
    this.resize()
  }

  handleHide(event) {
    this.emit('hide', event)
  }

  enableShare(callback) {
    this.shareCallback = callback
    if (this.platform.setShare) this.platform.setShare(callback)
  }

  share(options = null) {
    const payload = options || (this.shareCallback ? this.shareCallback() : null)
    if (payload && this.platform.share) this.platform.share(payload)
  }

  request(options) {
    return this.platform.request ? this.platform.request(options) : Promise.reject(new Error('platform.request is not available'))
  }

  createUserInfoButton(options) {
    return this.platform.createUserInfoButton ? this.platform.createUserInfoButton(options) : null
  }

  getSetting(options = {}) {
    return this.platform.getSetting ? this.platform.getSetting(options) : Promise.reject(new Error('platform.getSetting is not available'))
  }

  getUserInfo(options = {}) {
    const {
      container = null,
      forceShowButton = false,
      onShowButton = null,
      type = 'text',
      value = '登录',
      style = null,
      userInfoOptions = {},
    } = options

    return this.getSetting().then((setting) => {
      const authorized = setting.authSetting && setting.authSetting['scope.userInfo']
      if (!forceShowButton && authorized && this.platform.getUserInfo) {
        return this.platform.getUserInfo(userInfoOptions).then((userInfo) => ({ setting, userInfo }))
      }

      if (!container) {
        if (!this.platform.getUserInfo) {
          return Promise.reject(new Error('platform.getUserInfo is not available'))
        }
        return this.platform.getUserInfo(userInfoOptions).then((userInfo) => ({ setting, userInfo }))
      }

      return new Promise((resolve, reject) => {
        const buttonNode = container.addChild(new LoginButton(this.platform, style || {}, type, value))
        const nativeButton = buttonNode.button
        if (onShowButton) onShowButton(buttonNode, nativeButton)
        if (!nativeButton) {
          container.removeChild(buttonNode)
          reject(new Error('platform.createUserInfoButton is not available'))
          return
        }
        nativeButton.onTap((userInfo) => {
          if (nativeButton.offTap) nativeButton.offTap()
          if (nativeButton.destroy) nativeButton.destroy()
          container.removeChild(buttonNode)
          resolve({ setting, userInfo })
        })
      })
    })
  }

  platformLogin(options = {}) {
    return this.platform.login ? this.platform.login(options) : Promise.reject(new Error('platform.login is not available'))
  }

  login(options = {}) {
    const {
      container = null,
      forceShowButton = false,
      onShowButton = null,
      onButtonTap = null,
      requestOptions = null,
      type = 'text',
      value = '登录',
      style = null,
      userInfoOptions = {},
      loginOptions = {},
    } = options

    return this.getUserInfo({
      container,
      forceShowButton,
      onShowButton,
      type,
      value,
      style,
      userInfoOptions,
    }).then(({ setting, userInfo }) => {
      if (onButtonTap) onButtonTap(setting, userInfo)
      return this.platformLogin(loginOptions).then((loginInfo) => {
        const requestConfig = typeof requestOptions === 'function' ? requestOptions(setting, userInfo, loginInfo) : requestOptions
        if (requestConfig && requestConfig.url) {
          return this.request(requestConfig)
            .then((response) => ({ setting, userInfo, loginInfo, response }))
            .catch((response) => ({ setting, userInfo, loginInfo, response }))
        }
        return { setting, userInfo, loginInfo, response: null }
      })
    })
  }

  getTouchPoint() {
    return this.input.getTouchPoint()
  }

  getTouchMoveVector() {
    return this.input.getTouchMoveVector()
  }

  lerp(a, b, t) {
    const diff = b - a
    if (Math.abs(diff) < 0.00001) return b
    return a + diff * Math.max(0, Math.min(1, t))
  }

  destroy() {
    this.stop()
    this.input.destroy()
    if (this.unbindShow) this.unbindShow()
    if (this.unbindHide) this.unbindHide()
    this.stage.removeChildren()
    this.platform.destroy ? this.platform.destroy() : noop()
  }
}
