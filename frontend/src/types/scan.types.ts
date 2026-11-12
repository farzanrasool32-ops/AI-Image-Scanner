export type ScanMode = 'comprehensive' | 'text' | 'product' | 'scene'

export type ScanColor = {
  name: string
  hex: string
  rgb: string
}

export type ImageQuality = {
  resolution: string
  brightness: string
  contrast: string
  sharpness: string
  notes: string
}

export type ScanResult = {
  description: string
  category: string
  objects: string[]
  extractedText: string
  documentType: string
  products: string[]
  scene: string
  background: string
  colors: ScanColor[]
  quality: ImageQuality
}

export type ScanRecord = {
  id: string
  filename: string
  mode: ScanMode
  createdAt: string
  result: ScanResult
}

export type ChatTurn = {
  role: 'user' | 'assistant'
  text: string
}

export type ChatMessage = ChatTurn

export const scanModes: { id: ScanMode; title: string; caption: string }[] = [
  { id: 'comprehensive', title: 'Full analysis', caption: 'A complete breakdown of your image' },
  { id: 'text', title: 'Extract text', caption: 'Read text and understand documents' },
  { id: 'product', title: 'Product lookup', caption: 'Identify products and their details' },
  { id: 'scene', title: 'Scene analysis', caption: 'Explore the setting and environment' },
]

export function modeLabel(mode: ScanMode) {
  return scanModes.find((item) => item.id === mode)?.title ?? 'Full analysis'
}