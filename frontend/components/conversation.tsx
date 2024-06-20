'use client'
import { ConversationMessage, ConversationMessageType, Conversation as ConversationType } from '@/types/global'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from '@/components/ui/use-toast'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getConversationMessages, askOpenAi } from '@/lib/fetch'

interface ConversationProps {
  className?: string
}

const Conversation = ({ className }: ConversationProps) => {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()
  const inputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()

  const { mutate: getConservationMessagesMutate } = useMutation({
    mutationFn: ({ _conversationId, token }: { _conversationId: string; token: string }) =>
      getConversationMessages({
        token,
        conversationId: _conversationId
      }),
    onSuccess: (data) => {
      setMessages(
        data.map((message) => ({
          id: message.id,
          type: message.type === 'user' ? ConversationMessageType.USER : ConversationMessageType.SYSTEM,
          messages: message.message
        }))
      )
    },
    onError: (error) => {
      console.error(error.message)
      toast({
        title: 'Error',
        description: 'Failed to fetch conversation messages.',
        variant: 'destructive'
      })
      router.push(pathname)
    }
  })

  const conversationId = searchParams.get('conversation_id')
  useEffect(() => {
    if (conversationId && session?.accessToken) {
      getConservationMessagesMutate({ _conversationId: conversationId, token: session.accessToken })
    } else {
      setMessages([])
    }
  }, [conversationId, session?.accessToken])

  const onDownloadProgress = async ({ data, chunkCount }: { data: string; chunkCount: number }) => {
    if (chunkCount === 0 && messages.length === 0) {
      await queryClient.invalidateQueries({ queryKey: ['conversations'] })
      const conversationData: ConversationType[] | undefined = await queryClient.getQueryData(['conversations'])
      router.push(`${pathname}?conversation_id=${conversationData ? conversationData[0].id : ''}`)
    }
    chunkCount++
    setMessages((prev) => {
      const newMessage = {
        type: ConversationMessageType.SYSTEM,
        messages: data
      }
      return prev[prev.length - 1].type === ConversationMessageType.USER
        ? [...prev, newMessage]
        : [...prev.slice(0, prev.length - 1), newMessage]
    })
  }

  const handleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const message = e.currentTarget.value
    if (e.key === 'Enter') {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      setMessages((prev) => [
        ...prev,
        {
          type: ConversationMessageType.USER,
          messages: message
        }
      ])
      if (!session?.accessToken) {
        toast({
          title: 'Please login to ask questions',
          variant: 'destructive'
        })
        return console.error('No access token')
      }

      askOpenAi({
        onDownloadProgress,
        url: `${process.env.NEXT_PUBLIC_API_URL}/openai/ask?message=${message}&conversation_id=${conversationId ?? ''}`,
        token: session?.accessToken
      })
    }
  }
  return (
    <Card className={cn('mt-10 flex h-[calc(100vh-120px)] flex-col justify-between space-y-4 p-4', className)}>
      <div className='space-y-4 overflow-y-auto pr-4'>
        {messages.map((conversationMessage, index) => (
          <div
            key={index}
            className={cn(
              'flex',
              conversationMessage.type === ConversationMessageType.USER ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-xs rounded-lg p-2',
                conversationMessage.type === ConversationMessageType.USER
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-black'
              )}
            >
              <p>{conversationMessage.messages}</p>
            </div>
          </div>
        ))}
      </div>
      <Input
        ref={inputRef}
        onKeyUp={handleInputEnter}
        className='mt-4 w-full border-blue-900'
        placeholder={'Ask something interesting..'}
      />
    </Card>
  )
}

export default Conversation
