export default class AudioManager {
  constructor(assetManager) {
    this.assets = assetManager;
    this.bgmEnabled = true;
    this.sfxEnabled = true;
    this.bgmAudio = null;
  }

  enableBgm(enabled) {
    this.bgmEnabled = !!enabled;
    if (!this.bgmEnabled && this.bgmAudio) this.bgmAudio.pause();
  }

  enableSfx(enabled) {
    this.sfxEnabled = !!enabled;
  }

  playSfx(key, type = '') {
    if (!this.sfxEnabled) return null;
    const audio = this.assets.sound(key, type);
    try {
      audio.currentTime = 0;
      audio.play();
    } catch (e) {}
    return audio;
  }

  playBgm(key, type = '') {
    if (!this.bgmEnabled) return null;
    const audio = this.assets.sound(key, type);
    if (this.bgmAudio && this.bgmAudio !== audio) this.bgmAudio.pause();
    this.bgmAudio = audio;
    try {
      audio.currentTime = 0;
      audio.loop = true;
      audio.play();
    } catch (e) {}
    return audio;
  }

  stopBgm() {
    if (!this.bgmAudio) return;
    this.bgmAudio.pause();
    this.bgmAudio = null;
  }
}
