import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Field, Label } from '@headlessui/react'
import { toast } from 'react-toastify'
import { loginSchema } from '../../schema/loginSchema'
import { login } from '../../slice/authSlice'
import VisibleBtn from '../../../../shared/VisibleBtn'
import CustomCheckBox from '../../../../shared/CustomCheckBox'

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
    
  })
  useEffect(() => {
    setFocus('email')
  }, [setFocus])
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
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onIsvalid)}>
      <fieldset className="flex flex-col gap-3">
        <legend className="hidden">로그인 폼</legend>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="font-semibold">
            이메일
          </label>
          <input
            className="border border-color-gray-300 hover:border-color-gray-700 focus:border-color-gray-900 rounded-md grow py-4 px-3 outline-hidden border-md"
            type="text"
            id="email"
            placeholder="이메일"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-color-red-700 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div className="relative flex flex-col gap-1.5">
          <label htmlFor="password" className="font-semibold">
            비밀번호
          </label>
          <input
            className="border border-color-gray-300 hover:border-color-gray-700 focus:border-color-gray-900 rounded-md grow py-4 px-3 outline-hidden border-md"
            type={passwordState.visible ? 'text' : 'password'}
            id="password"
            placeholder="비밀번호"
            {...register('password')}
          />
          <VisibleBtn
            changeVisible={changeVisible}
            setter={setPasswordState}
            visible={passwordState.visible}
            hasValue={passwordState.hasValue}
            className="absolute top-13 right-3"
          />
        </div>
        <div className='flex justify-between'>
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Field className="flex items-center cursor-pointer select-none gap-1">
                <CustomCheckBox
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-4 h-4"
                />
                <Label className='text-sm cursor-pointer'>로그인 유지</Label>
              </Field>
            )}
          />
          <Link className='text-sm outline-hidden hover:underline'>아이디·비밀번호 찾기</Link>
        </div>
        {errors.password && (
          <span className="text-color-red-700 text-sm">{errors.password.message}</span>
        )}
        <button
          type="submit"
          className="cursor-pointer border p-3 bg-color-gray-900 border-color-gray-900 text-white rounded-lg outline-hidden"
        >
          로그인
        </button>
      </fieldset>
    </form>
  )
}

export default LoginForm
