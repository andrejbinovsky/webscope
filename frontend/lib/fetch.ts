import axios from 'axios'
import { Conversation } from '@/types/global'

export const axiosApiInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true
})

export const getHeaderAuthorization = (token?: string) => {
  const config = {
    headers: {} as Record<string, string>
  }
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}

export const getConversations = ({ token }: { token?: string }): Promise<Conversation[]> =>
  axiosApiInstance.get(`/conversations/`, getHeaderAuthorization(token)).then((res) => res.data)

export const getConversationMessages = ({
  token,
  conversationId
}: {
  token?: string
  conversationId: string
}): Promise<
  {
    id: number
    type: 'user' | 'system'
    message: string
  }[]
> =>
  axiosApiInstance
    .get(`/conversations/${conversationId}/messages/`, getHeaderAuthorization(token))
    .then((res) => res.data)

export const askOpenAi = ({
  onDownloadProgress,
  token,
  url
}: {
  token: string
  url: string
  onDownloadProgress: ({ data, chunkCount }: { data: string; chunkCount: number }) => void
}) => {
  let chunkCount = 0
  axios({
    url: url,
    ...getHeaderAuthorization(token),
    responseType: 'stream',
    onDownloadProgress: (progressEvent) =>
      onDownloadProgress({
        data: progressEvent.event.currentTarget.response,
        chunkCount
      })
  })
}
