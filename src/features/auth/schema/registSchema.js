import z from 'zod'

export const registScheam = z
  .object({
    email: z.string().trim().email('올바른 이메일 형식을 입력해주세요.'),
    password: z
      .string()
      .trim()
      .regex(/^(?=.*[A-Z,a-z])(?=.*\d)(?=.*[~!@#^*_=+-]).{8,}$/, '올바른 비밀번호 형식이 아닙니다'),
    passwordCheck: z.string().trim(),
    name: z
      .string()
      .trim()
      .regex(/^[가-힣]{3,5}$/, '이름을 입력해주세요'),
    phone: z.string().regex(/^01[016789][0-9]{8}$/,'휴대전화 번호를 확인해주세요'),
    code: z.string().regex(/^\d{6}$/)
  })
  .refine(data => data.password === data.passwordCheck, {
    path: ['passwordCheck'],
    message: '비밀번호가 일치하지 않습니다',
  })
