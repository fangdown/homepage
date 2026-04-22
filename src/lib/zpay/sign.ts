import crypto from 'node:crypto'

/**
 * Z-Pay / 易支付 MD5 签名（文档：https://z-pay.cn/doc.html ）
 * 参与签名的参数：除 sign、sign_type 外所有非空参数，按参数名 ASCII 升序，拼接为 a=b&c=d，再末尾拼接商户 KEY 后 MD5（小写）。
 */
export function zpaySignString(params: Record<string, string>): string {
  const keys = Object.keys(params)
    .filter((k) => k !== 'sign' && k !== 'sign_type')
    .filter((k) => {
      const v = params[k]
      return v !== '' && v !== undefined && v !== null
    })
    .sort((a, b) => a.localeCompare(b))
  return keys.map((k) => `${k}=${params[k]}`).join('&')
}

export function zpaySign(params: Record<string, string>, merchantKey: string): string {
  const base = zpaySignString(params)
  return crypto.createHash('md5').update(base + merchantKey).digest('hex').toLowerCase()
}

export function zpayVerify(params: Record<string, string>, merchantKey: string): boolean {
  const sign = params.sign?.toLowerCase()
  if (!sign) return false
  return zpaySign(params, merchantKey) === sign
}
