import React from 'react'
import { useForm } from 'react-hook-form'

const RegistTypeForm = ({ nextStep }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
  } = useForm()
  const onSubmit = data => {
    localStorage.setItem('role', JSON.stringify(data))
    reset()
    nextStep()
  }
  const roleSubmit = selectedRole => {
    setValue('role', selectedRole)
    handleSubmit(onSubmit)()
  }
  return (
    <form autoComplete='off'>
      <fieldset>
        <legend className="hidden">회원 타입 선택 폼</legend>
        <input type="hidden" {...register('role', { required: true })} />
        <button type="button" className='outline-0' onClick={() => roleSubmit('member')}>
          일반 회원
        </button>
        <button type="button" className='outline-0' onClick={() => roleSubmit('business')}>
          사업자 회원
        </button>
      </fieldset>
    </form>
  )
}

export default RegistTypeForm
