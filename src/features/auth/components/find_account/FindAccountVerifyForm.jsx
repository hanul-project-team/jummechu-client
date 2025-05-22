import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { findId } from '../../slice/findAccountIdSlice'
import { findAccountVerifySchema } from '../../schema/findAccountVerifySchema'
import Timer from '../../../../shared/Timer'
import style from './findAccountVerifyForm.module.css'
import axios from 'axios'

const FindAccountVerifyForm = ({ type }) => {
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
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(findAccountVerifySchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
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
      setFocus('code')
      console.log(phone)
    }
  }
  const onSubmit = async data => {
    const actionMap = {
      id: findId,
    }
    try {
      const response = await axios.post(`http://localhost:3000/auth/find_${type}`, data)
      const action = actionMap[type]
      if (action) dispatch(action(response.data))
      navigate(`/find_account/result?type=${type}`)
    } catch (e) {
      console.log(e)
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
    <form
      className={style.findAccountVerifyForm}
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit, onIsValid)}
    >
      <fieldset className="flex flex-col gap-3">
        <legend className="hidden">sms 인증 폼</legend>
        <div className={`${style.findAccountVerifyFormField} flex flex-col`}>
          <label htmlFor="name">이름</label>
          <input type="text" placeholder="이름" {...register('name')} />
          {errors.name && <span className={style.errorSpan}>{errors.name.message}</span>}
        </div>
        <div className={`${style.findAccountVerifyFormField} flex flex-col`}>
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
        <div className={`${style.findAccountVerifyFormField} flex flex-col`}>
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

export default FindAccountVerifyForm
