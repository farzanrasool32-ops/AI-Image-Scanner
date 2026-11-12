import type { ScanMode, ScanRecord, ScanResult } from '../types/scan.types'
import { fetchApi, getApiError } from './apiErrors'

const apiBase = import.meta.env.VITE_API_BASE_URL ?? ''

function isScanResult(value: unknown): value is ScanResult {
  if (!value || typeof value !== 'object') return false
  const result = value as Partial<ScanResult>
  return typeof result.description === 'string' &&
    typeof result.category === 'string' &&
    Array.isArray(result.objects) && result.objects.every((item) => typeof item === 'string') &&
    typeof result.extractedText === 'string' &&
    typeof result.documentType === 'string' &&
    Array.isArray(result.products) && result.products.every((item) => typeof item === 'string') &&
    typeof result.scene === 'string' &&
    typeof result.background === 'string' &&
    Array.isArray(result.colors) && result.colors.every((color) => color && typeof color.name === 'string' && typeof color.hex === 'string' && typeof color.rgb === 'string') &&
    !!result.quality && typeof result.quality.resolution === 'string' &&
    typeof result.quality.brightness === 'string' &&
    typeof result.quality.contrast === 'string' &&
    typeof result.quality.sharpness === 'string' &&
    typeof result.quality.notes === 'string'
}

export async function scanImage(file: File, mode: ScanMode): Promise<ScanResult> {
  const body = new FormData()
  body.append('image', file)
  body.append('mode', mode)
  const response = await fetchApi(`${apiBase}/api/scan`, { method: 'POST', body })
  if (!response.ok) throw new Error(await getApiError(response))
  const payload: unknown = await response.json()
  if (!payload || typeof payload !== 'object' || !('result' in payload) || !isScanResult(payload.result)) {
    throw new Error('The server returned an invalid scan response.')
  }
  return payload.result
}

export async function downloadPdfReport(record: ScanRecord) {
  const response = await fetchApi(`${apiBase}/api/reports/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  })
  if (!response.ok) throw new Error(await getApiError(response))
  if (!response.headers.get('content-type')?.includes('application/pdf')) {
    throw new Error('The server did not return a PDF report.')
  }
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${record.filename.replace(/\.[^.]+$/, '')}-report.pdf`
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}