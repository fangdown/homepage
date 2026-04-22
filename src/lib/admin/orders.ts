import { supabaseAdmin } from '@/lib/supabase'

export type OrderStatus = 'pending' | 'paid' | 'cancelled'
export type PayType = 'alipay' | 'wxpay'

export interface Order {
  id: string
  out_trade_no: string
  course_id: string | null
  course_title: string
  money: number
  pay_type: PayType
  status: OrderStatus
  zpay_trade_no: string | null
  raw_notify: unknown
  user_id: string | null
  buyer_display_name: string | null
  buyer_email: string | null
  created_at: string
  updated_at: string
}

function rowFromDb(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    out_trade_no: String(row.out_trade_no),
    course_id: row.course_id != null ? String(row.course_id) : null,
    course_title: String(row.course_title ?? ''),
    money: Number(row.money ?? 0),
    pay_type: (row.pay_type === 'wxpay' ? 'wxpay' : 'alipay') as PayType,
    status: (['pending', 'paid', 'cancelled'].includes(String(row.status))
      ? row.status
      : 'pending') as OrderStatus,
    zpay_trade_no: row.zpay_trade_no != null ? String(row.zpay_trade_no) : null,
    raw_notify: row.raw_notify,
    user_id: row.user_id != null ? String(row.user_id) : null,
    buyer_display_name: row.buyer_display_name != null ? String(row.buyer_display_name) : null,
    buyer_email: row.buyer_email != null ? String(row.buyer_email) : null,
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  }
}

const ORDERS_LIST_LIMIT = 300

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(ORDERS_LIST_LIMIT)

  if (error) throw error
  return (data ?? []).map((r) => rowFromDb(r as Record<string, unknown>))
}

export async function getOrderByOutTradeNo(out_trade_no: string): Promise<Order | null> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('out_trade_no', out_trade_no)
    .maybeSingle()

  if (error || !data) return null
  return rowFromDb(data as Record<string, unknown>)
}

export async function createPendingOrder(input: {
  out_trade_no: string
  course_id: string | null
  course_title: string
  money: number
  pay_type: PayType
  user_id?: string | null
  buyer_display_name?: string | null
  buyer_email?: string | null
}): Promise<Order> {
  const now = new Date().toISOString()
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert({
      out_trade_no: input.out_trade_no,
      course_id: input.course_id,
      course_title: input.course_title,
      money: input.money,
      pay_type: input.pay_type,
      status: 'pending',
      user_id: input.user_id ?? null,
      buyer_display_name: input.buyer_display_name ?? null,
      buyer_email: input.buyer_email ?? null,
      updated_at: now,
    })
    .select()
    .single()

  if (error) throw error
  return rowFromDb(data as Record<string, unknown>)
}

export type MarkPaidResult = 'ok' | 'already_paid' | 'missing' | 'money_mismatch' | 'db_error'

/** 异步通知：验签与 trade_status 由调用方处理；此处只做金额与状态落库（幂等）。 */
export async function markOrderPaidFromNotify(input: {
  out_trade_no: string
  zpay_trade_no: string | null
  notifyMoney: string
  raw_notify: Record<string, string>
}): Promise<MarkPaidResult> {
  const now = new Date().toISOString()
  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from('orders')
    .select('id,status,money')
    .eq('out_trade_no', input.out_trade_no)
    .maybeSingle()

  if (fetchErr || !existing) return 'missing'

  const orderMoney = Number(existing.money).toFixed(2)
  const paidMoney = Number(input.notifyMoney).toFixed(2)
  if (orderMoney !== paidMoney) return 'money_mismatch'

  if (existing.status === 'paid') {
    await supabaseAdmin
      .from('orders')
      .update({
        raw_notify: input.raw_notify,
        updated_at: now,
      })
      .eq('out_trade_no', input.out_trade_no)
    return 'already_paid'
  }

  const { error } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'paid',
      zpay_trade_no: input.zpay_trade_no,
      raw_notify: input.raw_notify,
      updated_at: now,
    })
    .eq('out_trade_no', input.out_trade_no)
    .eq('status', 'pending')

  if (error) return 'db_error'
  return 'ok'
}
