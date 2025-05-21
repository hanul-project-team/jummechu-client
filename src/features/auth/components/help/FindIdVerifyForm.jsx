import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Timer from '../../../../shared/Timer'
import style from './findIdVerifyForm.module.css'

const FindIdVerifyForm = ({ nextStep }) => {
  const [isPhone, setIsPhone] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [isRequested, setIsRequested] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getValues,
    resetField,
    formState: { errors },
  } = useForm()
  const phoneValue = watch('phone')
  const codeValue = watch('code')
  useEffect(() => {
    const isValid = /^01[016789][0-9]{8}$/.test(phoneValue)
    setIsPhone(!!isValid)
  }, [phoneValue])
  useEffect(() => {
    const isValid = /^\d{6}$/.test(codeValue)
    setIsCode(!!isValid)
  }, [codeValue])
  const phoneSubmit = async () => {
    const isValid = await trigger('phone')
    if (isValid) {
      const phone = getValues('phone')
      setIsRequested(true)
      toast.success(<div>인증번호 발송에 성공하였습니다.</div>, { autoClose: 4000 })
      setTimerKey(prev => prev + 1)
      console.log(phone)
    }
  }
  const onSubmit = data => {
    console.log(data)
    nextStep()
  }

  const onIsValid = errors => {
    console.log(errors)
  }
  const onExpire = () => {
    setIsRequested(false)
    resetField('code')
  }
  return (
    <form
      className={style.findIdVerifyForm}
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit, onIsValid)}
    >
      <fieldset className="flex flex-col gap-3">
        <legend className="hidden">아이디 찾기 sms 인증 폼</legend>
        <div className={`${style.findIdVerifyFormField} flex flex-col`}>
          <label htmlFor="name">이름</label>
          <input type="text" placeholder="이름" {...register('name')} />
          {errors.name && <span className={style.errorSpan}>{errors.name.message}</span>}
        </div>
        <div className={`${style.findIdVerifyFormField} flex flex-col`}>
          <label htmlFor="phone">전화번호</label>
          <div className="flex gap-3">
            <input
              className={`${style.noSpinner} grow`}
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
                className={style.getCodeBtn}
              >
                인증하기
              </button>
            )}
            {isRequested && (
              <button
                type="button"
                onClick={phoneSubmit}
                disabled={!isPhone}
                className={style.resendBtn}
              >
                재전송하기
              </button>
            )}
          </div>
          {errors.phone && <span className={style.errorSpan}>{errors.phone.message}</span>}
        </div>
        <div className={`${style.findIdVerifyFormField} flex flex-col`}>
          {isRequested && (
            <label htmlFor="phone">
              <Timer key={timerKey} duration={180} onExpire={onExpire} />
            </label>
          )}
          <div className="flex gap-3">
            <input
              className={`${style.noSpinner} grow`}
              type="text"
              id="code"
              placeholder="인증번호 6자리"
              maxLength={6}
              {...register('code')}
              onInput={e => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
              }}
            />
            <button type="submit" disabled={!isCode} className={style.submitBtn}>
              확인
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  )
}

export default FindIdVerifyForm
