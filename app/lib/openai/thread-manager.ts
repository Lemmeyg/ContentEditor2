import { openai } from './config'
import { ThreadMessage } from '@/types'

export class ThreadManager {
  private threadId: string | null = null
  private runId: string | null = null

  async createThread(): Promise<string> {
    const thread = await openai.beta.threads.create()
    this.threadId = thread.id
    return thread.id
  }

  async addMessage(content: string): Promise<ThreadMessage> {
    if (!this.threadId) {
      throw new Error('Thread not initialized')
    }

    const message = await openai.beta.threads.messages.create(this.threadId, {
      role: 'user',
      content,
    })

    return {
      id: message.id,
      role: 'user',
      content: message.content[0].text.value,
      createdAt: new Date(message.created_at * 1000),
    }
  }

  async getAssistantResponse(): Promise<ThreadMessage> {
    if (!this.threadId) {
      throw new Error('Thread not initialized')
    }

    // Create a run
    const run = await openai.beta.threads.runs.create(this.threadId, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID!,
    })
    this.runId = run.id

    // Poll for completion
    let completedRun = await this.waitForRunCompletion()

    // Get the latest message
    const messages = await openai.beta.threads.messages.list(this.threadId)
    const latestMessage = messages.data[0]

    return {
      id: latestMessage.id,
      role: 'assistant',
      content: latestMessage.content[0].text.value,
      createdAt: new Date(latestMessage.created_at * 1000),
    }
  }

  private async waitForRunCompletion() {
    if (!this.threadId || !this.runId) {
      throw new Error('Thread or run not initialized')
    }

    let run = await openai.beta.threads.runs.retrieve(this.threadId, this.runId)

    while (run.status === 'in_progress' || run.status === 'queued') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      run = await openai.beta.threads.runs.retrieve(this.threadId, this.runId)
    }

    if (run.status === 'failed') {
      throw new Error('Assistant run failed')
    }

    return run
  }

  async getThreadHistory(): Promise<ThreadMessage[]> {
    if (!this.threadId) {
      throw new Error('Thread not initialized')
    }

    const messages = await openai.beta.threads.messages.list(this.threadId)

    return messages.data.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content[0].text.value,
      createdAt: new Date(message.created_at * 1000),
    }))
  }
} 