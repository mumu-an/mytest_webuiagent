import {ref} from 'vue'
import type {ChatMessage} from '../types/chat'

const sending = ref(false)
const controller = ref<AbortController | null>(null)



const stop = () => {
    controller.value?.abort()
}

export function useChat(scrollFn?: () => void, isNearBottom?: () => void) {
    const messages = ref<ChatMessage[]>([])
    const isStreaming = ref(false)


    const createAIMessage = (type: ChatMessage['type'] = 'text', extra: Partial<ChatMessage> = {}) => {
        const msg: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'ai',
            type,
            text: '',
            ...extra
        }

        messages.value.push(msg)
    }

    const streamText = async (text: string, onChunk: (chunk: string, signal?: AbortSignal) => void, signal?: AbortSignal) => {
        const chunkSize = 5

        for (let i = 0; i < text.length; i += chunkSize) {

            if (signal?.aborted) break

            onChunk(text.slice(i, i + chunkSize))
            await new Promise(r => requestAnimationFrame(r))
        }
    }


    const addMessage = (msg: ChatMessage) => {
        messages.value.push(msg)
    }

    // const sleepFrame = () =>
    //   new Promise(r => requestAnimationFrame(() => r(null)))


    const send = async (text: string) => {
        if (sending.value) {
            controller.value?.abort()
        }
        isStreaming.value = true


        controller.value = new AbortController()


        messages.value.push({
            id: crypto.randomUUID(),
            role: 'user',
            type: 'text',
            text
        })


        try {
            const res = await fetch('http://localhost:29506/agent/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({input: text}),
                signal: controller.value.signal   // ⭐关键
            })

            const result = await res.json()
            const data = result.data

            // console.log("AI输出json:", result)
            // console.log("AI输出:", data)
            // ======================
            // 🟢 TEXT（流式输出）
            // ======================

            if (data.type === 'text') {
                createAIMessage('text')
                await streamText(data.content.data, (chunk) => {
                        messages.value[messages.value.length - 1].text += chunk
                        if (isNearBottom?.()) {
                            scrollFn?.()
                        }
                    },
                    controller.value.signal)
            } else if (data.type === 'image') {
                createAIMessage('image', {
                    url: data.url
                })
            } else if (result.status === 'error') {
                createAIMessage('text')
                await streamText(result.msg || 'error', (chunk) => {
                        messages.value[messages.value.length - 1].text += chunk
                        if (isNearBottom?.()) {
                            scrollFn?.()
                        }
                    },
                    controller.value.signal)
            }

        } catch (err: any) {
            if (err.name === 'AbortError') {
                return   // ⭐关键：静默中断
            }

            createAIMessage('text')
            await streamText(`已收到: ${text}，系统异常，请稍后重试`, (chunk) => {
                    messages.value[messages.value.length - 1].text += chunk
                    if (isNearBottom?.()) {
                        scrollFn?.()
                    }
                },
                controller.value.signal)
        } finally {
            isStreaming.value = false
        }
    }

    const pushAI = (text: string) => {
        addMessage({
            id: crypto.randomUUID(),
            role: 'ai',
            type: 'text',
            text
        })
    }

    return {
        messages,
        isStreaming,
        send,
        pushAI,
        stop
    }
}