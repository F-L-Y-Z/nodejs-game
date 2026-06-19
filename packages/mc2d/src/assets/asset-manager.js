export default class AssetManager {
  constructor(platform) {
    this.platform = platform
    this.pathFormatters = Object.create(null)
    this.images = Object.create(null)
    this.audio = Object.create(null)
  }

  setPathFormatter(type, formatter) {
    this.pathFormatters[type] = formatter
  }

  resolve(key, type = '') {
    const formatter = this.pathFormatters[type]
    return formatter ? formatter(key) : key
  }

  image(key, type = '') {
    const path = this.resolve(key, type)
    if (!this.images[path]) this.images[path] = this.createImageRecord(path)
    return this.images[path]
  }

  loadImage(key, type = '') {
    return this.image(key, type).promise
  }

  preloadImages(keys, type = '') {
    return Promise.all(keys.map(key => this.loadImage(key, type)))
  }

  createImageRecord(path) {
    const image = this.platform.createImage()
    const record = {
      path,
      image,
      status: 'loading',
      error: null,
      width: 0,
      height: 0,
      promise: null
    }

    record.promise = new Promise((resolve, reject) => {
      image.onload = () => {
        record.status = 'loaded'
        record.width = image.width
        record.height = image.height
        resolve(record)
      }
      image.onerror = error => {
        record.status = 'error'
        record.error = error || new Error(`Image load failed: ${path}`)
        reject(record.error)
      }
    })
    image.src = path
    return record
  }

  sound(key, type = '') {
    const path = this.resolve(key, type)
    if (!this.audio[path]) {
      const audio = this.platform.createAudio()
      audio.src = path
      this.audio[path] = audio
    }
    return this.audio[path]
  }
}
