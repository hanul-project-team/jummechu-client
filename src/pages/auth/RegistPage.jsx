import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RegistTypeForm from '../../features/auth/components/regist/RegistTypeForm'
import TermsForm from '../../features/auth/components/regist/TermsForm'
import RegistDetailsForm from '../../features/auth/components/regist/RegistDetailsForm'
import style from './registPage.module.css'

const RegistPage = () => {
  const navigate = useNavigate()
  const { step } = useParams()
  const nextStep = () => {
    if (step === 'type') navigate('/regist/terms')
    else if (step === 'terms') navigate('/regist/details')
  }

  return (
    <main className="container mx-auto flex justify-center ">
      <section className={`${style.contentWrapper} flex flex-col`}>
        <div className={`flex justify-center pb-3`}>회원가입</div>

        {step === 'type' && (
          <div className={`${style.contentBody} flex flex-col`}>
            <RegistTypeForm nextStep={nextStep} />
          </div>
        )}
        {step === 'terms' && (
          <div className={`${style.contentBody} flex flex-col`}>
            <TermsForm nextStep={nextStep} />
          </div>
        )}
        {step === 'details' && (
          <div className={`${style.contentBody} flex flex-col`}>
            <RegistDetailsForm />
          </div>
        )}
      </section>
    </main>
  )
}

export default RegistPage
