import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { targetEmailSchema } from '../../schema/targetEmailSchema'
import { toast } from 'react-toastify'
import axios from 'axios'
import style from './findAccountTargetEmailForm.module.css'

const FindAccountTargetEmailForm = ({ nextStep }) => {
  const {
    register,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(targetEmailSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })
  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:3000/auth/target', data)
      nextStep()
    } catch (e) {
      if (e.response.status === 404) {
        setError('email', { message: e.response.data.message })
      } else {
        toast.error(
          <div>
            서버 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </div>,
          { autoClose: 3000 },
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
    <form
      autoComplete="off"
      className={style.findAccountTargetEmailForm}
      onSubmit={handleSubmit(onSubmit, onIsValid)}
    >
      <fieldset className="flex flex-col gap-3">
        <legend className="hidden">이메일 설정 폼</legend>
        <div className={`${style.findAccountTargetEmailFormField} flex flex-col`}>
          <input type="text" placeholder="이메일" {...register('email')} />
          {errors.email && <span className={style.errorSpan}>{errors.email.message}</span>}
        </div>
        <button type="submit">비밀번호 찾기</button>
      </fieldset>
    </form>
  )
}

export default FindAccountTargetEmailForm
