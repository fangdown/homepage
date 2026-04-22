"use client";

import { useState } from "react";
import type { Course } from "@/lib/admin/courses";
import { XIcon } from "@/components/Icons";
import { payRequestHeaders } from "@/lib/pay/pay-client";

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function SharePayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
      <path d="M17 11V7h-4" />
    </svg>
  );
}

type PayChannel = "alipay" | "wxpay";

export default function OrderConfirmModal({
  open,
  onClose,
  course,
}: {
  open: boolean;
  onClose: () => void;
  course: Course;
}) {
  const [payType, setPayType] = useState<PayChannel>("alipay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleConfirm() {
    setError("");
    setLoading(true);
    try {
      const headers = await payRequestHeaders();
      const res = await fetch("/api/pay/zpay/create", {
        method: "POST",
        headers,
        body: JSON.stringify({ courseId: course.id, type: payType }),
      });
      const data = (await res.json()) as { payUrl?: string; error?: string };
      if (!res.ok) {
        setError(data.error || "无法发起支付");
        setLoading(false);
        return;
      }
      if (!data.payUrl) {
        setError("未返回支付地址");
        setLoading(false);
        return;
      }
      window.location.href = data.payUrl;
    } catch {
      setError("网络错误，请重试");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#121218] p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
          aria-label="关闭"
        >
          <XIcon size={20} />
        </button>

        <div className="mb-6 flex items-center gap-2">
          <CreditCardIcon className="h-5 w-5 text-gold" />
          <h2 id="order-title" className="text-lg font-semibold text-white">
            确认订单
          </h2>
        </div>

        <div className="mb-6 rounded-xl border border-white/10 bg-black/30 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-white">{course.title}</p>
              <p className="mt-1 text-sm text-white/50">{course.subtitle}</p>
            </div>
            <p className="shrink-0 text-xl font-bold tabular-nums text-gold">¥{course.price.toFixed(2)}</p>
          </div>
        </div>

        <p className="mb-2 text-sm text-white/70">支付方式</p>
        <div className="mb-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPayType("alipay")}
            className={`rounded-lg border py-2.5 text-sm font-medium transition ${
              payType === "alipay"
                ? "border-gold/80 text-gold"
                : "border-white/15 text-white/50 hover:border-white/30"
            }`}
          >
            支付宝
          </button>
          <button
            type="button"
            onClick={() => setPayType("wxpay")}
            className={`rounded-lg border py-2.5 text-sm font-medium transition ${
              payType === "wxpay"
                ? "border-gold/80 text-gold"
                : "border-white/15 text-white/50 hover:border-white/30"
            }`}
          >
            微信支付
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-white/15 bg-transparent py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 disabled:opacity-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white
            bg-gradient-to-r from-[#00ff88] to-[#a855f7] disabled:opacity-60"
          >
            <SharePayIcon className="h-4 w-4" />
            {loading ? "跳转中…" : "确认支付"}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-white/35">
          将跳转至 Z-Pay 收银台完成付款；支付成功后订单会自动标记为已支付。
        </p>
      </div>
    </div>
  );
}
