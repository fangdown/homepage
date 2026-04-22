import { describe, it, expect } from 'vitest'
import { validateProject } from '@/lib/admin/projects'

describe('添加作品 - 验证规则', () => {
  it('正常情况：标题、描述、链接都填了，应该成功', async () => {
    const data = {
      title: '我的作品',
      description: '这是一个很棒的作品',
      githubUrl: 'https://github.com/user/repo',
      previewUrl: 'https://user.github.io/repo',
    }

    const result = await validateProject(data)

    expect(result.success).toBe(true)
  })

  it('标题为空：应该报错"标题不能为空"', async () => {
    const data = {
      title: '',
      description: '这是一个很棒的作品',
      githubUrl: 'https://github.com/user/repo',
      previewUrl: 'https://user.github.io/repo',
    }

    const result = await validateProject(data)

    expect(result.success).toBe(false)
    expect(result.error).toBe('标题不能为空')
  })

  it('非空标题：校验通过（重复标题由数据库唯一约束在保存时报错）', async () => {
    const data = {
      title: '已存在的作品',
      description: '这是一个很棒的作品',
      githubUrl: 'https://github.com/user/repo',
      previewUrl: 'https://user.github.io/repo',
    }

    const result = await validateProject(data)

    expect(result.success).toBe(true)
  })
})
