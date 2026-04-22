/**
 * 网关域名以控制台 / 文档为准；常见为 https://zpayz.cn
 * 环境变量（服务器，勿把 KEY 暴露到前端）：
 * - ZPAY_PID、ZPAY_KEY（必填）
 * - ZPAY_GATEWAY（可选，默认 https://zpayz.cn）
 * - ZPAY_CID（可选，支付渠道 ID）
 * - NEXT_PUBLIC_SITE_URL（生产必填，用于 notify_url / return_url 绝对地址）
 * - ZPAY_ENABLE_TEST_PAY=1：允许接口使用测试金额 ¥0.01（勿在生产开启）
 * @see https://z-pay.cn/doc.html
 */

const TEST_AMOUNT = 0.01

/** 开发环境默认允许；生产需显式 ZPAY_ENABLE_TEST_PAY=1，或 ZPAY_ENABLE_TEST_PAY=0 强制关闭 */
export function isZpayTestAmountAllowed(): boolean {
  const flag = process.env.ZPAY_ENABLE_TEST_PAY?.trim().toLowerCase()
  if (flag === '0' || flag === 'false' || flag === 'off') return false
  if (flag === '1' || flag === 'true' || flag === 'on') return true
  return process.env.NODE_ENV === 'development'
}

export function getZpayTestChargeAmount(): number {
  return TEST_AMOUNT
}
export function getZpayGateway(): string {
  const g = process.env.ZPAY_GATEWAY?.trim()
  return (g || 'https://zpayz.cn').replace(/\/$/, '')
}

export function getZpayPid(): string | null {
  const v = process.env.ZPAY_PID?.trim()
  return v || null
}

export function getZpayKey(): string | null {
  const v = process.env.ZPAY_KEY?.trim()
  return v || null
}

export function isZpayConfigured(): boolean {
  return Boolean(getZpayPid() && getZpayKey())
}
