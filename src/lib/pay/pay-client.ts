"use client";

import { createBrowserSupabaseClient } from "@/lib/auth";

/** 创建支付 API 请求头：附带 Supabase 会话，便于服务端写入购买人快照 */
export async function payRequestHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const supabase = createBrowserSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }
  return headers;
}
