import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import FindAccountVerifyForm from '../../features/auth/components/find_account/FindAccountVerifyForm'

const FindAccountPage = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get('type')
  useEffect(() => {
    if (type === 'id') {
      setTabIndex(0)
    } else if (type === 'password') {
      setTabIndex(1)
    } else {
      setSearchParams({ type: 'id' })
    }
  }, [type, setSearchParams])
  const tabChange = () => {
    if (type === 'id') {
      setSearchParams({ type: 'password' })
      setTabIndex(1)
    } else if (type === 'password') {
      setSearchParams({ type: 'id' })
      setTabIndex(0)
    }
  }
  return (
    <main className="container mx-auto flex justify-center ">
      <section className={`max-w-sm w-full flex flex-col gap-5`}>
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="url(#gradientStroke)"
            className="size-10"
          >
            <defs>
              <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#39D2D7" />
                <stop offset="50%" stopColor="#00C6FF" />
                <stop offset="100%" stopColor="#39D2D7" />
              </linearGradient>
            </defs>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>
        </div>
        <TabGroup className="flex flex-col gap-5" selectedIndex={tabIndex} onChange={tabChange}>
          <TabList className="flex">
            <Tab className="data-selected:border-b grow font-bold py-2 ">아이디 찾기</Tab>
            <Tab className="data-selected:border-b grow font-bold py-2">비밀번호 찾기</Tab>
          </TabList>
          <TabPanels>
            <TabPanel className="flex flex-col gap-3">
              <h2 className="text-center font-bold">
                아이디를 찾으시려면 <br />
                본인인증을 진행해 주세요
              </h2>
              <FindAccountVerifyForm type={type} />
            </TabPanel>
            <TabPanel>
              <h2 className="text-center font-bold">
                비밀번호를 찾고자하는
                <br />
                이메일을 입력해 주세요
              </h2>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </section>
    </main>
  )
}

export default FindAccountPage
