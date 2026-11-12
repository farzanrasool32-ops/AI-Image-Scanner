import { useState } from 'react'
import type { ScanRecord, ScanResult } from '../types/scan.types'
import { formatDate } from '../utils/formatDate'

const HISTORY_KEY = 'image-scanner-history'
type HistoryExportFormat = 'json' | 'txt'

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

function isScanRecord(value: unknown): value is ScanRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<ScanRecord>
  return typeof record.id === 'string' &&
    typeof record.filename === 'string' &&
    typeof record.createdAt === 'string' &&
    ['comprehensive', 'text', 'product', 'scene'].includes(String(record.mode)) &&
    isScanResult(record.result)
}

function readHistory(key: string): ScanRecord[] {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter(isScanRecord) : []
  } catch (error) {
    console.error('Could not read saved scan history:', error)
    return []
  }
}

export default function useScanHistory(userId: string, onStorageError: (message: string) => void) {
  const storageKey = userId === 'guest' ? HISTORY_KEY : `${HISTORY_KEY}:${userId}`
  const [historyState, setHistoryState] = useState(() => ({
    storageKey,
    records: readHistory(storageKey),
  }))
  if (historyState.storageKey !== storageKey) {
    setHistoryState({ storageKey, records: readHistory(storageKey) })
  }
  const history = historyState.storageKey === storageKey
    ? historyState.records
    : readHistory(storageKey)

  const saveHistory = (records: ScanRecord[]) => {
    setHistoryState({ storageKey, records })
    try {
      localStorage.setItem(storageKey, JSON.stringify(records))
    } catch (error) {
      console.error('Could not save scan history:', error)
      onStorageError('The scan completed, but browser storage is full. Export your history or remove older scans to save new ones.')
    }
  }

  const removeHistoryRecord = (id: string) => {
    saveHistory(history.filter((record) => record.id !== id))
  }

  const exportHistory = (format: HistoryExportFormat) => {
    const content = format === 'json'
      ? JSON.stringify(history, null, 2)
      : history.map((record) => `${record.filename} — ${formatDate(record.createdAt)}\n${record.result.description}\n`).join('\n')
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `image-scanner-history.${format}`
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return { history, saveHistory, removeHistoryRecord, exportHistory }
}
