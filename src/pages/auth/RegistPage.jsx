import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RegistTypeForm from '../../features/auth/components/regist/RegistTypeForm'
import TermsForm from '../../features/auth/components/regist/TermsForm'
import RegistDetailsForm from '../../features/auth/components/regist/RegistDetailsForm'
import RegistAction from '../../features/auth/components/regist/RegistAction'

const RegistPage = () => {
  const navigate = useNavigate()
  const { step } = useParams()
  useEffect(() => {
    if (!step) {
      navigate('/regist/type')
    } else if (step === 'terms' && !localStorage.getItem('role')) {
      navigate('/regist/type')
    } else if (step === 'details' && !localStorage.getItem('termsAgreement')) {
      navigate('/regist/type')
    }
  }, [step, navigate])
  const nextStep = () => {
    if( step === 'type') navigate('/regist/terms')
    else if (step === 'terms') navigate('/regist/details')
  }

  return (
    <main className="container mx-auto max-w-5xl flex justify-center px-6 ">
      <section className={`${!(step === 'type') && 'max-w-sm'} w-full flex flex-col`}>
        {step === 'type' && (
          <div className="flex flex-col gap-10">
            <div className="flex flex-col items-center gap-2 cursor-default">
              <h2 className="font-semibold max-w-52 leading-tight sm:max-w-fit text-center text-2xl">
                맛집을 찾으시나요? 운영하시나요?
              </h2>
              <p className="text-sm text-color-gray-800">원하는 유형으로 지금 시작해보세요</p>
            </div>
            <RegistTypeForm nextStep={nextStep} />
            <RegistAction />
          </div>
        )}
        {step === 'terms' && (
          <div className="flex flex-col gap-10">
            <h2 className="text-center text-2xl font-semibold cursor-default">
              서비스 이용을 위해 <br /> 약관에 동의해주세요
            </h2>
            <TermsForm nextStep={nextStep} />
          </div>
        )}
        {step === 'details' && (
          <div className="flex flex-col gap-10">
            <h2 className="text-center text-2xl font-semibold cursor-default">회원 정보를 입력해주세요</h2>
            <RegistDetailsForm />
          </div>
        )}
      </section>
    </main>
  )
}

export default RegistPage
