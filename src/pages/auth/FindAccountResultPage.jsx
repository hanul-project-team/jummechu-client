import React from 'react'
import { useSelector } from 'react-redux'
import AccountFound from '../../features/auth/components/find_account/AccountFound'
import NoAccountFound from '../../features/auth/components/find_account/NoAccountFound'

const FindAccountResultPage = () => {
  const user = useSelector(state => state.findAccountId.user)
  return (
    <main className="container mx-auto flex justify-center ">
      <section className="flex flex-col max-w-sm w-full">
        <div className="flex flex-col gap-6">{user && <AccountFound />}</div>
        <div className="flex flex-col gap-6">{!user && <NoAccountFound />}</div>
      </section>
    </main>
  )
}

export default FindAccountResultPage
