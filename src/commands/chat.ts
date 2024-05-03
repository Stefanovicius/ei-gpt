import chalk from 'chalk'
import prompts from 'prompts'
import { getSetApiKey } from '../credentials'
import { save } from './save'
import { GPT } from '../gpt'

const converse = async (gpt: GPT) => {
  const { message } = await prompts({
    type: 'text',
    name: 'message',
    message: chalk.greenBright('You:'),
  })
  if (!message) return
  await gpt.answer(message)
  await converse(gpt)
}

export async function chat(prompt?: string) {
  const apiKey = await getSetApiKey()
  const gpt = new GPT(apiKey)
  if (prompt) await gpt.answer(prompt)
  await converse(gpt)
  if (gpt.conversation.length) {
    const { shouldSave } = await prompts({
      type: 'confirm',
      name: 'shouldSave',
      message: 'Would you like to save this conversation?',
      initial: true,
    })
    if (shouldSave) await save(gpt)
  }
}
