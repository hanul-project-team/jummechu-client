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
            viewBox="0 0 56 56"
            fill="none"
            className='size-14'
          >
            <path
              d="M21.1944 22.4908C21.1944 25.086 19.018 27.1899 16.3333 27.1899C13.6485 27.1899 11.4722 25.086 11.4722 22.4908C11.4722 19.8955 13.6485 17.7917 16.3333 17.7917C19.018 17.7917 21.1944 19.8955 21.1944 22.4908Z"
              fill="#61D8D7"
            ></path>
            <path
              d="M4.66675 40.3472C4.66675 34.1187 9.89009 29.0695 16.3334 29.0695C22.7767 29.0695 28.0001 34.1187 28.0001 40.3472V40.7562C28.0001 42.0875 26.8837 43.1666 25.5066 43.1666H7.16028C5.78313 43.1666 4.66675 42.0875 4.66675 40.7562V40.3472Z"
              fill="#61D8D7"
            ></path>
            <path
              d="M4.66675 40.3472C4.66675 34.1187 9.89009 29.0695 16.3334 29.0695C22.7767 29.0695 28.0001 34.1187 28.0001 40.3472V40.7562C28.0001 42.0875 26.8837 43.1666 25.5066 43.1666H7.16028C5.78313 43.1666 4.66675 42.0875 4.66675 40.7562V40.3472Z"
              fill="#61D8D7"
            ></path>
            <path
              d="M44.528 22.6528C44.528 25.3376 42.3515 27.5139 39.6668 27.5139C36.9821 27.5139 34.8057 25.3376 34.8057 22.6528C34.8057 19.9681 36.9821 17.7917 39.6668 17.7917C42.3515 17.7917 44.528 19.9681 44.528 22.6528Z"
              fill="#61D8D7"
            ></path>
            <path
              d="M28 40.3667C28 34.1811 33.2234 29.1667 39.6667 29.1667C46.1099 29.1667 51.3333 34.1811 51.3333 40.3667V40.7729C51.3333 42.095 50.217 43.1667 48.8398 43.1667H30.4935C29.1164 43.1667 28 42.095 28 40.7729V40.3667Z"
              fill="#61D8D7"
            ></path>
            <path
              d="M28 40.3667C28 34.1811 33.2234 29.1667 39.6667 29.1667C46.1099 29.1667 51.3333 34.1811 51.3333 40.3667V40.7729C51.3333 42.095 50.217 43.1667 48.8398 43.1667H30.4935C29.1164 43.1667 28 42.095 28 40.7729V40.3667Z"
              fill="#61D8D7"
            ></path>
            <path
              d="M33.9952 17.7161C33.9952 21.0571 31.3109 23.7655 27.9998 23.7655C24.6885 23.7655 22.0044 21.0571 22.0044 17.7161C22.0044 14.3751 24.6885 11.6667 27.9998 11.6667C31.3109 11.6667 33.9952 14.3751 33.9952 17.7161Z"
              fill="#39D2D7"
            ></path>
            <path
              d="M13.6111 40.7036C13.6111 32.6853 20.0533 26.1851 28 26.1851C35.9468 26.1851 42.3889 32.6853 42.3889 40.7036V41.2302C42.3889 42.9439 41.012 44.3333 39.3136 44.3333H16.6865C14.988 44.3333 13.6111 42.9439 13.6111 41.2302V40.7036Z"
              fill="#39D2D7"
            ></path>
            <path
              d="M13.6111 40.7036C13.6111 32.6853 20.0533 26.1851 28 26.1851C35.9468 26.1851 42.3889 32.6853 42.3889 40.7036V41.2302C42.3889 42.9439 41.012 44.3333 39.3136 44.3333H16.6865C14.988 44.3333 13.6111 42.9439 13.6111 41.2302V40.7036Z"
              fill="#39D2D7"
            ></path>
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
