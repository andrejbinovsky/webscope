import Conversation from '@/components/conversation'
import Conversations from '@/components/conversations'
import { Suspense } from 'react'

export default async function Home() {
  return (
    <main className=''>
      <div className={'flex'}>
        <Conversations className={'w-1/4'} />
        <Suspense>
          <Conversation className={'mx-20 w-3/4'} />
        </Suspense>
      </div>
    </main>
  )
}
