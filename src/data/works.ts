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
  {
    id: "1",
    title: "AI Code Assistant",
    description: "基于大语言模型的代码助手，支持多语言代码补全和解释",
    tags: ["Python", "LangChain", "React"],
    githubUrl: "https://github.com",
    featured: true,
  },
  {
    id: "2",
    title: "Personal Dashboard",
    description: "个人数据仪表盘，聚合天气、任务、日历等信息",
    tags: ["Next.js", "Tailwind", "API"],
    githubUrl: "https://github.com",
    externalUrl: "https://example.com",
    featured: true,
  },
  {
    id: "3",
    title: "CLI Tools",
    description: "日常开发命令行工具集，提升开发效率",
    tags: ["Go", "CLI", "DevOps"],
    githubUrl: "https://github.com",
  },
  {
    id: "4",
    title: "Image Processor",
    description: "批量图片处理工具，支持压缩、转换、裁剪",
    tags: ["Python", "Pillow", "GUI"],
    githubUrl: "https://github.com",
  },
];
