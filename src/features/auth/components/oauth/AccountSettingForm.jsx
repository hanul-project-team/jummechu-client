import React, { useState, useEffect, useRef, createRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { restoreLogin } from '../../slice/authSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { accountSettingSchema } from '../../schema/accountSettingSchema'
import { API } from '../../../../app/api'
import { toast } from 'react-toastify'
import { CSSTransition } from 'react-transition-group'
import { useMediaQuery } from 'react-responsive'
import TermsBox from '../regist/TermsBox'
import Timer from '../../../../shared/Timer'

const AccountSettingForm = ({ returnUrl, from }) => {
  const [isPhone, setIsPhone] = useState(false)
  const [isRequested, setIsRequested] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [isSMSAuthenticated, setIsSMSAuthenticated] = useState(false)
  const [isAgreement, setIsAgreement] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [showError, setShowError] = useState({
    name: false,
    phone: false,
  })
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
    resolver: zodResolver(accountSettingSchema),
    defaultValues: {
      service: false,
      privacy: false,
      business: false,
    },
  })
  const user = useSelector(state => state.auth.user)
  const isMobile = useMediaQuery({ maxWidth: '640px' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const phoneValue = watch('phone')
  const codeValue = watch('code')
  const errorRefs = useRef({
    name: createRef(null),
    phone: createRef(null),
  })
  useEffect(() => {
    if (!isMobile) setFocus('name')
  }, [isMobile, setFocus])
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
    const { code: _code, ...rest } = data
    const submitData = { ...rest }
    try {
      await API.put(`/auth/account_setting/${user.id}`, submitData)
      if (returnUrl) {
        navigate(`${returnUrl}`)
      } else {
        navigate('/')
      }
      reset()
      dispatch(restoreLogin())
    } catch {
      toast.error(
        <div className="Toastify__toast-body cursor-default">잠시 후 다시 시도해주세요</div>,
        {
          position: 'top-center',
        },
      )
    }
  }
  const onIsvalid = errors => {
    if (errors.name) {
      setFocus('name')
    } else if (errors.phone) {
      setFocus('phone')
    }
  }
  const onExpire = () => {
    setIsRequested(false)
  }
  return (
    <FormProvider control={control} setValue={setValue} watch={watch}>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onIsvalid)}>
        <fieldset className="flex flex-col gap-3">
          <legend className="hidden">계정설정 폼</legend>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold">이메일</label>
            <div className="flex justify-center items-center gap-2 border-color-gray-300 border bg-color-gray-50 rounded-lg grow py-4 px-3 outline-hidden font-semibold cursor-default">
              {from === 'google' && (
                <img
                  alt="구글로고"
                  src="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M17.75%2010.178C17.75%209.6512%2017.7064%209.12154%2017.6135%208.60326H10.1561V11.5876H14.4266C14.2494%2012.5501%2013.68%2013.4016%2012.8462%2013.9426V15.879H15.394C16.8901%2014.5292%2017.75%2012.5359%2017.75%2010.178Z'%20fill='%234285F4'/%3e%3cpath%20d='M10.1562%2017.75C12.2886%2017.75%2014.0868%2017.0637%2015.397%2015.8791L12.8492%2013.9427C12.1404%2014.4154%2011.2253%2014.6831%2010.1591%2014.6831C8.09651%2014.6831%206.34764%2013.319%205.72014%2011.4851H3.09103V13.4814C4.43318%2016.0984%207.16688%2017.75%2010.1562%2017.75Z'%20fill='%2334A853'/%3e%3cpath%20d='M5.71723%2011.4854C5.38605%2010.5229%205.38605%209.48067%205.71723%208.51816V6.52195H3.09102C1.96965%208.7118%201.96966%2011.2915%203.09103%2013.4814L5.71723%2011.4854Z'%20fill='%23FBBC05'/%3e%3cpath%20d='M10.1562%205.31745C11.2834%205.30037%2012.3728%205.71612%2013.1891%206.4793L15.4464%204.26667C14.0171%202.95105%2012.1201%202.22774%2010.1562%202.25052C7.16688%202.25052%204.43318%203.9021%203.09102%206.52195L5.71723%208.51816C6.34183%206.68142%208.09361%205.31745%2010.1562%205.31745Z'%20fill='%23EA4335'/%3e%3c/svg%3e"
                ></img>
              )}
              {from === 'kakao' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.00039 1.80005C4.52649 1.80005 0.900391 4.63473 0.900391 8.13165C0.900391 10.305 2.30259 12.2229 4.43919 13.3634L3.54009 16.6846C3.46089 16.979 3.79209 17.2128 4.04679 17.0425L7.98609 14.4116C8.31909 14.4442 8.65659 14.4623 9.00039 14.4623C13.4734 14.4623 17.1004 11.6277 17.1004 8.13165C17.1004 4.63473 13.4734 1.80005 9.00039 1.80005Z"
                    fill="black"
                  ></path>
                </svg>
              )}
              {user.email}
            </div>
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
                className="w-0 border-color-gray-300 hover:border-color-gray-700 focus:ring-1 focus:border-color-gray-900 border rounded-lg grow py-4 px-3 outline-hidden"
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
                  className="w-0 border-color-gray-300 hover:border-color-gray-700 focus:ring-1 focus:border-color-gray-900 border rounded-lg grow py-4 px-3 outline-hidden"
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

export default AccountSettingForm
