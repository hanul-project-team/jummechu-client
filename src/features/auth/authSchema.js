import z from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().trim().toLowerCase().regex(/^(?=.*[a-z])(?=.*\d)(?=.*[~!@#^*_=+-]).{8,}$/, '올바른 비밀번호 형식이 아닙니다.'),
  rememberMe: z.boolean().optional()
})
