import React, { useState, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Field, Label } from '@headlessui/react'
import CustomCheckBox from '../../../../shared/CustomCheckBox'
import TermsModal from '../../../../shared/TermsModal'
import serviceMd from '../../../../assets/terms/service.md?raw'
import privacyMd from '../../../../assets/terms/privacy.md?raw'
import businessMd from '../../../../assets/terms/business.md?raw'

const TermsBox = ({ setIsAgreement }) => {
  const [checked, setChecked] = useState(false)
  const [isOpen, setIsOpen] = useState({
    service: false,
    privacy: false,
    business: false,
  })
  const { role } = JSON.parse(localStorage.getItem('role')) || {}
  const { control, setValue, watch } = useFormContext()
  const [service, privacy, business] = watch(['service', 'privacy', 'business'])
  useEffect(() => {
    if (role === 'business') {
      if (service && privacy && business) {
        setChecked(true)
        setIsAgreement(true)
      } else {
        setChecked(false)
        setIsAgreement(false)
      }
    } else {
      if (service && privacy) {
        setChecked(true)
        setIsAgreement(true)
      } else {
        setChecked(false)
        setIsAgreement(false)
      }
    }
  }, [role, service, privacy, business, setIsAgreement])
  const handleAgreement = checked => {
    setChecked(checked)
    setValue('service', checked)
    setValue('privacy', checked)
    if (role === 'business') {
      setValue('business', checked)
    }
  }
  return (
    <>
      <Field className="relative flex items-center select-none">
        <Label className="absolute text-sm peer left-6 ps-2 cursor-pointer">
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
      <div className="flex justify-between">
        <Controller
          name="service"
          control={control}
          render={({ field }) => (
            <Field className="relative flex items-center select-none gap-2">
              <Label className="peer text-sm flex items-center gap-1 absolute left-6 ps-2 cursor-pointer w-[162px]">
                <span>&#91;필수&#93;</span>서비스 이용약관
              </Label>
              <CustomCheckBox
                checked={field.value}
                onChange={field.onChange}
                className="w-6 h-6 peer-hover:border-color-gray-700"
              />
            </Field>
          )}
        />
        <button
          type="button"
          onClick={() => setIsOpen(prev => ({ ...prev, service: true }))}
          className="hover:underline cursor-pointer text-sm text-color-gray-700"
        >
          약관보기
        </button>
      </div>
      <TermsModal
        isOpen={isOpen.service}
        setIsOpen={setIsOpen}
        termsMd={serviceMd}
        termsTitle="서비스 이용약관"
        name="service"
      />
      <div className="flex justify-between">
        <Controller
          name="privacy"
          control={control}
          render={({ field }) => (
            <Field className="relative flex items-center select-none gap-2">
              <Label className="peer text-sm flex items-center gap-1 absolute left-6 ps-2 cursor-pointer w-[218px]">
                <span>&#91;필수&#93;</span>개인정보 수집 및 이용약관
              </Label>
              <CustomCheckBox
                checked={field.value}
                onChange={field.onChange}
                className="w-6 h-6 peer-hover:border-color-gray-700"
              />
            </Field>
          )}
        />
        <button
          type="button"
          onClick={() => setIsOpen(prev => ({ ...prev, privacy: true }))}
          className="hover:underline cursor-pointer text-sm text-color-gray-700"
        >
          약관보기
        </button>
      </div>
      <TermsModal
        isOpen={isOpen.privacy}
        setIsOpen={setIsOpen}
        termsMd={privacyMd}
        termsTitle="개인정보 수집 및 이용약관"
        name="privacy"
      />
      {role === 'business' && (
        <>
          <div className="flex justify-between">
            <Controller
              name="business"
              control={control}
              render={({ field }) => (
                <Field className="relative flex items-center select-none gap-2">
                  <Label className="peer text-sm flex items-center gap-1 absolute left-6 ps-2 cursor-pointer w-[193px]">
                    <span>&#91;필수&#93;</span>입점 파트너 이용약관
                  </Label>
                  <CustomCheckBox
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-6 h-6 peer-hover:border-color-gray-700"
                  />
                </Field>
              )}
            />
            <button
              type="button"
              onClick={() => setIsOpen(prev => ({ ...prev, business: true }))}
              className="hover:underline cursor-pointer text-sm text-color-gray-700"
            >
              약관보기
            </button>
          </div>
          <TermsModal
            isOpen={isOpen.business}
            setIsOpen={setIsOpen}
            termsMd={businessMd}
            termsTitle="입점 파트너 이용약관"
            name="business"
          />
        </>
      )}
    </>
  )
}

export default TermsBox
