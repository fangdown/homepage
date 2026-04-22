import { zpaySign } from './sign'

/** 页面跳转支付 submit.php（GET/POST 均可，此处生成带查询参数的 GET URL） */
export function buildZpaySubmitUrl(opts: {
  gateway: string
  pid: string
  key: string
  name: string
  money: string
  type: 'alipay' | 'wxpay'
  out_trade_no: string
  notify_url: string
  return_url: string
  param?: string
  cid?: string
}): string {
  const params: Record<string, string> = {
    pid: opts.pid,
    type: opts.type,
    name: opts.name,
    money: opts.money,
    out_trade_no: opts.out_trade_no,
    notify_url: opts.notify_url,
    return_url: opts.return_url,
  }
  if (opts.param) params.param = opts.param
  if (opts.cid) params.cid = opts.cid

  const sign = zpaySign(params, opts.key)
  const u = new URL('/submit.php', opts.gateway)
  const all: Record<string, string> = { ...params, sign, sign_type: 'MD5' }
  for (const [k, v] of Object.entries(all)) {
    u.searchParams.set(k, v)
  }
  return u.toString()
}
