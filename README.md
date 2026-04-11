# Fangdu | Developer Portfolio

个人全栈开发者主页，基于 Next.js 16 + React 19 + Tailwind CSS 4 构建。

## 技术栈

- **框架**: Next.js 16.2.3 (App Router)
- **UI**: React 19.2.4
- **样式**: Tailwind CSS 4 + CSS Variables
- **图标**: Lucide React
- **字体**: Geist Sans + Geist Mono

## 项目结构

```
src/
├── app/
│   ├── layout.tsx      # 根布局 (Navbar + Footer + Background)
│   ├── page.tsx        # 首页 (Hero + WorksSection)
│   └── globals.css     # 全局样式
├── components/
│   ├── Hero.tsx        # 主-hero 区域
│   ├── WorksSection.tsx # 作品展示区
│   ├── WorkCard.tsx    # 作品卡片组件
│   ├── Navbar.tsx      # 导航栏
│   ├── Footer.tsx      # 页脚
│   ├── Background.tsx  # 动态背景容器
│   ├── MatrixRain.tsx  # 矩阵雨效果
│   ├── CyberGrid.tsx   # 赛博网格效果
│   └── Icons.tsx       # 图标组件
└── data/
    └── works.ts        # 作品数据
```

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 生产预览
npm run start
```

## 页面功能

- **Hero 区域**: 展示个人简介与定位
- **作品展示**: 卡片式展示开源项目，支持 GitHub 链接和外部链接
- **动态背景**: 矩阵雨 + 赛博网格视觉效果
- **响应式设计**: 适配各种屏幕尺寸

## 开发命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 (http://localhost:3000) |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 检查 |
