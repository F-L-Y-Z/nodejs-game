let rewardedVideoAd = null;
let rewardedVideoAdState = 0;
let retryTime = 5;
let adCallback = null;

export function preloadAd(adUnitId, callback, platform = globalThis.wx) {
  adCallback = callback;
  if (!platform || !platform.createRewardedVideoAd) return false;
  if (!rewardedVideoAd) {
    rewardedVideoAdState = 1;
    rewardedVideoAd = platform.createRewardedVideoAd({ adUnitId });
    rewardedVideoAd.onLoad(() => {
      rewardedVideoAdState = 2;
    });
    rewardedVideoAd.onError(() => {
      if (retryTime > 0) {
        retryTime--;
        rewardedVideoAd.load();
      } else {
        rewardedVideoAdState = 3;
      }
    });
    rewardedVideoAd.onClose((res) => {
      if (adCallback) adCallback((res && res.isEnded) || res === undefined);
    });
  }
  if (rewardedVideoAdState === 3) {
    rewardedVideoAdState = 1;
    rewardedVideoAd.load();
  }
  return true;
}

export function showAd() {
  if (!rewardedVideoAd || rewardedVideoAdState !== 2) return false;
  rewardedVideoAd.show();
  return true;
}
