import React, { useState, useEffect, useRef, createRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { registScheam } from '../../schema/registSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { API } from '../../../../app/api'
import { toast } from 'react-toastify'
import { CSSTransition } from 'react-transition-group'
import TermsBox from './TermsBox'
import VisibleBtn from '../../../../shared/VisibleBtn'
import Timer from '../../../../shared/Timer'

const RegistDetailsForm = () => {
  const [isPhone, setIsPhone] = useState(false)
  const [isRequested, setIsRequested] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [isSMSAuthenticated, setIsSMSAuthenticated] = useState(false)
  const [isAgreement, setIsAgreement] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [passwordState, setPasswordState] = useState({
    hasValue: false,
    visible: false,
  })
  const [passwordCheckState, setPasswordCheckState] = useState({
    hasValue: false,
    visible: false,
  })
  const [showError, setShowError] = useState({
    email: false,
    password: false,
    passwordCheck: false,
    name: false,
    phone: false,
  })
  const returnUrl = localStorage.getItem('returnUrl')
  const {
    register,
    handleSubmit,
    setFocus,
    watch,
    trigger,
    getValues,
    resetField,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registScheam),
    defaultValues: {
      service: false,
      privacy: false,
      business: false,
    },
  })
  const navigate = useNavigate()
  const phoneValue = watch('phone')
  const codeValue = watch('code')
  const passwordValue = watch('password')
  const passwordCheckValue = watch('passwordCheck')
  const errorRefs = useRef({
    email: createRef(null),
    password: createRef(null),
    passwordCheck: createRef(null),
    name: createRef(null),
    phone: createRef(null),
  })
  useEffect(() => {
    setFocus('email')
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
      email: !!errors.email,
      password: !!errors.password,
      passwordCheck: !!errors.passwordCheck,
      name: !!errors.name,
      phone: !!errors.phone,
    }))
  }, [errors.email, errors.password, errors.passwordCheck, errors.name, errors.phone])
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
  const codeSubmit = async () => {
    const isValid = await trigger('code')
    if (isValid) {
      const code = getValues('code')
      try {
        // await API.post('/auth/verify_code', { code })
        toast.success(
          <div className="Toastify__toast-body cursor-default">인증에 성공하였습니다</div>,
          {
            position: 'top-center',
          },
        )
        setIsSMSAuthenticated(true)
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
  }
  const onSubmit = async data => {
    const role = JSON.parse(localStorage.getItem('role'))
    const { passwordCheck: _passwordCheck, code: _code, ...rest } = data
    const submitData = { ...role, ...rest }
    try {
      await API.post('/auth/regist', submitData)
      toast.success(
        <div className="Toastify__toast-body cursor-default">회원가입에 성공하였습니다</div>,
        {
          position: 'top-center',
        },
      )
      reset()
      navigate('/login', returnUrl && { state: { returnUrl } })
    } catch (e) {
      if (e.response.status === 400) {
        toast.error(
          <div className="Toastify__toast-body cursor-default">사용 중인 이메일입니다</div>,
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
  const onIsvalid = errors => {
    if (errors.email) {
      setFocus('email')
    } else if (errors.password) {
      setFocus('password')
    } else if (errors.passwordCheck) {
      setFocus('passwordCheck')
    } else if (errors.name) {
      setFocus('name')
    } else if (errors.phone) {
      setFocus('phone')
    }
  }
  const changeVisible = setter => {
    setter(prev => ({
      ...prev,
      visible: !prev.visible,
    }))
  }
  const onExpire = () => {
    setIsRequested(false)
  }
  return (
    <FormProvider control={control} setValue={setValue} watch={watch}>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onIsvalid)}>
        <fieldset className="flex flex-col gap-3">
          <legend className="hidden">상세정보 입력 폼</legend>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-semibold">
              이메일<span className="ps-0.5 text-color-red-500">*</span>
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
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="font-semibold">
                비밀번호<span className="ps-0.5 text-color-red-500">*</span>
              </label>
              <span className="text-color-gray-700 text-xs cursor-default">
                영문/숫자/특수문자(~!@#^*_=+-) 포함 8자 이상
              </span>
            </div>
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
          <div className="relative flex flex-col gap-1.5">
            <input
              className="border-color-gray-300 hover:border-color-gray-700 focus:ring-1 focus:border-color-gray-900 border rounded-lg grow py-4 px-3 outline-hidden"
              type={passwordCheckState.visible ? 'text' : 'password'}
              id="passwordCheck"
              placeholder="비밀번호 확인"
              {...register('passwordCheck')}
            />
            <VisibleBtn
              changeVisible={changeVisible}
              setter={setPasswordCheckState}
              visible={passwordCheckState.visible}
              hasValue={passwordCheckState.hasValue}
              className="absolute top-[21px] right-3 "
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
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="font-semibold">
              이름<span className="ps-0.5 text-color-red-500">*</span>
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
              전화번호<span className="ps-0.5 text-color-red-500">*</span>
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
              {!isRequested && !isSMSAuthenticated && (
                <button
                  type="button"
                  onClick={phoneSubmit}
                  disabled={!isPhone}
                  className="font-semibold bg-color-gray-900 disabled:bg-color-gray-700 rounded-lg text-white min-w-24 cursor-pointer disabled:cursor-default"
                >
                  인증하기
                </button>
              )}
              {isRequested && !isSMSAuthenticated && (
                <button
                  type="button"
                  onClick={phoneSubmit}
                  disabled={!isPhone}
                  className="font-semibold bg-color-gray-900 disabled:bg-color-gray-700 rounded-lg text-white min-w-24 cursor-pointer disabled:cursor-default"
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
          {isRequested && !isSMSAuthenticated && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="font-semibold">
                <Timer key={timerKey} duration={180} onExpire={onExpire} />
              </label>
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
                  type="button"
                  onClick={codeSubmit}
                  disabled={!isCode}
                  className="font-semibold bg-color-gray-900 disabled:bg-color-gray-700 rounded-lg text-white min-w-24 cursor-pointer disabled:cursor-default"
                >
                  확인
                </button>
              </div>
            </div>
          )}
          <TermsBox setIsAgreement={setIsAgreement} />
          <button
            type="submit"
            disabled={!(isSMSAuthenticated && isAgreement)}
            className="font-semibold border border-color-gray-900 p-3 bg-color-gray-900 text-white rounded-lg outline-hidden disabled:border-color-gray-700 disabled:bg-color-gray-700 cursor-pointer disabled:cursor-default"
          >
            가입하기
          </button>
        </fieldset>
      </form>
    </FormProvider>
  )
}

export default RegistDetailsForm
