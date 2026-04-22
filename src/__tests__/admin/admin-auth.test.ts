import { beforeEach, describe, expect, it } from 'vitest'
import { validatePassword } from '@/lib/admin/auth'

describe('管理后台 - 密码验证', () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = 'vitest-admin-secret'
  })

  it('正确密码应该验证通过', async () => {
    const result = await validatePassword('vitest-admin-secret')
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

  it('未配置 ADMIN_PASSWORD 时应提示', async () => {
    delete process.env.ADMIN_PASSWORD
    const result = await validatePassword('any')
    expect(result.success).toBe(false)
    expect(result.error).toContain('ADMIN_PASSWORD')
  })
})
