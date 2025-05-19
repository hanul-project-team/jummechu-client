import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Field, Label } from '@headlessui/react'
import { loginSchema } from '../../schema/loginSchema'
import { login } from '../../authSlice'
import VisibleBtn from '../../../../shared/VisibleBtn'
import CustomCheckBox from '../../../../shared/CustomCheckBox'
import style from './loginForm.module.css'

const LoginForm = () => {
  const [passwordState, setPasswordState] = useState({
      hasValue: false,
      visible: false,
    })
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
      setPasswordState(prev => ({
        ...prev,
        hasValue: !!passwordValue,
      }))
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
    resetField('password', { keepError: true })
  }
  const changeVisible = setter => {
    setter(prev => ({
      ...prev,
      visible: !prev.visible,
    }))
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
            type={passwordState.visible ? 'text' : 'password'}
            id="password"
            placeholder=""
            {...register('password')}
          />
          <label htmlFor="password">비밀번호</label>
          <VisibleBtn changeVisible={changeVisible}
            setter={setPasswordState}
            visible={passwordState.visible}
            hasValue={passwordState.hasValue}
            className="absolute top-5 right-3 "  />
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
        {(errors.password || serverError) && (
          <span className={style.errorSpan}>
            {errors.password?.message || serverError}
          </span>
        )}
        <button type="submit">로그인</button>
      </fieldset>
    </form>
  )
}

export default LoginForm
