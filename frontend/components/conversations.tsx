'use client'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { getConversations } from '@/lib/fetch'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface ConversationsProps {
  className?: string
}

const Conversations = ({ className }: ConversationsProps) => {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { data: conversationsData } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => getConversations({ token: session?.accessToken }),
    enabled: !!session?.accessToken
  })

  return (
    <div className={cn('flex flex-col space-y-5 py-5 text-lg', className)}>
      <button
        className={'mx-2 mb-5 cursor-pointer truncate rounded-lg bg-blue-800 p-2 text-blue-50'}
        onClick={() => router.push(pathname)}
      >
        New Conversation
      </button>
      {conversationsData?.map((conversation) => (
        <Button
          variant={'outline'}
          className={
            'mx-2 cursor-pointer justify-start truncate rounded border border-blue-500 bg-blue-50 p-2 pl-5 text-blue-800'
          }
          key={conversation.id}
          onClick={() => router.push(`${pathname}?conversation_id=${conversation.id}`)}
        >
          {conversation.title}
        </Button>
      ))}
    </div>
  )
}

export default Conversations
