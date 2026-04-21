import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

const works = [
  {
    title: '聊天智能体',
    description: '一个基于 Vue3 + Node.js 的聊天智能体项目，支持 SSE 流式传输打字机效果，虚拟列表优化',
    github_url: 'https://github.com/fangdown/chat-demo',
    preview_url: 'https://fangdown.github.io/chat-demo/',
  },
  {
    title: 'nodejs api',
    description: '基于 Express + Node.js 的 RESTful API 服务示例',
    github_url: 'https://github.com/fangdown/nodejs-demo-api',
    preview_url: undefined,
  },
  {
    title: 'MediaPipe Demo',
    description: '使用 MediaPipe 实现实时人像分割与背景替换',
    github_url: undefined,
    preview_url: 'https://fangdown.github.io/mediapipe-demo/',
  },
  {
    title: 'ECharts 大数据渲染示例',
    description: '基于 Vue 3 + Vite + ECharts 6，展示多种大数据量图表的渲染策略。',
    github_url: 'https://github.com/fangdown/echarts-demo',
    preview_url: 'https://fangdown.github.io/echarts-demo/',
  },
  {
    title: '拖拽式页面构建器',
    description: '一个可视化的拖拽式页面构建器，使用 React + TypeScript + Zustand + Tailwind CSS 构建。',
    github_url: 'https://github.com/fangdown/drag-demo',
    preview_url: 'https://fangdown.github.io/drag-demo/',
  },
]

async function migrate() {
  console.log('Starting migration...')

  for (const work of works) {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert(work)
      .select()
      .single()

    if (error) {
      console.error(`Failed to insert "${work.title}":`, error.message)
    } else {
      console.log(`Inserted: ${data.title} (${data.id})`)
    }
  }

  console.log('Migration complete!')
}

migrate().catch(console.error)