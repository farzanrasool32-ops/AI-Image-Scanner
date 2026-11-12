export async function getApiError(response: Response) {
  const body = await response.text()
  if (body) {
    try {
      const payload: unknown = JSON.parse(body)
      if (payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string') {
        return payload.error
      }
    } catch {
      // Non-JSON responses are handled using their HTTP status below.
    }
  }

  if (response.status === 502) {
    return 'Cannot reach the image analysis API. Start or restart the backend server, then try again.'
  }
  if (response.status === 503) {
    return 'The API server is unavailable. Check that the backend is running, then try again.'
  }
  return `Request failed (${response.status}).`
}

export async function fetchApi(input: RequestInfo | URL, init?: RequestInit) {
  try {
    return await fetch(input, { credentials: 'include', ...init })
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'Cannot connect to the API server. Start or restart the backend server, then try again.',
        { cause: error },
      )
    }
    throw error
  }
}
