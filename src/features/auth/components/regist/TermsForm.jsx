import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Field, Label } from '@headlessui/react'
import Markdown from 'react-markdown'
import CustomCheckBox from '../../../../shared/CustomCheckBox'
import serviceMd from '../../../../assets/terms/service.md?raw'
import privacyMd from '../../../../assets/terms/privacy.md?raw'
import businessMd from '../../../../assets/terms/business.md?raw'
import style from './termsForm.module.css'

const TermsForm = ({ nextStep }) => {
  const [checked, setChecked] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const { role } = JSON.parse(localStorage.getItem('role')) || {}
  const { handleSubmit, control, watch, setValue, reset } = useForm({
    defaultValues: {
      service: false,
      privacy: false,
      business: false,
    },
  })
  const [service, privacy, business] = watch(['service', 'privacy', 'business'])
  useEffect(() => {
    if (role === 'business') {
      if (service && privacy && business) {
        setChecked(true)
        setDisabled(false)
      } else {
        setChecked(false)
        setDisabled(true)
      }
    } else {
      if (service && privacy) {
        setChecked(true)
        setDisabled(false)
      } else {
        setChecked(false)
        setDisabled(true)
      }
    }
  }, [role, service, privacy, business])
  const handleAgreement = checked => {
    setChecked(checked)
    setValue('service', checked)
    setValue('privacy', checked)
    if (role === 'business') {
      setValue('business', checked)
    }
  }
  const onSubmit = data => {
    localStorage.setItem('termsAgreement', JSON.stringify(data))
    reset()
    nextStep()
  }
  return (
    <form className={style.termsForm} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="flex flex-col gap-3">
        <legend className="hidden">이용약관 동의 폼</legend>
        <Field className="flex items-center cursor-pointer select-none gap-1">
          <CustomCheckBox checked={checked} onChange={handleAgreement} className="w-6 h-6" />
          <Label>
            <span>전체 동의합니다</span>
          </Label>
        </Field>
        <div className="flex">
          <span className={`${style.horizontalBar} grow-1`}></span>
        </div>
        <Controller
          name="service"
          control={control}
          render={({ field }) => (
            <Field className="flex items-center cursor-pointer select-none gap-1">
              <CustomCheckBox checked={field.value} onChange={field.onChange} className="w-6 h-6" />
              <Label className="flex items-center gap-1">
                <span>&#91;필수&#93;</span>서비스 이용약관 예시
              </Label>
            </Field>
          )}
        />
        <div className={`${style.termBox}`}>
          <div className={`${style.termBoxInner} flex flex-col gap-3`}>
            <Markdown>{serviceMd}</Markdown>
          </div>
        </div>
        <Controller
          name="privacy"
          control={control}
          render={({ field }) => (
            <Field className="flex items-center cursor-pointer select-none gap-1">
              <CustomCheckBox checked={field.value} onChange={field.onChange} className="w-6 h-6" />
              <Label className="flex items-center gap-1">
                <span>&#91;필수&#93;</span>개인정보 수집 및 이용약관 예시
              </Label>
            </Field>
          )}
        />
        <div className={`${style.termBox}`}>
          <div className={`${style.termBoxInner} flex flex-col gap-3`}>
            <Markdown>{privacyMd}</Markdown>
          </div>
        </div>
        {role === 'business' && (
          <>
            <Controller
              name="business"
              control={control}
              render={({ field }) => (
                <Field className="flex items-center cursor-pointer select-none gap-1">
                  <CustomCheckBox
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-6 h-6"
                  />
                  <Label className="flex items-center gap-1">
                    <span>&#91;필수&#93;</span>입점 파트너 이용 약관 예시
                  </Label>
                </Field>
              )}
            />

            <div className={`${style.termBox}`}>
              <div className={`${style.termBoxInner} flex flex-col gap-3`}>
                <Markdown>{businessMd}</Markdown>
              </div>
            </div>
          </>
        )}
        <button type="submit" disabled={disabled}>
          다음
        </button>
      </fieldset>
    </form>
  )
}

export default TermsForm
