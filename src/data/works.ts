export interface Work {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  externalUrl?: string;
  featured?: boolean;
}

export const works: Work[] = [
  {
    id: "chat-agent",
    title: "聊天智能体",
    description:
      "一个基于 Vue3 + Node.js 的聊天智能体项目，支持 SSE 流式传输打字机效果，虚拟列表优化",
    tags: ["vue3", "SSE", "虚拟列表"],
    githubUrl: "https://github.com/fangdown/chat-demo",
    externalUrl: "https://fangdown.github.io/chat-demo/",
    featured: true,
  },
  {
    id: "nodejs-api",
    title: "nodejs api",
    description: "基于 Express + Node.js 的 RESTful API 服务示例",
    tags: ["nodejs", "express"],
    githubUrl: "https://github.com/fangdown/nodejs-demo-api",
    featured: true,
  },
  {
    id: "demo-mediapipe",
    title: "MediaPipe Demo",
    description: "使用 MediaPipe 实现实时人像分割与背景替换",
    tags: ["MediaPipe", "webgl", "Vue"],
    externalUrl: "https://fangdown.github.io/mediapipe-demo/",
    featured: true,
  },
  {
    id: "echarts-bigdata",
    title: "ECharts 大数据渲染示例",
    description:
      "基于 Vue 3 + Vite + ECharts 6，展示多种大数据量图表的渲染策略。",
    tags: ["Vue3", "Vite", "ECharts"],
    githubUrl: "https://github.com/fangdown/echarts-demo",
    externalUrl: "https://fangdown.github.io/echarts-demo/",
    featured: true,
  },
  {
    id: "drag-demo",
    title: "拖拽式页面构建器",
    description:
      "一个可视化的拖拽式页面构建器，使用 React + TypeScript + Zustand + Tailwind CSS 构建。",
    tags: ["React", "Zustand", "Tailwind", "TypeScript", "playwright"],
    githubUrl: "https://github.com/fangdown/drag-demo",
    externalUrl: "https://fangdown.github.io/drag-demo/",
  },
];
