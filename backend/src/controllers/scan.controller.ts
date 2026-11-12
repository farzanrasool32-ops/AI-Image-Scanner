import type { RequestHandler } from 'express'
import { geminiFailure, analyzeImage, isScanMode } from '../services/geminiService'
import { convertImageToJpeg, extractImageMetrics, readImageDimensions } from '../services/imageProcessing'

export const scanImage: RequestHandler = async (request, response) => {
  if (!request.file) {
    response.status(400).json({ error: 'Choose an image to scan.' })
    return
  }
  const mode = request.body.mode ?? 'comprehensive'
  if (!isScanMode(mode)) {
    response.status(400).json({ error: 'Choose a valid scan mode.' })
    return
  }

  let dimensions
  try {
    dimensions = await readImageDimensions(request.file.buffer)
  } catch (error) {
    console.warn('Rejected unreadable image upload:', error)
    response.status(400).json({ error: 'The uploaded file is not a readable image.' })
    return
  }

  try {
    const metrics = await extractImageMetrics(request.file.buffer)
    const jpeg = await convertImageToJpeg(request.file.buffer)
    const analysis = await analyzeImage(jpeg, mode, dimensions)
    analysis.colors = metrics.colors
    analysis.quality = {
      resolution: `${dimensions.width} × ${dimensions.height} (${dimensions.format.toUpperCase()})`,
      brightness: metrics.brightness,
      contrast: metrics.contrast,
      sharpness: metrics.sharpness,
      notes: metrics.notes,
    }
    response.json({ result: analysis })
  } catch (error) {
    console.error('Image scan failed:', error)
    const failure = geminiFailure(error, 'scan')
    response.status(failure.status).json({ error: failure.error })
  }
}
