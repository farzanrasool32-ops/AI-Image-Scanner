import sharp from 'sharp'
import type { Color, ImageDimensions, ImageMetrics } from '../types/analysis'

function colorName(red: number, green: number, blue: number) {
  const maximum = Math.max(red, green, blue)
  const minimum = Math.min(red, green, blue)
  if (maximum < 45) return 'Black'
  if (minimum > 220) return 'White'
  if (maximum - minimum < 28) return maximum > 175 ? 'Light gray' : 'Gray'
  if (red === maximum && green > blue * 1.35) return red > 200 && green > 135 ? 'Orange' : 'Yellow'
  if (red === maximum && blue > green * 1.2) return 'Pink'
  if (red === maximum) return 'Red'
  if (green === maximum && blue > red * 1.15) return 'Cyan'
  if (green === maximum) return 'Green'
  if (blue === maximum && red > green * 1.2) return 'Purple'
  return 'Blue'
}

export async function readImageDimensions(buffer: Buffer): Promise<ImageDimensions> {
  const metadata = await sharp(buffer, { limitInputPixels: 40_000_000 }).metadata()
  if (!metadata.width || !metadata.height || !metadata.format) {
    throw new Error('The uploaded file is not a readable image.')
  }
  return { width: metadata.width, height: metadata.height, format: metadata.format }
}

export async function extractImageMetrics(buffer: Buffer): Promise<ImageMetrics> {
  const stats = await sharp(buffer, { limitInputPixels: 40_000_000 })
    .rotate()
    .removeAlpha()
    .toColourspace('srgb')
    .stats()
  const rgbChannels = stats.channels.slice(0, 3)
  const brightnessValue = rgbChannels.reduce((total, channel) => total + channel.mean, 0) / rgbChannels.length
  const contrastValue = rgbChannels.reduce((total, channel) => total + channel.stdev, 0) / rgbChannels.length
  const brightness = brightnessValue < 70 ? 'Very dark' : brightnessValue < 105 ? 'Dark' : brightnessValue > 210 ? 'Very bright' : brightnessValue > 180 ? 'Bright' : 'Balanced'
  const contrast = contrastValue < 28 ? 'Low contrast' : contrastValue > 68 ? 'High contrast' : 'Moderate contrast'

  const { data, info } = await sharp(buffer, { limitInputPixels: 40_000_000 })
    .rotate()
    .resize({ width: 96, height: 96, fit: 'inside' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
  let edgeTotal = 0
  let edgeCount = 0
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const current = data[y * info.width + x]
      if (x + 1 < info.width) {
        edgeTotal += Math.abs(current - data[y * info.width + x + 1])
        edgeCount += 1
      }
      if (y + 1 < info.height) {
        edgeTotal += Math.abs(current - data[(y + 1) * info.width + x])
        edgeCount += 1
      }
    }
  }
  const edgeDetail = edgeCount ? edgeTotal / edgeCount : 0
  const sharpness = edgeDetail < 4 ? 'Low edge detail' : edgeDetail < 12 ? 'Moderate detail' : 'Clear detail'
  const notes = edgeDetail < 4
    ? 'Low edge detail may indicate a soft, blurred, or low-detail image.'
    : ''

  const { data: pixels, info: pixelInfo } = await sharp(buffer, { limitInputPixels: 40_000_000 })
    .rotate()
    .resize({ width: 96, height: 96, fit: 'inside' })
    .removeAlpha()
    .toColourspace('srgb')
    .raw()
    .toBuffer({ resolveWithObject: true })
  const histogram = new Map<number, number>()
  for (let offset = 0; offset + 2 < pixels.length; offset += pixelInfo.channels) {
    const key = ((pixels[offset] >> 4) << 8) | ((pixels[offset + 1] >> 4) << 4) | (pixels[offset + 2] >> 4)
    histogram.set(key, (histogram.get(key) ?? 0) + 1)
  }
  const selected: Color[] = []
  for (const [key] of [...histogram.entries()].sort((left, right) => right[1] - left[1])) {
    const red = (((key >> 8) & 15) << 4) + 8
    const green = (((key >> 4) & 15) << 4) + 8
    const blue = ((key & 15) << 4) + 8
    if (selected.some((color) => {
      const prior = color.rgb.split(', ').map(Number)
      return Math.hypot(red - prior[0], green - prior[1], blue - prior[2]) < 42
    })) continue
    const hex = `#${[red, green, blue].map((channel) => Math.min(channel, 255).toString(16).padStart(2, '0')).join('')}`
    selected.push({ name: colorName(red, green, blue), hex, rgb: `${red}, ${green}, ${blue}` })
    if (selected.length === 6) break
  }

  return { colors: selected, brightness, contrast, sharpness, notes }
}

export function convertImageToJpeg(buffer: Buffer) {
  return sharp(buffer, { limitInputPixels: 40_000_000 })
    .rotate()
    .jpeg({ quality: 90 })
    .toBuffer()
}
