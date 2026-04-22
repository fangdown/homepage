import { NextRequest } from 'next/server'
import { markOrderPaidFromNotify } from '@/lib/admin/orders'
import { getZpayKey, isZpayConfigured } from '@/lib/zpay/config'
import { zpayVerify } from '@/lib/zpay/sign'

/** Z-Pay 会反复重试 notify；禁用缓存，避免 GET 被 CDN 误缓存成固定响应 */
export const dynamic = 'force-dynamic'

function collectParams(req: NextRequest): Record<string, string> {
  const out: Record<string, string> = {}
  req.nextUrl.searchParams.forEach((v, k) => {
    out[k] = v
  })
  return out
}

async function readBodyParams(req: NextRequest): Promise<Record<string, string>> {
  const raw = await req.text()
  if (!raw.trim()) return {}
  const o: Record<string, string> = {}
  if (raw.trim().startsWith('{')) {
    try {
      const j = JSON.parse(raw) as Record<string, unknown>
      for (const [k, v] of Object.entries(j)) {
        if (v != null && v !== '') o[k] = String(v)
      }
      return o
    } catch {
      return {}
    }
  }
  const sp = new URLSearchParams(raw)
  sp.forEach((v, k) => {
    o[k] = v
  })
  return o
}

async function handleNotify(params: Record<string, string>): Promise<Response> {
  const plain = {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  } as const

  if (!isZpayConfigured()) {
    return new Response('fail', { status: 503, ...plain })
  }

  const key = getZpayKey()!
  if (!zpayVerify(params, key)) {
    console.warn('[zpay/notify] sign verify failed', {
      out_trade_no: params.out_trade_no,
      keys: Object.keys(params).sort().join(','),
    })
    return new Response('fail', { status: 400, ...plain })
  }

  if (params.trade_status !== 'TRADE_SUCCESS') {
    return new Response('success', { status: 200, ...plain })
  }

  const out_trade_no = params.out_trade_no
  if (!out_trade_no) {
    return new Response('fail', { status: 400, ...plain })
  }

  const result = await markOrderPaidFromNotify({
    out_trade_no,
    zpay_trade_no: params.trade_no || null,
    notifyMoney: params.money || '0',
    raw_notify: params,
  })

  if (result === 'missing' || result === 'money_mismatch' || result === 'db_error') {
    console.warn('[zpay/notify] mark paid failed', {
      result,
      out_trade_no,
      notifyMoney: params.money,
      trade_no: params.trade_no,
    })
    return new Response('fail', { status: 400, ...plain })
  }

  return new Response('success', { status: 200, ...plain })
}

export async function GET(request: NextRequest) {
  return handleNotify(collectParams(request))
}

export async function POST(request: NextRequest) {
  const fromBody = await readBodyParams(request)
  const fromQuery = collectParams(request)
  return handleNotify({ ...fromQuery, ...fromBody })
}
