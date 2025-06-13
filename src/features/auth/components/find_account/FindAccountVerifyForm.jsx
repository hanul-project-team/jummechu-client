import React, { useEffect, useState, useRef, createRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { CSSTransition } from 'react-transition-group'
import { find } from '../../slice/findAccountSlice'
import { verifySchema } from '../../schema/verifySchema'
import Timer from '../../../../shared/Timer'
import { API } from '../../../../app/api'

const FindAccountVerifyForm = ({ type }) => {
  const [isPhone, setIsPhone] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [isRequested, setIsRequested] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [showError, setShowError] = useState({
    name: false,
    phone: false,
  })
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getValues,
    resetField,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifySchema),
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const phoneValue = watch('phone')
  const codeValue = watch('code')
  const errorRefs = useRef({
    name: createRef(null),
    phone: createRef(null),
  })
  useEffect(() => {
    setFocus('name')
  }, [setFocus])
  useEffect(() => {
    const isValid = /^01[016789][0-9]{8}$/.test(phoneValue)
    setIsPhone(!!isValid)
  }, [phoneValue])
  useEffect(() => {
    const isValid = /^\d{6}$/.test(codeValue)
    setIsCode(!!isValid)
  }, [codeValue])
  useEffect(() => {
    setShowError(prev => ({
      ...prev,
      name: !!errors.name,
      phone: !!errors.phone,
    }))
  }, [errors.name, errors.phone])
  const phoneSubmit = async () => {
    const isValid = await trigger('phone')
    if (isValid) {
      try {
        const phone = getValues('phone')
        // await API.post('/auth/send_code', { phone })
        setIsRequested(true)
        resetField('code')
        setFocus('code')
        setTimerKey(prev => prev + 1)
      } catch {
        toast.error(
          <div className="Toastify__toast-body cursor-default">잠시 후 다시 시도해주세요</div>,
          {
            position: 'top-center',
          },
        )
      }
    }
  }
  const onSubmit = async data => {
    try {
      // await API.post('/auth/verify_code', { code: data.code })
      const submitData = { name: data.name, phone: data.phone }
      const response = await API.post('/auth/find_account', submitData)
      dispatch(find(response.data))
      navigate(`/find_account/result?type=${type}`)
    } catch (e) {
      if (e.response.status === 400) {
        toast.error(
          <div className="Toastify__toast-body cursor-default">인증코드가 일치하지 않습니다</div>,
          {
            position: 'top-center',
          },
        )
        resetField('code')
        setFocus('code')
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
    if (errors.name) {
      setFocus('name')
    } else if (errors.phone) {
      setFocus('phone')
    } else if (errors.code) {
      setFocus('code')
    }
  }
  const onExpire = () => {
    setIsRequested(false)
    resetField('code')
  }
  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onIsValid)}>
      <fieldset className="flex flex-col gap-3">
        <legend className="hidden">sms 인증 폼</legend>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="font-semibold">
            이름
          </label>
          <input
            className="border-color-gray-300 hover:border-color-gray-700 focus:ring-1 focus:border-color-gray-900 border rounded-lg grow py-4 px-3 outline-hidden"
            type="text"
            id="name"
            placeholder="이름"
            {...register('name')}
          />
          <CSSTransition
            nodeRef={errorRefs.current.name}
            timeout={300}
            in={showError.name}
            classNames="fade"
          >
            <span
              ref={errorRefs.current.name}
              className="text-xs sm:text-sm text-color-red-700 cursor-default"
            >
              {errors.name?.message}
            </span>
          </CSSTransition>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="font-semibold">
            전화번호
          </label>
          <div className="flex gap-3">
            <input
              className="border-color-gray-300 hover:border-color-gray-700 focus:ring-1 focus:border-color-gray-900 border rounded-lg grow py-4 px-3 outline-hidden"
              type="text"
              id="phone"
              placeholder="'-'제외 숫자만 입력해주세요"
              maxLength={11}
              {...register('phone')}
              onInput={e => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11)
              }}
            />
            {!isRequested && (
              <button
                type="button"
                onClick={phoneSubmit}
                disabled={!isPhone}
                className="bg-color-gray-900 disabled:bg-color-gray-700 rounded-lg text-white min-w-24 cursor-pointer disabled:cursor-default"
              >
                인증하기
              </button>
            )}
            {isRequested && (
              <button
                type="button"
                onClick={phoneSubmit}
                disabled={!isPhone}
                className="bg-color-gray-900 disabled:bg-color-gray-700 rounded-lg text-white min-w-24 cursor-pointer disabled:cursor-default"
              >
                재전송하기
              </button>
            )}
          </div>
          <CSSTransition
            nodeRef={errorRefs.current.phone}
            timeout={300}
            in={showError.phone}
            classNames="fade"
          >
            <span
              ref={errorRefs.current.phone}
              className="text-xs sm:text-sm text-color-red-700 cursor-default"
            >
              {errors.phone?.message}
            </span>
          </CSSTransition>
        </div>
        <div className="flex flex-col gap-1.5">
          {isRequested && (
            <label htmlFor="code" className="font-semibold">
              <Timer key={timerKey} duration={180} onExpire={onExpire} />
            </label>
          )}
          <div className="flex gap-3">
            <input
              className="border-color-gray-300 hover:border-color-gray-700 focus:ring-1 focus:border-color-gray-900 border rounded-lg grow py-4 px-3 outline-hidden"
              type="text"
              id="code"
              placeholder="인증번호 6자리"
              maxLength={6}
              {...register('code')}
              onInput={e => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
              }}
            />
            <button
              type="submit"
              disabled={!isCode}
              className="border border-color-gray-900 p-3 bg-color-gray-900 text-white rounded-lg outline-hidden disabled:border-color-gray-700 disabled:bg-color-gray-700 cursor-pointer disabled:cursor-default min-w-24"
            >
              확인
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  )
}

export default FindAccountVerifyForm
