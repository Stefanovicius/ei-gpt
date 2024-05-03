import prompts from 'prompts'
import { getSetApiKey } from '../credentials'
import { save } from './save'
import { GPT } from '../gpt'

export async function generateImage(prompt: string) {
  const apiKey = await getSetApiKey()
  const gpt = new GPT(apiKey)
  await gpt.generateImage(prompt);
}
