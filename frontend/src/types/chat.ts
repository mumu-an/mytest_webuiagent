export type ChatRole = 'user' | 'ai'

export type ChatMessageType =
    | 'text'
    | 'thinking'
    | 'tool'
    | 'image'

export interface ChatMessage {
    id: string
    role: ChatRole
    type: ChatMessageType
    text: string
    createdAt?: number
    url?: string
}