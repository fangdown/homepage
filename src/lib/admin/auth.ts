const ADMIN_PASSWORD = 'fang674123'

export interface ValidationResult {
  success: boolean
  error?: string
}

export async function validatePassword(password: string): Promise<ValidationResult> {
  if (!password || password.trim() === '') {
    return { success: false, error: '密码不能为空' }
  }

  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: '密码错误' }
  }

  return { success: true }
}
