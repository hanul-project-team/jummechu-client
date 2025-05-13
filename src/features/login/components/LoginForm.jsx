import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../loginSchema'
import style from './loginForm.module.css'

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })
  useEffect(() => {
    if (errors.email) {
      setFocus('email')
    } else if (errors.password) {
      setFocus('password')
    }
  }, [errors, setFocus])
  const onSubmit = data => {
    console.log(data)
  }
  return (
    <form className={style.loginForm} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="flex flex-col gap-3">
        <legend className="hidden">로그인 폼</legend>
        <div className={`${style.loginFormField} flex flex-col`}>
          <input className="grow" type="text" id="email" placeholder="" {...register('email')} />
          <label htmlFor="email">이메일</label>
          {errors.email && <span className={style.errorSpan}>{errors.email.message}</span>}
        </div>
        <div className={`${style.loginFormField} flex flex-col`}>
          <input
            className="grow"
            type="password"
            id="password"
            placeholder=""
            {...register('password')}
          />
          <label htmlFor="password">비밀번호</label>
          {errors.password && <span className={style.errorSpan}>{errors.password.message}</span>}
        </div>
        <button type="submit">로그인</button>
      </fieldset>
    </form>
  )
}

export default LoginForm
