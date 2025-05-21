import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import FindIdVerifyForm from '../../features/auth/components/help/FindIdVerifyForm'
import FindIdResult from '../../features/auth/components/help/FindIdResult'
import ResetPasswordTargetForm from '../../features/auth/components/help/ResetPasswordTargetForm'
import ResetPasswordForm from '../../features/auth/components/help/ResetPasswordForm'

const HelpPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get('type')
  const step = searchParams.get('step')
  useEffect(() => {
    if (type === 'id') {
      setSelectedIndex(0)
    } else {
      setSelectedIndex(1)
    }
  },[type])
  const tabChange = () => {
    if (type === 'id') {
      setSelectedIndex(1)
      setSearchParams({ type: 'password', step: 'target' })
    } else if (type === 'password') {
      setSelectedIndex(0)
      setSearchParams({ type: 'id', step: 'verify' })
    }
  }
  const nextStep = () => {
    if (type === 'id' && step === 'verify') {
      setSearchParams({ type: 'id', step: 'result' })
    } else if (type === 'password' && step === 'target') {
      setSearchParams({ type: 'password', step: 'result' })
    }
  }
  return (
    <main className="container mx-auto flex justify-center ">
      <section className={`max-w-sm w-full flex flex-col`}>
        <TabGroup
          className="flex flex-col gap-3"
          selectedIndex={selectedIndex}
          onChange={tabChange}
        >
          <TabList className="flex">
            <Tab className="data-selected:border-b grow">아이디 찾기</Tab>
            <Tab className="data-selected:border-b grow">비밀번호 찾기</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {step === 'verify' && <FindIdVerifyForm nextStep={nextStep} />}
              {step === 'result' && <FindIdResult />}
            </TabPanel>
            <TabPanel>
              {step === 'target' && <ResetPasswordTargetForm nextStep={nextStep} />}
              {step === 'reset' && <ResetPasswordForm />}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </section>
    </main>
  )
}

export default HelpPage
