'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Order } from '@/lib/admin/orders'
import { listOrdersAction } from '@/app/actions'

function statusLabel(s: Order['status']) {
  switch (s) {
    case 'paid':
      return '已支付'
    case 'pending':
      return '待支付'
    case 'cancelled':
      return '已取消'
    default:
      return s
  }
}

function buyerCell(o: Order) {
  if (o.buyer_display_name || o.buyer_email) {
    return (
      <div>
        <div className="font-medium text-gray-900">{o.buyer_display_name || '—'}</div>
        {o.buyer_email && <div className="text-xs text-gray-500">{o.buyer_email}</div>}
      </div>
    )
  }
  return <span className="text-gray-400">未登录</span>
}

export default function AdminOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadOrders = useCallback(async (opts?: { silent?: boolean }) => {
    if (opts?.silent) setRefreshing(true)
    try {
      const data = await listOrdersAction()
      setOrders(data)
    } catch (e) {
      console.error(e)
    } finally {
      if (opts?.silent) setRefreshing(false)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadOrders()
  }, [loadOrders])

  useEffect(() => {
    const id = setInterval(() => {
      void loadOrders({ silent: true })
    }, 2500)

    const onVis = () => {
      if (!document.hidden) void loadOrders({ silent: true })
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [loadOrders])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
        <span className="ml-3 text-gray-500">加载订单...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-end gap-2">
        {refreshing && <span className="text-xs text-gray-400">同步中…</span>}
        <button
          type="button"
          onClick={() => void loadOrders({ silent: true })}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          刷新
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-400">暂无订单</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full min-w-[880px]">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-left text-sm font-medium text-gray-600">商户订单号</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">课程</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">购买用户</th>
                <th className="p-3 text-right text-sm font-medium text-gray-600">金额</th>
                <th className="p-3 text-center text-sm font-medium text-gray-600">渠道</th>
                <th className="p-3 text-center text-sm font-medium text-gray-600">状态</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">平台单号</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">创建时间</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-b-0">
                  <td className="p-3 font-mono text-xs text-gray-800">{o.out_trade_no}</td>
                  <td className="p-3 text-sm text-gray-900">{o.course_title}</td>
                  <td className="p-3 text-sm">{buyerCell(o)}</td>
                  <td className="p-3 text-right tabular-nums text-sm">¥{Number(o.money).toFixed(2)}</td>
                  <td className="p-3 text-center text-sm text-gray-600">
                    {o.pay_type === 'wxpay' ? '微信' : '支付宝'}
                  </td>
                  <td className="p-3 text-center text-sm">
                    <span
                      className={
                        o.status === 'paid'
                          ? 'text-green-700'
                          : o.status === 'pending'
                            ? 'text-amber-700'
                            : 'text-gray-500'
                      }
                    >
                      {statusLabel(o.status)}
                    </span>
                  </td>
                  <td className="max-w-[140px] truncate p-3 font-mono text-xs text-gray-500">
                    {o.zpay_trade_no || '—'}
                  </td>
                  <td className="p-3 text-xs text-gray-500">
                    {o.created_at?.slice(0, 19).replace('T', ' ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-gray-400">
        支付成功后由 Z-Pay 异步通知更新状态；本页约每 2.5 秒自动刷新，切回标签页时也会立即拉取。
      </p>
    </div>
  )
}
