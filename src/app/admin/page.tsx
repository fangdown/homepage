const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:5174/";

export default function AdminMigratedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-gray-900">
      <section className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-medium text-gray-500">Fangdu Homepage</p>
        <h1 className="mb-4 text-2xl font-bold">管理后台已迁移</h1>
        <p className="mb-6 leading-7 text-gray-600">
          作品、课程和订单管理已统一迁移到 Fangdu Admin。当前站点继续保留首页、
          课程页、支付与 Z-Pay 通知能力，后台操作请从统一入口完成。
        </p>
        <a
          href={adminUrl}
          className="inline-flex rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          打开统一后台
        </a>
      </section>
    </main>
  );
}
