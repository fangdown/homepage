# Fangdu · Homepage

个人开发者主页与轻量商业化站点：**作品展示**、**课程/产品页**、**Z-Pay（易支付兼容）收款**与**Supabase 账号**。技术栈为 **Next.js 16（App Router）**、**React 19**、**Tailwind CSS 4**、**Supabase**。

线上示例域名：**fangdu.chat**（部署时请把环境变量里的站点 URL 与 Supabase 回调配置为实际域名，含 `www` 若使用子域）。

---

## 功能概览

| 模块 | 说明 |
|------|------|
| **首页** | Hero、作品区；数据来自 Supabase `projects`（失败时有占位与重试提示）。 |
| **动态背景** | 矩阵雨 + 赛博网格，覆盖首页与课程页的视觉氛围。 |
| **Courses** | 课程列表（`courses` 表），卡片展示价格与购买入口。 |
| **支付** | 创建订单 → 跳转 Z-Pay；**异步通知** `POST/GET /api/pay/zpay/notify` 更新订单为已支付；浏览器同步跳转 `/pay/return`。 |
| **认证** | Google 登录（Supabase Auth），`/auth/callback` 交换 session。 |

---

## 技术栈

- **框架**: Next.js 16.2（App Router、Server Actions）
- **UI**: React 19、Tailwind CSS 4、CSS 变量主题
- **数据与鉴权**: Supabase（`@supabase/supabase-js`、`@supabase/ssr`）
- **图标**: Lucide React + 项目内 `Icons`
- **字体**: Geist Sans / Geist Mono
- **测试**: Vitest（`npm test`）

---

## 仓库结构（节选）

```
src/
├── app/
│   ├── layout.tsx           # 根布局：AppChrome（背景/导航/页脚按路由切换）
│   ├── page.tsx             # 首页
│   ├── globals.css
│   ├── actions.ts           # Server Actions（首页作品读取等）
│   ├── courses/page.tsx     # 课程页
│   ├── auth/callback/       # OAuth 回调
│   ├── pay/return/          # 支付完成说明页
│   └── api/pay/zpay/        # create（下单跳转） / notify（异步通知）
├── components/
│   ├── AppChrome.tsx        # 客户端：背景、导航、页脚外壳
│   ├── Navbar.tsx / Footer.tsx / Background.tsx / …
│   ├── courses/             # 课程卡片、下单弹窗、矩阵背景等
├── lib/
│   ├── admin/               # projects、courses、orders、auth
│   ├── zpay/                # 签名、拼单、网关配置
│   ├── site-url.ts          # 站点绝对根 URL（支付 notify/return）
│   ├── auth.ts              # 浏览器端 Supabase 会话
│   └── supabase.ts          # 服务端 service role 客户端
├── data/works.ts            # 首页作品兜底/静态数据（与 DB 配合）
└── __tests__/               # Vitest

supabase/migrations/         # SQL 迁移（profiles、courses、orders 等）
vitest.config.ts / vitest.setup.ts
```

---

## 快速开始

```bash
npm install
# 在项目根创建 .env.local，变量见下文「环境变量」（勿提交密钥）
npm run dev                  # http://localhost:3000
```

```bash
npm run build    # 生产构建
npm run start    # 生产启动
npm run lint     # ESLint
npm test         # Vitest
```

---

## 环境变量

在 **`.env.local`**（本地）或托管平台 **Environment Variables**（生产）中配置。**勿将含密钥的文件提交到 Git**。

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 匿名密钥（浏览器可用） |
| `SUPABASE_SERVICE_ROLE_KEY` | **服务角色**密钥（仅服务端；订单与支付逻辑需要） |
| `NEXT_PUBLIC_SITE_URL` | **生产强烈建议设置**，例如 `https://www.fangdu.chat`；用于生成 Z-Pay `notify_url` / `return_url`，须与浏览器实际访问域名一致 |
| `ZPAY_PID` / `ZPAY_KEY` | Z-Pay 商户 PID 与密钥 |
| `ZPAY_GATEWAY` | 可选，默认 `https://zpayz.cn` |
| `ZPAY_CID` | 可选，渠道 ID |
| `ZPAY_ENABLE_TEST_PAY` | 生产勿开启；开发/测试金额逻辑见 `src/lib/zpay/config.ts` |

**Supabase 控制台**：Authentication → URL 与 Redirect URLs 中需包含 `https://你的域名/auth/callback`。

---

## 数据库

使用 **Supabase** 托管 Postgres。迁移文件位于 `supabase/migrations/`，请在 Supabase SQL Editor 或 CLI 中按顺序应用。主要表包括：

- `profiles`（与 Auth 同步）
- `projects`（作品）
- `courses`（课程）
- `orders`（订单；支付结果由 notify 更新）

具体 RLS 与 service role 策略以迁移文件为准。

作品、课程和订单的后台管理已迁移到独立 `admin` 项目，并通过 `nodejs-api`
的 `/v1/admin/homepage/*` 接口写入本项目 Supabase。

---

## 支付与订单

1. 前端调用 **`POST /api/pay/zpay/create`**（含课程 ID、支付方式等），服务端创建 `pending` 订单并返回收银台 URL。  
2. 用户支付完成后，**Z-Pay 服务器**请求 **`/api/pay/zpay/notify`**（验签、`TRADE_SUCCESS`、金额一致后落库 `paid`）。  
3. 若订单长期停留在待支付，优先检查：**`NEXT_PUBLIC_SITE_URL`**、托管日志中是否出现 `notify` 请求、以及 Z-Pay 商户后台异步通知状态。

---

## 安全与部署提示

- Service Role、Z-Pay 密钥仅保存在服务端环境变量。
- 生产环境建议开启 **HTTPS**，并配置 `next.config.ts` 中已有基础安全响应头。  
- `next/image` 已为 Google 头像与 Gravatar 配置 `images.remotePatterns`（见 `next.config.ts`）。

---

## 许可证

私有项目或未声明许可证时，默认保留所有权利；如需开源请自行补充 `LICENSE` 与脱敏说明。
