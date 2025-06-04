import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Field, Label } from '@headlessui/react'
import Markdown from 'react-markdown'
import CustomCheckBox from '../../../../shared/CustomCheckBox'
import serviceMd from '../../../../assets/terms/service.md?raw'
import privacyMd from '../../../../assets/terms/privacy.md?raw'
import businessMd from '../../../../assets/terms/business.md?raw'

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
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="flex flex-col gap-3">
        <legend className="hidden">이용약관 동의 폼</legend>
        <Field className="relative flex items-center select-none">
          <Label className="absolute peer left-6 ps-2 cursor-pointer">
            <span>전체 동의합니다</span>
          </Label>
          <CustomCheckBox
            checked={checked}
            onChange={handleAgreement}
            className="w-6 h-6 peer-hover:border-color-gray-700"
          />
        </Field>
        <div className="flex">
          <span className="grow-1 h-0.25 bg-color-gray-300"></span>
        </div>
        <Controller
          name="service"
          control={control}
          render={({ field }) => (
            <Field className="relative flex items-center select-none gap-2">
              <Label className="peer flex items-center gap-1 absolute left-6 ps-2 cursor-pointer">
                <span>&#91;필수&#93;</span>서비스 이용약관 예시
              </Label>
              <CustomCheckBox
                checked={field.value}
                onChange={field.onChange}
                className="w-6 h-6 peer-hover:border-color-gray-700"
              />
            </Field>
          )}
        />
        <div className="border border-color-gray-300 rounded-lg p-2">
          <div className="h-40 overflow-y-scroll custom-scrollbar outline-hidden pt-2 ps-4 cursor-default">
            <div className="flex flex-col gap-3 text-sm text-color-gray-700 outline-hidden pe-2 ">
              <Markdown>{serviceMd}</Markdown>
            </div>
          </div>
        </div>
        <Controller
          name="privacy"
          control={control}
          render={({ field }) => (
            <Field className="relative flex items-center select-none gap-2">
              <Label className="peer flex items-center gap-1 absolute left-6 ps-2 cursor-pointer">
                <span>&#91;필수&#93;</span>개인정보 수집 및 이용약관 예시
              </Label>
              <CustomCheckBox
                checked={field.value}
                onChange={field.onChange}
                className="w-6 h-6 peer-hover:border-color-gray-700"
              />
            </Field>
          )}
        />
        <div className="border border-color-gray-300 rounded-lg p-2">
          <div className="h-40 overflow-y-scroll custom-scrollbar outline-hidden pt-2 ps-4 cursor-default">
            <div className="flex flex-col gap-3 text-sm text-color-gray-700 outline-hidden pe-2 ">
              <Markdown>{privacyMd}</Markdown>
            </div>
          </div>
        </div>
        {role === 'business' && (
          <>
            <Controller
              name="business"
              control={control}
              render={({ field }) => (
                <Field className="relative flex items-center select-none gap-1">
                  <Label className="peer flex items-center gap-1 absolute left-6 ps-2 cursor-pointer">
                    <span>&#91;필수&#93;</span>입점 파트너 이용 약관 예시
                  </Label>
                  <CustomCheckBox
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-6 h-6 peer-hover:border-color-gray-700"
                  />
                </Field>
              )}
            />
            <div className="border border-color-gray-300 rounded-lg p-2">
              <div className="h-40 overflow-y-scroll custom-scrollbar outline-hidden pt-2 ps-4 cursor-default">
                <div className="flex flex-col gap-3 text-sm text-color-gray-700 outline-hidden pe-2 ">
                  <Markdown>{businessMd}</Markdown>
                </div>
              </div>
            </div>
          </>
        )}
        <button
          type="submit"
          className="border border-color-gray-900 p-3 bg-color-gray-900 text-white rounded-lg outline-hidden disabled:border-color-gray-700 disabled:bg-color-gray-700 cursor-pointer disabled:cursor-default"
          disabled={disabled}
        >
          다음
        </button>
      </fieldset>
    </form>
  )
}

export default TermsForm
