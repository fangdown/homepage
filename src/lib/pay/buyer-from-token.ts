import { createClient } from '@supabase/supabase-js'

export interface BuyerSnapshot {
  user_id: string | null
  buyer_display_name: string | null
  buyer_email: string | null
}

/** 用前端传来的 access_token 校验并解析购买人（不落库 token） */
export async function buyerFromAccessToken(accessToken: string | null | undefined): Promise<BuyerSnapshot> {
  const empty: BuyerSnapshot = { user_id: null, buyer_display_name: null, buyer_email: null }
  if (!accessToken?.trim()) return empty

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return empty

  const supabase = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${accessToken.trim()}` } },
  })

  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return empty

  const user = data.user
  const meta = user.user_metadata as Record<string, unknown> | undefined
  const fullName = typeof meta?.full_name === 'string' ? meta.full_name.trim() : ''
  const name = typeof meta?.name === 'string' ? meta.name.trim() : ''
  const display =
    fullName || name || (user.email ? user.email.split('@')[0] : '') || null

  return {
    user_id: user.id,
    buyer_display_name: display,
    buyer_email: user.email ?? null,
  }
}
