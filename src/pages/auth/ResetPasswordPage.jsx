import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { API } from '../../app/api'
import { toast } from 'react-toastify'
import ResetPasswordForm from '../../features/auth/components/find_account/ResetPasswordForm'

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams, _setSearchParams] = useSearchParams()
  const resetToken = searchParams.get('token')
  useEffect(() => {
    if (resetToken) {
      const verifyResetToken = async () => {
        try {
          await API.post('/auth/verify_reset_token', {
            resetToken,
          })
        } catch (e) {
          if (e.response.status === 400 || e.response.status === 401) {
            toast.error(
              <div className="Toastify__toast-body cursor-default">
                유효하지 않거나 만료된 링크입니다
              </div>,
              {
                position: 'top-center',
              },
            )
            navigate('/find_account?type=password')
          } else {
            toast.error(
              <div className="Toastify__toast-body cursor-default">잠시 후 다시 시도해주세요</div>,
              {
                position: 'top-center',
              },
            )
          }
        }
      }
      verifyResetToken()
    } else {
      toast.error(<div className="Toastify__toast-body cursor-default">잘못된 접근입니다</div>, {
        position: 'top-center',
      })
      navigate('/find_account?type=password')
    }
  }, [resetToken, navigate])
  if (!resetToken) return <main className="min-h-[400px]"></main>
  return (
    <main className="container mx-auto max-w-5xl flex justify-center px-6">
      <section className="max-w-sm w-full flex flex-col gap-10">
        <div className="flex flex-col items-center w-full gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
          >
            <path
              d="M28.0003 4.66669C21.5032 4.66669 16.2363 9.93356 16.2363 16.4305V18.3021H20.5141V16.4305C20.5141 12.8868 23.7225 8.94447 28.0003 8.94447C32.278 8.94447 35.4863 12.8868 35.4863 16.4305V18.3021H39.7641V16.4305C39.7641 9.93356 34.4972 4.66669 28.0003 4.66669Z"
              fill="#75DBFF"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.75 17.5001C11.884 17.5001 8.75 20.6341 8.75 24.5001V43.6528C8.75 47.5188 11.884 50.6528 15.75 50.6528H40.25C44.116 50.6528 47.25 47.5188 47.25 43.6528V24.5001C47.25 20.6341 44.116 17.5001 40.25 17.5001H15.75ZM30.1393 37.3746C32.0278 36.5495 33.3476 34.6651 33.3476 32.4723C33.3476 29.5191 30.9535 27.1251 28.0003 27.1251C25.0472 27.1251 22.6532 29.5191 22.6532 32.4723C22.6532 34.6651 23.9729 36.5495 25.8615 37.3746V39.9583C25.8615 41.1396 26.8191 42.0972 28.0003 42.0972C29.1816 42.0972 30.1393 41.1396 30.1393 39.9583V37.3746Z"
              fill="#00B9FF"
            ></path>
          </svg>
          <h2 className="font-semibold text-xl cursor-default">비밀번호를 재설정해 주세요</h2>
        </div>
        <ResetPasswordForm resetToken={resetToken} />
      </section>
    </main>
  )
}

export default ResetPasswordPage
