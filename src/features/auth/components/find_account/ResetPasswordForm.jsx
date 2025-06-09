import React, { useState, useEffect, useRef, createRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema } from '../../schema/resetPasswordSchema'
import { toast } from 'react-toastify'
import { CSSTransition } from 'react-transition-group'
import VisibleBtn from '../../../../shared/VisibleBtn'
import axios from 'axios'

const ResetPasswordForm = ({ resetToken }) => {
  const [passwordState, setPasswordState] = useState({
    hasValue: false,
    visible: false,
  })
  const [passwordCheckState, setPasswordCheckState] = useState({
    hasValue: false,
    visible: false,
  })
  const [showError, setShowError] = useState({
    password: false,
    passwordCheck: false,
  })
  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })
  const navigate = useNavigate()
  const passwordValue = watch('password')
  const passwordCheckValue = watch('passwordCheck')
  const errorRefs = useRef({
    password: createRef(null),
    passwordCheck: createRef(null),
  })
  useEffect(() => {
    setFocus('password')
  }, [setFocus])
  useEffect(() => {
    setPasswordState(prev => ({
      ...prev,
      hasValue: !!passwordValue,
    }))
  }, [passwordValue])
  useEffect(() => {
    setPasswordCheckState(prev => ({
      ...prev,
      hasValue: !!passwordCheckValue,
    }))
  }, [passwordCheckValue])
  useEffect(() => {
    setShowError(prev => ({
      ...prev,
      password: !!errors.password,
      passwordCheck: !!errors.passwordCheck,
    }))
  }, [errors.password, errors.passwordCheck])
  const onSubmit = async data => {
    const submitData = { password: data.password, resetToken: resetToken }
    try {
      await axios.post('http://localhost:3000/auth/reset_password', submitData)
      reset()
      navigate('/login')
    } catch (e) {
      if (e.response.status === 400 || e.response.status === 401 || e.response.status === 404) {
        toast.error(
          <div className="Toastify__toast-body cursor-default">
            유효하지 않거나 만료된 링크입니다
          </div>,
          {
            position: 'top-center',
          },
        )
        navigate('/find_account?type=password')
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
    if (errors.password) {
      setFocus('password')
    } else if (errors.passwordCheck) {
      setFocus('passwordCheck')
    }
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
        <legend className="hidden">비밀번호 재설정 폼</legend>
        <div className="flex flex-col relative gap-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="font-semibold">
              새 비밀번호
            </label>
            <span className="text-color-gray-700 text-xs cursor-default">
              영문/숫자/특수문자(~!@#^*_=+-) 포함 8자 이상
            </span>
          </div>
          <input
            className="border-color-gray-300 hover:border-color-gray-700 focus:ring-1 focus:border-color-gray-900 border rounded-lg grow py-4 px-3 outline-hidden"
            type={passwordState.visible ? 'text' : 'password'}
            id="password"
            placeholder="새 비밀번호"
            {...register('password')}
          />
          <VisibleBtn
            changeVisible={changeVisible}
            setter={setPasswordState}
            visible={passwordState.visible}
            hasValue={passwordState.hasValue}
            className="absolute top-[51px] right-3 "
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
        <div className="flex flex-col relative gap-1.5">
          <label htmlFor="passwordCheck" className="font-semibold">
            새 비밀번호 확인
          </label>
          <input
            className="border-color-gray-300 hover:border-color-gray-700 focus:ring-1 focus:border-color-gray-900 border rounded-lg grow py-4 px-3 outline-hidden"
            type={passwordCheckState.visible ? 'text' : 'password'}
            id="passwordCheck"
            placeholder="새 비밀번호 확인"
            {...register('passwordCheck')}
          />
          <VisibleBtn
            changeVisible={changeVisible}
            setter={setPasswordCheckState}
            visible={passwordCheckState.visible}
            hasValue={passwordCheckState.hasValue}
            className="absolute top-[51px] right-3 "
          />
          <CSSTransition
            nodeRef={errorRefs.current.passwordCheck}
            timeout={300}
            in={showError.passwordCheck}
            classNames="fade"
          >
            <span
              ref={errorRefs.current.passwordCheck}
              className="text-xs sm:text-sm text-color-red-700 cursor-default"
            >
              {errors.passwordCheck?.message}
            </span>
          </CSSTransition>
        </div>
        <button
          type="submit"
          className="font-semibold cursor-pointer border p-3 bg-color-gray-900 border-color-gray-900 text-white rounded-lg outline-hidden"
        >
          비밀번호 변경
        </button>
      </fieldset>
    </form>
  )
}

export default ResetPasswordForm
