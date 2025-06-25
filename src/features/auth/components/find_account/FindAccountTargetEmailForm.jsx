import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { targetEmailSchema } from '../../schema/targetEmailSchema'
import { toast } from 'react-toastify'
import { CSSTransition } from 'react-transition-group'
import { API } from '../../../../app/api'
import { useMediaQuery } from 'react-responsive'

const FindAccountTargetEmailForm = ({ nextStep }) => {
  const [showError, setShowError] = useState(false)
  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(targetEmailSchema),
  })
  const isMobile = useMediaQuery({ maxWidth: '640px' })
  const errorRef = useRef(null)
  useEffect(() => {
    if (!isMobile) setFocus('email')
  }, [isMobile, setFocus])
  useEffect(() => {
    setShowError(!!errors.email)
  }, [errors.email])
  const onSubmit = async data => {
    try {
      await API.post('/auth/target', data)
      reset()
      nextStep()
    } catch (e) {
      if (e.response.status === 404) {
        toast.error(
          <div className="Toastify__toast-body cursor-default">가입된 계정이 아닙니다</div>,
          {
            position: 'top-center',
          },
        )
        resetField('email')
        setFocus('email')
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
  const onIsValid = errors => {
    if (errors.email) {
      setFocus('email')
    }
  }
  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onIsValid)}>
      <fieldset className="flex flex-col gap-3">
        <legend className="hidden">이메일 설정 폼</legend>
        <div className="flex flex-col gap-1.5">
          <input
            className="border-color-gray-300 hover:border-color-gray-700 focus:ring-1 focus:border-color-gray-900 border rounded-lg grow py-4 px-3 outline-hidden"
            type="text"
            placeholder="이메일"
            {...register('email')}
          />
          <CSSTransition nodeRef={errorRef} timeout={300} in={showError} classNames="fade">
            <span ref={errorRef} className="text-xs sm:text-sm text-color-red-700 cursor-default">
              {errors.email?.message}
            </span>
          </CSSTransition>
        </div>
        <button
          type="submit"
          className="border border-color-gray-900 p-3 bg-color-gray-900 text-white rounded-lg outline-hidden cursor-pointer "
        >
          비밀번호 찾기
        </button>
      </fieldset>
    </form>
  )
}

export default FindAccountTargetEmailForm
