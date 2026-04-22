import Link from "next/link";

export default function PayReturnPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="mb-3 text-2xl font-bold text-foreground">支付结果</h1>
      <p className="mb-2 text-sm text-foreground/70">
        若您已完成付款，订单状态会在几秒内由服务器自动更新；也可稍后在管理后台「订单」中查看。
      </p>
      <p className="mb-8 text-xs text-foreground/45">未扣款成功请勿重复支付；如有问题请联系站长。</p>
      <Link
        href="/courses"
        className="rounded-xl border border-gold/50 px-6 py-2.5 text-sm font-medium text-gold transition hover:bg-gold/10"
      >
        返回课程
      </Link>
    </div>
  );
}
