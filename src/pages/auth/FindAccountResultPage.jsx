import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { reset } from '../../features/auth/slice/findAccountSlice'
import { toast } from 'react-toastify'
import AccountFound from '../../features/auth/components/find_account/AccountFound'
import NoAccountFound from '../../features/auth/components/find_account/NoAccountFound'

const FindAccountResultPage = () => {
  const [searchParams, _setSearchParams] = useSearchParams()
  const type = searchParams.get('type')
  const userFound = useSelector(state => state.findAccount.userFound)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    if (userFound === undefined) {
      toast.error(<div className="Toastify__toast-body cursor-default">잘못된 접근입니다</div>, {
        position: 'top-center',
      })
      navigate('/find_account?type=id')
    }
  }, [userFound, navigate])
  useEffect(() => {
    return () => {
      dispatch(reset())
    }
  }, [dispatch])

  if (userFound === undefined) return <main className="min-h-[544px]"></main>
  return (
    <main className="container mx-auto max-w-5xl flex justify-center px-6 ">
      <section className="flex flex-col max-w-sm w-full">
        {userFound && (
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col items-center w-full gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
              >
                <path
                  d="M49 28C49 39.5979 39.5979 49 28 49C16.402 49 7 39.5979 7 28C7 16.402 16.402 7 28 7C39.5979 7 49 16.402 49 28Z"
                  fill="#00E600"
                  fillOpacity="0.15"
                ></path>
                <path
                  d="M49 28C49 39.5979 39.5979 49 28 49C16.402 49 7 39.5979 7 28C7 16.402 16.402 7 28 7C39.5979 7 49 16.402 49 28Z"
                  fill="#00E600"
                  fillOpacity="0.15"
                ></path>
                <path
                  d="M19.8335 27.825L25.4723 32.9L36.7502 22.75"
                  stroke="#00E600"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <div className="text-center cursor-default flex flex-col gap-2">
                {type === 'id' && (
                  <>
                    <h2 className="font-semibold text-xl">가입된 아이디를 찾았어요</h2>
                    <p className="text-sm text-color-gray-700">
                      가입된 정보가 맞다면 아래 계정으로 로그인하세요
                    </p>
                  </>
                )}
                {type === 'password' && (
                  <>
                    <h2 className="font-semibold text-xl">가입된 계정을 확인했어요</h2>
                    <p className="text-sm text-color-gray-700">
                      아래 이메일로 비밀번호를 재설정 할 수 있는 <br />
                      링크를 보내드릴게요
                    </p>
                  </>
                )}
              </div>
            </div>
            <AccountFound type={type} />
          </div>
        )}
        {!userFound && (
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col items-center w-full gap-4">
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M28 49C39.598 49 49 39.598 49 28C49 16.402 39.598 7 28 7C16.402 7 7 16.402 7 28C7 39.598 16.402 49 28 49Z"
                  fill="#FF4040"
                  fillOpacity="0.15"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M29.75 16.9167C29.75 15.9502 28.9665 15.1667 28 15.1667C27.0335 15.1667 26.25 15.9502 26.25 16.9167V31.2408C26.25 32.2073 27.0335 32.9908 28 32.9908C28.9665 32.9908 29.75 32.2073 29.75 31.2408V16.9167ZM30.3333 38.5C30.3333 37.2113 29.2887 36.1667 28 36.1667C26.7113 36.1667 25.6667 37.2113 25.6667 38.5C25.6667 39.7887 26.7113 40.8334 28 40.8334C29.2887 40.8334 30.3333 39.7887 30.3333 38.5Z"
                  fill="#FF4040"
                ></path>
              </svg>
              <div className="text-center cursor-default flex flex-col gap-2">
                <h2 className="font-semibold text-xl">가입된 정보가 없어요</h2>
                <p className="text-sm text-color-gray-700">
                  회원가입하고 새로운 맛집을 추천 받아 보세요
                </p>
              </div>
            </div>
            <NoAccountFound />
          </div>
        )}
      </section>
    </main>
  )
}

export default FindAccountResultPage
