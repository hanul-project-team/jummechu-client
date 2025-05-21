import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Field, Label } from '@headlessui/react'
import { toast } from 'react-toastify'
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
  const {
    register,
    handleSubmit,
    control,
    setFocus,
    reset,
    resetField,
    watch,
    setError,
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
      reset()
      dispatch(login(response.data))
      navigate('/')
    } catch (e) {
      if (e.response.status === 400) {
        setError('password', { message: e.response.data.message })
        resetField('password', { keepError: true })
        setFocus('password')
      } else {
        toast.error(
          <div>
            서버 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </div>,
          { autoClose: 3000 },
        )
      }
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
          <VisibleBtn
            changeVisible={changeVisible}
            setter={setPasswordState}
            visible={passwordState.visible}
            hasValue={passwordState.hasValue}
            className="absolute top-5 right-3 "
          />
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
        {errors.password && <span className={style.errorSpan}>{errors.password.message}</span>}
        <button type="submit">로그인</button>
      </fieldset>
    </form>
  )
}

export default LoginForm
