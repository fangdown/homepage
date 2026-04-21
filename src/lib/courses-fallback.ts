import type { Course } from '@/lib/admin/courses'

/** Shown when Supabase has no rows or is unreachable (local dev without migration). */
export const DEMO_COURSE: Course = {
  id: '00000000-0000-4000-8000-000000000000',
  title: '陪伴群',
  subtitle: '一群真在用 AI 干活的人',
  category: '永久社群',
  description:
    '这里聚集的是真正把 AI 用在日常工作中的人：交流落地经验、抢先获取前沿信息、试用老金自制的小工具。包含第一期录播《Claude Code 基础入门》，一次加入，长期有效。',
  features: [
    '第一期录播：Claude Code 基础入门',
    '各行业 AI 实践者聚集',
    'AI 前沿信息优先获取',
    '老金自制工具率先体验',
    '一次加入永久有效',
  ],
  price: 399,
  is_recommended: true,
  cta_label: '立即加入',
  sort_order: 0,
  created_at: '',
  updated_at: '',
}
