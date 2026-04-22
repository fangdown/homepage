export interface ValidationResult {
  success: boolean
  error?: string
}

/**
 * 管理后台密码仅从环境变量读取，勿写入代码仓库。
 * 本地：在 .env.local 设置 ADMIN_PASSWORD=你的强密码
 * 生产：在托管平台配置同名密钥变量
 *
 * 必须在服务端调用（例如 Server Action `loginAdminAction`）。客户端组件里直接调用读不到环境变量。
 */
export async function validatePassword(password: string): Promise<ValidationResult> {
  if (!password || password.trim() === '') {
    return { success: false, error: '密码不能为空' }
  }

  const expected = process.env.ADMIN_PASSWORD?.trim()
  if (!expected) {
    return {
      success: false,
      error: '服务器未配置 ADMIN_PASSWORD，无法验证管理后台',
    }
  }

  if (password !== expected) {
    return { success: false, error: '密码错误' }
  }

  return { success: true }
}
