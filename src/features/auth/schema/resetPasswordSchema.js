import z from 'zod'

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .regex(/^(?=.*[A-Z,a-z])(?=.*\d)(?=.*[~!@#^*_=+-]).{8,}$/, '올바른 비밀번호 형식이 아닙니다'),
    passwordCheck: z.string().trim(),
  })
  .refine(data => data.password === data.passwordCheck, {
    path: ['passwordCheck'],
    message: '비밀번호가 일치하지 않습니다',
  })
