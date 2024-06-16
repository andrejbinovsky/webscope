import { auth } from '@/lib/auth'

export default async function Home() {
  const session = await auth()
  return <main className=''>{session?.user.id}</main>
}
