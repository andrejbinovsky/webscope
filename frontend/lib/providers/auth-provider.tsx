'use client'

import { SessionProvider } from 'next-auth/react'

type Props = {
  children: React.ReactNode
}

const AuthProvider = ({ children }: Props) => {
  return (
    <SessionProvider refetchInterval={10 * 60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  )
}

export default AuthProvider
