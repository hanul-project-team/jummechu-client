import z from 'zod'

export const loginSchema = z.object({
  email: z
    .string({ required_error: '올바른 이메일 형식을 입력해주세요' })
    .trim()
    .email('올바른 이메일 형식을 입력해주세요'),
  password: z
    .string({ required_error: '영문, 숫자, 특수문자(~!@#^*_=+-) 포함 8자 이상이어야 합니다' })
    .trim()
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#^*_=+-]).{8,}$/,
      '영문, 숫자, 특수문자(~!@#^*_=+-) 포함 8자 이상이어야 합니다',
    ),
  rememberMe: z.boolean().optional(),
})
