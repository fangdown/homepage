"use client";

import { useState } from "react";
import type { Course } from "@/lib/admin/courses";
import OrderConfirmModal from "./OrderConfirmModal";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.9 5.8L4 10l5.1 3.7L7.2 22 12 18.2 16.8 22l-1.9-8.3L20 10l-6.1-1.2z" strokeLinejoin="round" />
    </svg>
  );
}

export default function CourseCard({ course }: { course: Course }) {
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <>
      <article
        className="relative max-w-md mx-auto rounded-2xl border border-gold/60 bg-[#0c0c10]/95 p-6 shadow-[0_0_24px_rgba(0,255,136,0.12)] backdrop-blur-sm
        before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:ring-1 before:ring-gold/30"
      >
        {course.is_recommended && (
          <div
            className="absolute right-4 top-4 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white
            bg-gradient-to-r from-[#00ff88] to-[#a855f7]"
          >
            <StarIcon className="h-3.5 w-3.5" />
            推荐
          </div>
        )}

        <p className="mb-1 text-sm font-medium text-[#a855f7]">{course.category}</p>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">{course.title}</h1>
        <p className="mb-4 text-sm font-medium text-gold">{course.subtitle}</p>
        <p className="mb-6 text-sm leading-relaxed text-white/65">{course.description}</p>

        <ul className="mb-8 space-y-2.5">
          {course.features.map((line, i) => (
            <li key={i} className="flex gap-2 text-sm text-white/80">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <p className="mb-5 text-3xl font-bold tabular-nums text-white">
          ¥{course.price.toFixed(2)}
        </p>

        <button
          type="button"
          onClick={() => setOrderOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white
          bg-gradient-to-r from-[#00ff88] to-[#a855f7] shadow-[0_0_20px_rgba(0,255,136,0.25)] transition hover:opacity-95"
        >
          <SparklesIcon className="h-4 w-4" />
          {course.cta_label}
        </button>
      </article>

      <OrderConfirmModal
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        course={course}
      />
    </>
  );
}
