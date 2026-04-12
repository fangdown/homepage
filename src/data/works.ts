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
  },
  {
    id: "nodejs-api",
    title: "nodejs api",
    description: "基于 Express + Node.js 的 RESTful API 服务示例",
    tags: ["nodejs", "express"],
    githubUrl: "https://github.com/fangdown/nodejs-demo-api",
  },
  {
    id: "demo-mediapipe",
    title: "MediaPipe Demo",
    description: "使用 MediaPipe 实现实时人像分割与背景替换",
    tags: ["MediaPipe", "webgl", "Vue"],
    externalUrl: "https://fangdown.github.io/mediapipe-demo/",
    featured: true,
  },
];
