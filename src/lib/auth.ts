import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function signInWithGoogle(): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  console.log('signInWithOAuth data.url:', data?.url)
  console.log('signInWithOAuth error:', error)
  if (error) throw error
  if (data?.url) {
    console.log('Redirecting to:', data.url)
    window.location.href = data.url
  }
}

export async function signOut(): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createBrowserSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.user_metadata?.name,
    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  const supabase = createBrowserSupabaseClient()
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
        avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
      }
      callback(user)
    } else {
      callback(null)
    }
  })
}

// Server-side client（用于 API routes）
export function createServerClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}