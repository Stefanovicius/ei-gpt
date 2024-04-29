import OpenAI from 'openai'
import { colorize, delay, eiDir } from './utils'

export const latestConversationPath = eiDir('messages', 'latest')

export class GPT {
  private openai: OpenAI
  private systemMessage: OpenAI.ChatCompletionSystemMessageParam = {
    role: 'system',
    content: `You are a helpful assistant running in a shell terminal. The user is in \`${process.cwd()}\` directory, and uses a \`${process.platform}\` system, if you need more info, ask him.`,
  }

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
    })
  }

  async sendMessage(prompt: string) {
    const messages = await GPT.loadConversation()
    messages.push({ role: 'user', content: prompt })

    const completion = await this.openai.chat.completions.create({
      messages: [this.systemMessage, ...messages],
      model: 'gpt-4-turbo',
      stream: true,
    })

    const gptName = colorize('\nGPT: ', 63, 169, 59)
    process.stdout.write(gptName)

    let response = ''
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || ''
      process.stdout.write(content)
      response += content
      await delay(50)
    }
    console.log('\n')
    messages.push({ role: 'assistant', content: response })
    GPT.saveConversation(messages)
  }

  static async loadConversation() {
    try {
      const messages = await Bun.file(latestConversationPath).json()
      return messages
    } catch (err) {
      // @ts-ignore
      if (err.code !== 'ENOENT') console.error(err)
      return []
    }
  }
  
  static async saveConversation(messages: OpenAI.ChatCompletionMessageParam[]) {
    const messagesJSON = JSON.stringify(messages)
    await Bun.write(latestConversationPath, messagesJSON)
  }
}
