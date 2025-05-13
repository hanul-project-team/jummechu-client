import z from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().trim().toLowerCase().min(8, '비밀번호는 최소 8자 이상입니다.').regex(/^(?=.*[a-z](?=.*\d)())$/),
})
