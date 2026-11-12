import type { ChatTurn } from '../types/scan.types'
import { fetchApi, getApiError } from './apiErrors'

const apiBase = import.meta.env.VITE_API_BASE_URL ?? ''

export async function chatAboutImage(file: File, turns: ChatTurn[]): Promise<string> {
  const body = new FormData()
  body.append('image', file)
  body.append('question', turns.at(-1)?.text ?? '')
  body.append('turns', JSON.stringify(turns.slice(0, -1)))
  const response = await fetchApi(`${apiBase}/api/chat`, { method: 'POST', body })
  if (!response.ok) throw new Error(await getApiError(response))
  const payload: unknown = await response.json()
  if (!payload || typeof payload !== 'object' || !('answer' in payload) || typeof payload.answer !== 'string') {
    throw new Error('The server returned an invalid chat response.')
  }
  return payload.answer
}