import type { NextRequest } from 'next/server'

function inferProto(request: NextRequest, host: string): string {
  const forwarded = request.headers.get('x-forwarded-proto')
  if (forwarded) {
    return forwarded.split(',')[0].trim().toLowerCase()
  }
  const h = host.toLowerCase()
  if (h.startsWith('localhost') || h.startsWith('127.0.0.1')) {
    return 'http'
  }
  // 生产常见：反代未传 x-forwarded-proto，若默认 http 会导致 notify_url 为 http，
  // 网关可能无法回调或用户混用域名。公网域名默认 https。
  return 'https'
}

/** 生成绝对站点根 URL（支付 notify/return 必须可公网访问）。优先 NEXT_PUBLIC_SITE_URL。 */
export function siteOrigin(request: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (env) return env.replace(/\/$/, '')

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (!host) return 'http://localhost:3000'
  const proto = inferProto(request, host)
  return `${proto}://${host}`
}
