import type { NextRequest } from 'next/server'

/** 生成绝对站点根 URL（支付 notify/return 必须可公网访问）。优先 NEXT_PUBLIC_SITE_URL。 */
export function siteOrigin(request: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (env) return env.replace(/\/$/, '')

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') ?? 'http'
  if (!host) return 'http://localhost:3000'
  return `${proto}://${host}`
}
