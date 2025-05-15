import z from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().trim().regex(/^(?=.*[A-Z,a-z])(?=.*\d)(?=.*[~!@#^*_=+-]).{8,}$/, '이메일 또는 비밀번호가 잘못 되었습니다. 이메일과 비밀번호를 정확히 입력해 주세요'),
  rememberMe: z.boolean().optional()
})
