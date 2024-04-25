import OpenAI from 'openai'
import { colorize, delay, eiDir } from './utils'

const currentConversationPath = eiDir('messages', 'current')

export class GPT {
  private openai: OpenAI
  private systemMessage: OpenAI.ChatCompletionMessageParam = {
    role: 'system',
    content: `You are a helpful assistant running in a shell terminal. You know nothing about the user, except that he's in \`${process.cwd()}\` directory, and uses a \`${process.platform}\` system, if you need more information, ask him.`,
  }

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
    })
  }

  async sendMessage(prompt: string) {
    const messages = await GPT.getConversation()
    messages.push({ role: 'user', content: prompt })

    const completion = await this.openai.chat.completions.create({
      messages: [this.systemMessage, ...messages],
      model: 'gpt-3.5-turbo',
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

  static async getConversation() {
    try {
      const messages = await Bun.file(currentConversationPath).json()
      return messages
    } catch (err) {
      // @ts-ignore
      if (err.code !== 'ENOENT') console.error(err)
      return []
    }
  }
  
  static async saveConversation(messages: OpenAI.ChatCompletionMessageParam[]) {
    const messagesJSON = JSON.stringify(messages)
    await Bun.write(currentConversationPath, messagesJSON)
  }
}
