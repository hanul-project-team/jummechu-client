import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema } from '../../schema/resetPasswordSchema'
import VisibleBtn from '../../../../shared/VisibleBtn'
import style from './resetPasswordForm.module.css'

const ResetPasswordForm = () => {
  const [passwordState, setPasswordState] = useState({
    hasValue: false,
    visible: false,
  })
  const [passwordCheckState, setPasswordCheckState] = useState({
    hasValue: false,
    visible: false,
  })
  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(resetPasswordSchema),
  })
  const passwordValue = watch('password')
  const passwordCheckValue = watch('passwordCheck')
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
  const onSubmit = data => {
    console.log(data)
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
    <form className="w-full" onSubmit={handleSubmit(onSubmit, onIsvalid)}>
      <fieldset className="flex flex-col gap-3">
        <legend className="hidden">비밀번호 재설정 폼</legend>
        <div className={`${style.resetPasswordFormField} flex flex-col`}>
          <div className="flex justify-between items-center">
            <label htmlFor="password">새 비밀번호</label>
            <span className={style.hintSpan}>영문/숫자/특수문자(~!@#^*_=+-) 포함 8자 이상</span>
          </div>
          <input
            className="grow"
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
            className="absolute top-11 right-3 "
          />
          {errors.password && <span className={style.errorSpan}>{errors.password.message}</span>}
        </div>
        <div className={`${style.resetPasswordFormField} flex flex-col`}>
          <label htmlFor="passwordCheck">새 비밀번호 확인</label>
          <input
            className="grow"
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
            className="absolute top-5 right-3 "
          />
          {errors.passwordCheck && (
            <span className={style.errorSpan}>{errors.passwordCheck.message}</span>
          )}
        </div>
        <button type="submit" className={style.submitBtn}>
          비밀번호 변경
        </button>
      </fieldset>
    </form>
  )
}

export default ResetPasswordForm
