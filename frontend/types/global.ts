export enum ConversationMessageType {
  USER = 'USER',
  SYSTEM = 'SYSTEM'
}

export interface ConversationMessage {
  type: ConversationMessageType
  messages: string
}

export interface Conversation {
  title: string
  id: number
}
