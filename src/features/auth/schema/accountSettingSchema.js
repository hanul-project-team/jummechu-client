import z from 'zod'

export const accountSettingSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[가-힣]{2,5}$/, '이름은 두 글자 이상 입력해주세요.'),
  phone: z.string().regex(/^01[016789][0-9]{8}$/, '휴대전화 번호를 확인해주세요'),
  code: z.string().regex(/^\d{6}$/),
  service: z.boolean(),
  privacy: z.boolean(),
  business: z.boolean(),
})
