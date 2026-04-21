"use client";

import { useState } from "react";
import type { Course } from "@/lib/admin/courses";
import { XIcon } from "@/components/Icons";

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

export default function OrderConfirmModal({
  open,
  onClose,
  course,
}: {
  open: boolean;
  onClose: () => void;
  course: Course;
}) {
  const [confirmed, setConfirmed] = useState(false);

  if (!open) return null;

  function handleConfirm() {
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 400);
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
        <button
          type="button"
          className="mb-8 w-full rounded-lg border border-gold/80 bg-transparent py-2.5 text-sm font-medium text-gold"
        >
          支付宝
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/15 bg-transparent py-3 text-sm font-medium text-white/70 transition hover:bg-white/5"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={confirmed}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white
            bg-gradient-to-r from-[#00ff88] to-[#a855f7] disabled:opacity-60"
          >
            <SharePayIcon className="h-4 w-4" />
            {confirmed ? "已确认（演示）" : "确认支付"}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-white/35">演示环境，不会发起真实扣款。</p>
      </div>
    </div>
  );
}
