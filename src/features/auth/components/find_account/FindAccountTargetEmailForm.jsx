import React from 'react'
import { useForm } from 'react-hook-form'
import style from './findAccountTargetEmailForm.module.css'

const FindAccountTargetEmailForm = () => {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })
  const onSubmit = (data) => {
    console.log(data)
  }
  const onIsValid = (errors) => {
    if(errors.email){
        setFocus('email')
    }
  }
  return (
    <form
      autoComplete="off"
      className={style.findAccountTargetEmailForm}
      onSubmit={handleSubmit(onSubmit, onIsValid)}
    >
      <fieldset className="flex flex-col gap-3">
        <legend className="hidden">이메일 설정 폼</legend>
        <div className={`${style.findAccountTargetEmailFormField} flex flex-col`}>
          <input type="text" placeholder="이메일" {...register('email')} />
          {errors.name && <span className={style.errorSpan}>{errors.name.message}</span>}
        </div>
        <button type="submit">비밀번호 찾기</button>
      </fieldset>
    </form>
  )
}

export default FindAccountTargetEmailForm
