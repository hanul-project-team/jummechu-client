import React, { useState, useEffect, useRef, createRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { API } from '../../../../app/api'
import { Field, Label } from '@headlessui/react'
import { toast } from 'react-toastify'
import { CSSTransition } from 'react-transition-group'
import { loginSchema } from '../../schema/loginSchema'
import { login } from '../../slice/authSlice'
import VisibleBtn from '../../../../shared/VisibleBtn'
import CustomCheckBox from '../../../../shared/CustomCheckBox'

const LoginForm = ({ returnUrl }) => {
  const [passwordState, setPasswordState] = useState({
    hasValue: false,
    visible: false,
  })
  const [showError, setShowError] = useState({
    email: false,
    password: false,
  })
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
  })
  const errorRefs = useRef({
    email: createRef(null),
    password: createRef(null),
  })
  useEffect(() => {
    setFocus('email')
  }, [setFocus])
  useEffect(() => {
    setShowError(prev => ({
      ...prev,
      email: !!errors.email,
      password: !!errors.password,
    }))
  }, [errors.email, errors.password])

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
      const response = await API.post('/auth/login', data)
      reset()
      dispatch(login(response.data))
      if (returnUrl) {
        navigate(`${returnUrl}`)
      } else {
        navigate('/')
      }
    } catch (e) {
      if (e.response.status === 400) {
        toast.error(
          <div className="Toastify__toast-body cursor-default">
            잘못된 아이디 또는 비밀번호 입니다
          </div>,
          {
            position: 'top-center',
          },
        )
        resetField('password', { keepError: true })
        setFocus('password')
      } else {
        toast.error(
          <div className="Toastify__toast-body cursor-default">잠시 후 다시 시도해주세요</div>,
          {
            position: 'top-center',
          },
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
            className="border-color-gray-300 hover:border-color-gray-700 focus:ring-1 focus:border-color-gray-900 border rounded-lg grow py-4 px-3 outline-hidden"
            type="text"
            id="email"
            placeholder="이메일"
            {...register('email')}
          />
          <CSSTransition
            nodeRef={errorRefs.current.email}
            timeout={300}
            in={showError.email}
            classNames="fade"
          >
            <span
              ref={errorRefs.current.email}
              className="text-xs sm:text-sm text-color-red-700 cursor-default"
            >
              {errors.email?.message}
            </span>
          </CSSTransition>
        </div>
        <div className="relative flex flex-col gap-1.5">
          <label htmlFor="password" className="font-semibold">
            비밀번호
          </label>
          <input
            className="border-color-gray-300 hover:border-color-gray-700 focus:ring-1 focus:border-color-gray-900 border rounded-lg grow py-4 px-3 outline-hidden"
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
          <CSSTransition
            nodeRef={errorRefs.current.password}
            timeout={300}
            in={showError.password}
            classNames="fade"
          >
            <span
              ref={errorRefs.current.password}
              className="text-xs sm:text-sm text-color-red-700 cursor-default"
            >
              {errors.password?.message}
            </span>
          </CSSTransition>
        </div>
        <div className="flex justify-between">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Field className="flex items-center relative select-none">
                <Label className="w-20 ps-2 peer text-sm cursor-pointer absolute top-0 left-4 ">
                  로그인 유지
                </Label>
                <CustomCheckBox
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-4 h-4 peer-hover:border-color-gray-700"
                />
              </Field>
            )}
          />
          <Link to="/find_account" className="text-sm outline-hidden hover:underline">
            아이디·비밀번호 찾기
          </Link>
        </div>
        <button
          type="submit"
          className="font-semibold cursor-pointer border p-3 bg-color-gray-900 border-color-gray-900 text-white rounded-lg outline-hidden"
        >
          로그인
        </button>
      </fieldset>
    </form>
  )
}

export default LoginForm
