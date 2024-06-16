'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const AuthButton = () => {
  return <Button onClick={() => signOut()}>Sign out</Button>
}

export default AuthButton
