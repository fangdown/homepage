import crypto from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getCourse } from '@/lib/admin/courses'
import { createPendingOrder } from '@/lib/admin/orders'
import { buildZpaySubmitUrl } from '@/lib/zpay/build-submit-url'
import {
  getZpayGateway,
  getZpayKey,
  getZpayPid,
  getZpayTestChargeAmount,
  isZpayConfigured,
  isZpayTestAmountAllowed,
} from '@/lib/zpay/config'
import { siteOrigin } from '@/lib/site-url'
import { buyerFromAccessToken } from '@/lib/pay/buyer-from-token'

export async function POST(request: NextRequest) {
  if (!isZpayConfigured()) {
    return NextResponse.json(
      { error: '收款未配置：请在服务器环境变量中设置 ZPAY_PID、ZPAY_KEY（可选 ZPAY_GATEWAY）' },
      { status: 503 }
    )
  }

  let body: { courseId?: string; type?: string; useTestAmount?: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求体须为 JSON' }, { status: 400 })
  }

  const courseId = body.courseId?.trim()
  const type = body.type === 'wxpay' ? 'wxpay' : 'alipay'
  const useTestAmount = body.useTestAmount === true
  if (!courseId) {
    return NextResponse.json({ error: '缺少 courseId' }, { status: 400 })
  }

  if (useTestAmount && !isZpayTestAmountAllowed()) {
    return NextResponse.json(
      {
        error:
          '测试金额未启用：本地开发默认可用；生产请设置 ZPAY_ENABLE_TEST_PAY=1，或勿传 useTestAmount',
      },
      { status: 403 }
    )
  }

  const course = await getCourse(courseId)
  if (!course) {
    return NextResponse.json({ error: '课程不存在' }, { status: 404 })
  }

  const chargeAmount = useTestAmount ? getZpayTestChargeAmount() : Number(course.price)
  if (!(chargeAmount > 0)) {
    return NextResponse.json({ error: '价格无效' }, { status: 404 })
  }

  const out_trade_no = crypto.randomBytes(16).toString('hex')
  if (out_trade_no.length > 32) {
    return NextResponse.json({ error: '内部错误' }, { status: 500 })
  }

  const authHeader = request.headers.get('authorization')
  const bearer =
    authHeader?.toLowerCase().startsWith('bearer ') ? authHeader.slice(7).trim() : null
  const buyer = await buyerFromAccessToken(bearer)

  try {
    await createPendingOrder({
      out_trade_no,
      course_id: course.id,
      course_title: course.title,
      money: chargeAmount,
      pay_type: type,
      user_id: buyer.user_id,
      buyer_display_name: buyer.buyer_display_name,
      buyer_email: buyer.buyer_email,
    })
  } catch (e: unknown) {
    console.error('[zpay/create] createPendingOrder', e)
    const msg =
      e && typeof e === 'object' && 'message' in e && typeof (e as { message: unknown }).message === 'string'
        ? (e as { message: string }).message
        : String(e)
    const lower = msg.toLowerCase()
    let error = '创建订单失败'
    if (
      (lower.includes('relation') && lower.includes('does not exist')) ||
      lower.includes('schema cache') ||
      lower.includes('could not find the table')
    ) {
      error =
        '创建订单失败：数据库里没有 orders 表。请在 Supabase SQL Editor 执行迁移文件 20260421200000_orders.sql，并执行 20260421203000_orders_service_role.sql'
    } else if (lower.includes('permission denied') || lower.includes('row-level security')) {
      error =
        '创建订单失败：数据库拒绝写入。请确认 SUPABASE_SERVICE_ROLE_KEY 为「服务角色」密钥，并已执行 20260421203000_orders_service_role.sql'
    } else if (lower.includes('foreign key') || lower.includes('violates foreign key')) {
      error = '创建订单失败：课程在数据库中不存在或已被删除，请刷新课程页后重试'
    } else if (lower.includes('invalid api key') || lower.includes('jwt')) {
      error =
        '创建订单失败：Supabase 密钥无效。请确认 .env 中 SUPABASE_SERVICE_ROLE_KEY 为 Project Settings → API 里的 service_role secret（不是 anon）'
    }
    return NextResponse.json(
      { error, ...(process.env.NODE_ENV === 'development' && { debug: msg }) },
      { status: 500 }
    )
  }

  const origin = siteOrigin(request)
  const notify_url = `${origin}/api/pay/zpay/notify`
  const return_url = `${origin}/pay/return`
  const money = chargeAmount.toFixed(2)
  const pid = getZpayPid()!
  const key = getZpayKey()!
  const gateway = getZpayGateway()
  const cid = process.env.ZPAY_CID?.trim()

  const productName = useTestAmount
    ? `${course.title.slice(0, 80)}（测试¥0.01）`.slice(0, 100)
    : course.title.slice(0, 100)

  const payUrl = buildZpaySubmitUrl({
    gateway,
    pid,
    key,
    name: productName,
    money,
    type,
    out_trade_no,
    notify_url,
    return_url,
    param: course.id,
    cid: cid || undefined,
  })

  return NextResponse.json({ payUrl, out_trade_no })
}
