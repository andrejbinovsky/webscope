import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import LoginForm from '@/components/login/form'

const LoginPage = async () => {
  const session = await auth()
  if (session) {
    redirect('/')
  }
  return <LoginForm />
}

export default LoginPage
