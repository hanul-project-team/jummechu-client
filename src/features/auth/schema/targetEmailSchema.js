import z from 'zod'

export const targetEmailSchema = z.object({
  email: z.string().trim().email('올바른 이메일 형식을 입력해주세요.'),
})
