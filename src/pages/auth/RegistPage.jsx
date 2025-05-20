import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RegistTypeForm from '../../features/auth/components/regist/RegistTypeForm'
import TermsForm from '../../features/auth/components/regist/TermsForm'
import RegistDetailsForm from '../../features/auth/components/regist/RegistDetailsForm'
import RegistAction from '../../features/auth/components/regist/RegistAction'


const RegistPage = () => {
  const navigate = useNavigate()
  const { step } = useParams()
  const nextStep = () => {
    if (step === 'type') navigate('/regist/terms')
    else if (step === 'terms') navigate('/regist/details')
  }

  return (
    <main className="container mx-auto flex justify-center ">
      <section className={`${!(step === 'type') && 'max-w-96'} w-full flex flex-col`}>
        {step === 'type' && (
          <div className="flex flex-col gap-3">
            <h2 className='text-center text-2xl mb-10'>맛집을 찾으시나요, 운영하시나요? <br />지금 선택해보세요</h2>
            <RegistTypeForm nextStep={nextStep} />
            <RegistAction />
          </div>
        )}
        {step === 'terms' && (
          <div className="flex flex-col gap-10">
            <h2 className='text-center text-2xl'>서비스 이용을 위해 <br /> 약관에 동의해주세요</h2>
            <TermsForm nextStep={nextStep} />
          </div>
        )}
        {step === 'details' && (
          <div className="flex flex-col gap-10">
            <h2 className='text-center text-2xl'>회원 정보를 입력해주세요</h2>
            <RegistDetailsForm />
          </div>
        )}
      </section>
    </main>
  )
}

export default RegistPage
