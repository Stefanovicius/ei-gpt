import OpenAI from 'openai'
import { colorize, delay } from './utils'

export class GPT {
  private openai: OpenAI
  private messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are a helpful assistant running in a shell terminal. You know nothing about the user, except that he's in \`${process.cwd()}\` directory, and uses a \`${process.platform}\` system, if you need more information, ask him.`,
    },
  ]
  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
    })
  }
  async sendMessage(prompt: string) {
    this.messages.push({ role: 'user', content: prompt })

    const completion = await this.openai.chat.completions.create({
      messages: this.messages,
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
    this.messages.push({ role: 'assistant', content: response })
    console.log('\n')
  }
}
