const apiBase = import.meta.env.VITE_API_BASE_URL ?? ''

export type ApiHealth = {
  status: string
  aiConfigured: boolean
}

export async function checkApiHealth(): Promise<ApiHealth> {
  const response = await fetch(`${apiBase}/api/health`)
  if (!response.ok) throw new Error(`API health check failed (${response.status}).`)
  const payload: unknown = await response.json()
  if (!payload || typeof payload !== 'object' ||
      !('status' in payload) || typeof payload.status !== 'string' ||
      !('aiConfigured' in payload) || typeof payload.aiConfigured !== 'boolean') {
    throw new Error('The API returned an invalid health response.')
  }
  return { status: payload.status, aiConfigured: payload.aiConfigured }
}