import React from 'react'
import { useForm } from 'react-hook-form'
import style from './registDetailsForm.module.css'

const RegistDetailsForm = () => {
    const { register, handleSubmit, formState: {errors}} = useForm()
  return (
    <form className={style.loginForm} autoComplete='off'>
        <fieldset className="flex flex-col gap-3">
            <legend className='hidden'>상세정보 입력 폼</legend>
            <div className={`${style.loginFormField} flex flex-col`}>
                <label htmlFor="email">이메일<span className={style.requiredSpan}>*</span></label>
                <input className="grow" type="text" id='email' placeholder='이메일' {...register('email')} />
            </div>
            <div className={`${style.loginFormField} flex flex-col`}>
                <label htmlFor="password">비밀번호<span className={style.requiredSpan}>*</span></label>
                <input className="grow" type="password" id='password' placeholder='비밀번호' {...register('password')} />
            </div>
            <div className={`${style.loginFormField} flex flex-col`}>
                <input className="grow" type="password" id='passwordCheck' placeholder='비밀번호 확인' {...register('passwordCheck')} />
            </div>
            <div className={`${style.loginFormField} flex flex-col`}>
                <label htmlFor="name">이름<span className={style.requiredSpan}>*</span></label>
                <input className="grow" type="text" id='name' placeholder='이름' {...register('name')} />
            </div>
            <div className={`${style.loginFormField} flex flex-col`}>
                <label htmlFor="phone">전화번호<span className={style.requiredSpan}>*</span></label>
                <input className={`${style.noSpinner} grow`} type="number" id='phone' placeholder='전화번호' {...register('phone')} />
            </div>
            <div className={`${style.loginFormField} flex flex-col`}>
                <label htmlFor="phone">남은시간 알려주기</label>
                <input className={`${style.noSpinner} grow`} type="number" id='phone' placeholder='인증번호 6자리' {...register('phone')} />
            </div>
        </fieldset>
    </form>
  )
}

export default RegistDetailsForm