import OpenAI from 'openai'
import { fromRootDir } from './storage'
import chalk from 'chalk'

export const latestConversationPath = fromRootDir('messages', 'latest')

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type Size = '1024x1024' | '256x256' | '512x512' | '1792x1024' | '1024x1792'
type DallE = 'dall-e-2' | 'dall-e-3'

export class GPT {
  #openai: OpenAI
  #model: string
  #systemMessage: Message = {
    role: 'system',
    content: `You are a helpful assistant running in a shell terminal, the user is in \`${process.cwd()}\` directory, and uses a \`${process.platform}\` system, this conversation does not necessarily revolve around this.`,
  }
  #conversation: Message[]

  constructor(
    apiKey: string,
    conversation: Message[] = [],
    model: string = 'gpt-4-turbo',
  ) {
    this.#openai = new OpenAI({
      apiKey,
    })
    this.#conversation = [this.#systemMessage, ...conversation]
    this.#model = model
  }

  get conversation() {
    return this.#conversation.filter(({ role }) => role !== 'system')
  }

  async answer(prompt: string, model: string = this.#model) {
    this.#conversation.push({ role: 'user', content: prompt })

    const completion = await this.#openai.chat.completions.create({
      messages: this.#conversation,
      stream: true,
      model,
    })

    const gptName = chalk.green(`\nGPT (${model}): `)
    process.stdout.write(gptName)

    let content = ''
    for await (const chunk of completion) {
      const chunkContent = chunk.choices[0]?.delta?.content || ''
      process.stdout.write(chunkContent)
      content += chunkContent
      await delay(50)
    }
    console.log('\n')

    const message: Message = { role: 'assistant', content }

    this.#conversation.push(message)
    return message
  }

  async answerSystem(prompt: string, model: string = this.#model) {
    const message: Message = { role: 'system', content: prompt }
    const messages = [message, ...this.conversation]
    const { choices } = await this.#openai.chat.completions.create({
      messages,
      model,
    })
    const [response] = choices
    return response
  }

  async generateImage(
    prompt: string,
    size: Size = '1024x1024',
    model: DallE = 'dall-e-3',
  ) {
    const response = await this.#openai.images.generate({
      model,
      prompt,
      n: 1,
      size,
    })
    const imageURL = response.data[0].url
    console.log(`\n${imageURL}\n`)
  }
}
