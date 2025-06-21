import React, { useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import SelectMethod from '../../features/auth/components/regist/SelectMethod'
import RegistTypeForm from '../../features/auth/components/regist/RegistTypeForm'
import RegistDetailsForm from '../../features/auth/components/regist/RegistDetailsForm'
import RegistAction from '../../features/auth/components/regist/RegistAction'

const RegistPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const returnUrl = location.state?.returnUrl
  const { step } = useParams()
  useEffect(() => {
    if (!step) {
      navigate('/regist/method')
    } else if (step === 'details' && !localStorage.getItem('role')) {
      toast.error(<div className="Toastify__toast-body cursor-default">잘못된 접근입니다</div>, {
        position: 'top-center',
      })
      navigate('/regist/method')
    }
  }, [step, navigate])
  useEffect(() => {
    return () => {
      localStorage.removeItem('role')
    }
  }, [])
  const nextStep = () => {
    if (step === 'type') navigate('/regist/details')
  }
  if (step === 'details' && !localStorage.getItem('role'))
    return <main className="min-h-[340px]"></main>
  return (
    <main className="container mx-auto max-w-5xl flex justify-center px-6">
      <section className={`${!(step === 'type') && 'max-w-sm'} w-full flex flex-col`}>
        {step === 'method' && (
          <div className="flex flex-col gap-10">
            <h2 className="text-center text-2xl font-semibold cursor-default">회원가입</h2>
            <SelectMethod />
            <RegistAction returnUrl={returnUrl} />
          </div>
        )}
        {step === 'type' && (
          <div className="flex flex-col gap-10">
            <div className="flex flex-col items-center gap-2 cursor-default">
              <h2 className="font-semibold max-w-52 leading-tight sm:max-w-fit text-center text-2xl">
                맛집을 찾으시나요? 운영하시나요?
              </h2>
              <p className="text-sm text-color-gray-800">원하는 유형을 선택해주세요</p>
            </div>
            <RegistTypeForm nextStep={nextStep} />
          </div>
        )}
        {step === 'details' && (
          <div className="flex flex-col gap-10">
            <h2 className="text-center text-2xl font-semibold cursor-default">
              회원 정보를 입력해주세요
            </h2>
            <RegistDetailsForm />
          </div>
        )}
      </section>
    </main>
  )
}

export default RegistPage
