import { describe, it, expect } from 'vitest'
import { validatePassword } from '@/lib/admin/auth'

describe('管理后台 - 密码验证', () => {
  it('正确密码应该验证通过', async () => {
    const result = await validatePassword('fang674123')
    expect(result.success).toBe(true)
  })

  it('错误密码应该验证失败', async () => {
    const result = await validatePassword('wrongpassword')
    expect(result.success).toBe(false)
    expect(result.error).toBe('密码错误')
  })

  it('空密码应该验证失败', async () => {
    const result = await validatePassword('')
    expect(result.success).toBe(false)
    expect(result.error).toBe('密码不能为空')
  })
})
