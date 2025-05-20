import React from 'react'
import { useForm } from 'react-hook-form'
import style from './registTypeForm.module.css'

const RegistTypeForm = ({ nextStep }) => {
  const { register, handleSubmit, setValue, reset } = useForm()
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
    <form autoComplete="off">
      <fieldset className="flex flex-col items-center justify-center">
        <legend className="hidden">회원 타입 선택 폼</legend>
        <div className="flex flex-wrap w-full justify-center gap-3">
          <input type="hidden" {...register('role', { required: true })} />
          <div className={`${style.typeCard} flex flex-col gap-5`}>
            <div className={`${style.typeCardTitle} flex flex-col gap-2`}>
              <strong>일반 회원</strong>
              <p className='text-sm'>맛집을 찾고, 리뷰를 남기고, 추천도 받아보세요</p>
            </div>
            <ul className="flex flex-col gap-2">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span>위치 기반 검색 및 음식점 정보 열람</span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span>음식점 찜, 공유, 최근 본 목록 기능</span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span>리뷰 작성 및 개인화 추천 제공</span>
              </li>
            </ul>
            <button
              type="button"
              className={`${style.typeBtn}`}
              onClick={() => roleSubmit('member')}
            >
              일반 회원으로 시작하기
            </button>
          </div>
          <div className={`${style.typeCard} flex flex-col gap-5`}>
            <div className={`${style.typeCardTitle} flex flex-col gap-2`}>
              <strong>사업자 회원</strong>
              <p className='text-sm'>내 가게를 등록하고 리뷰를 직접 관리해보세요</p>
            </div>
            <ul className="flex flex-col gap-2">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span>사업자 정보 등록 후 입점 요청 가능 </span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span>소개글 작성 및 리뷰·평점 관리</span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span>파트너 회원의 가게는 먼저 보여집니다</span>
              </li>
            </ul>
            <button
              type="button"
              className={`${style.typeBtn}`}
              onClick={() => roleSubmit('business')}
            >
              파트너 회원으로 시작하기
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  )
}

export default RegistTypeForm
