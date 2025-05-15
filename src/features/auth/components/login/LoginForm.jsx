import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Field, Label } from '@headlessui/react'
import { loginSchema } from '../../schema/loginSchema'
import { login } from '../../authSlice'
import CustomCheckBox from '../../../../shared/CustomCheckBox'
import style from './loginForm.module.css'

const LoginForm = () => {
  const [visible, setVisible] = useState(false)
  const [isPassword, setIsPassword] = useState(false)
  const [serverError, setServerError] = useState()
  const {
    register,
    handleSubmit,
    control,
    setFocus,
    reset,
    resetField,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { rememberMe: false },
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const passwordValue = watch('password')
  useEffect(() => {
    if (passwordValue) {
      setIsPassword(true)
    } else {
      setIsPassword(false)
    }
  }, [passwordValue])
  const onSubmit = async data => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', data, {
        withCredentials: true,
      })
      setServerError('')
      reset()
      navigate('/')
      dispatch(login(response.data))
    } catch (e) {
      if (e.response.status === 400) {
        setServerError(e.response.data.message)
      } else {
        setServerError('다시 시도해주세요.')
      }
      resetField('password')
      setFocus('password')
    }
  }
  const onIsvalid = errors => {
    if (errors.email) {
      setFocus('email')
    } else if (errors.password) {
      setFocus('password')
    }
    resetField('password')
  }
  const changeVisible = () => {
    if (visible === true) {
      setVisible(false)
    } else {
      setVisible(true)
    }
  }
  return (
    <form
      className={style.loginForm}
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit, onIsvalid)}
    >
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
            type={visible ? 'text' : 'password'}
            id="password"
            placeholder=""
            {...register('password')}
          />
          <label htmlFor="password">비밀번호</label>
          <button type="button" onClick={changeVisible} className={isPassword ? 'flex' : 'hidden'}>
            {visible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
          </button>
        </div>
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <Field className="flex items-center cursor-pointer select-none gap-1">
              <CustomCheckBox checked={field.value} onChange={field.onChange} className="w-4 h-4" />
              <Label>로그인 유지</Label>
            </Field>
          )}
        />
        {errors.password && !serverError && (
          <span className={style.errorSpan}>{errors.password.message}</span>
        )}
        {!errors.password && serverError && <span className={style.errorSpan}>{serverError}</span>}
        {errors.password && serverError && <span className={style.errorSpan}>{serverError}</span>}
        <button type="submit">로그인</button>
      </fieldset>
    </form>
  )
}

export default LoginForm
