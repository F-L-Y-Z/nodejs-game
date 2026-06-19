export function applyCanvasScale(ctx, pixelRatio, allowScaleFallback = false) {
  if (ctx.setTransform) {
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  } else if (allowScaleFallback) {
    ctx.scale(pixelRatio, pixelRatio)
  }
}
