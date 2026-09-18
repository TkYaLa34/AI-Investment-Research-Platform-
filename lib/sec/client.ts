/**
 * SEC EDGAR Client Utility
 *
 * Implements compliant SEC EDGAR API interactions:
 * - User-Agent header (User-Agent: InvestRadarAI admin@investradar.ai)
 * - Rate limit: Max 10 requests per second (100ms throttle)
 * - Caching via Next.js fetch revalidation
 */

const SEC_USER_AGENT = process.env.SEC_USER_AGENT || 'InvestRadarAI admin@investradar.ai'

let lastRequestTime = 0

async function enforceRateLimit() {
  const now = Date.now()
  const timeSinceLast = now - lastRequestTime
  if (timeSinceLast < 100) {
    await new Promise((resolve) => setTimeout(resolve, 100 - timeSinceLast))
  }
  lastRequestTime = Date.now()
}

export async function secClientFetch<T = any>(url: string, revalidateSeconds = 3600): Promise<T> {
  await enforceRateLimit()

  const response = await fetch(url, {
    headers: {
      'User-Agent': SEC_USER_AGENT,
      'Accept-Encoding': 'gzip, deflate',
    },
    next: { revalidate: revalidateSeconds },
  })

  if (!response.ok) {
    throw new Error(`SEC EDGAR API HTTP ${response.status}: ${response.statusText} (${url})`)
  }

  return response.json() as Promise<T>
}
