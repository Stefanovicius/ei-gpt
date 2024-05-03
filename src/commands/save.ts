import chalk from 'chalk'
import prompts from 'prompts'
import { writeConversation } from '../storage'
import { GPT } from '../gpt'

const { log, error } = console

const generateMetadata = async (gpt: GPT) => {
  const instructions =
    'Generate a topic and the most appropriate keywords, STRICTLY follow and ALWAYS answer in THIS FORMAT: `<topic>|<keyword1>, <keyword2>, <keyword3>, ...`. Example: `How to bake a cake|flour, sugar, eggs, butter, milk`. NEVER include a pipe character in neither the topic nor the keywords.'

  const { message } = await gpt.answerSystem(instructions)
  const { content } = message

  if (!content) return error(chalk.red('Please try again.'))

  const format = /^[^\|]+?\|[^\|,]+(?:,\s*[^\|,]+)*$/

  if (!format.test(content))
    return error(chalk.red(`Incorrect format: ${content}`))

  const [topic, keywordsString] = content.split('|')

  const { metadataOk } = await prompts({
    type: 'confirm',
    name: 'metadataOk',
    message: `Is this metadata correct?\nTopic: ${topic}.\nKeywords: ${keywordsString}.`,
    initial: true,
  })

  if (!metadataOk) return error(chalk.red('Incorrect metadata.'))

  const keywords = keywordsString
    .split(',')
    .map((keyword: string) => keyword.trim())

  return { topic, keywords }
}

const writeMetadata = async () => {
  const { topic, keywords }: { topic: string; keywords: string[] } =
    await prompts([
      {
        type: 'text',
        name: 'topic',
        message: 'Topic',
      },
      {
        type: 'list',
        name: 'keywords',
        message: 'Keywords (comma-separated)',
      },
    ])
  return { topic, keywords }
}

export async function save(gpt: GPT) {
  const { shouldGenerateMetadata } = await prompts({
    type: 'confirm',
    name: 'shouldGenerateMetadata',
    message: 'Would you like to generate metadata for this conversation?',
    initial: true,
  })
  const metadata = shouldGenerateMetadata
    ? await generateMetadata(gpt)
    : await writeMetadata()

  if (metadata === undefined) return error(chalk.red('Metadata not provided.'))

  const { topic, keywords } = metadata

  await writeConversation(gpt.conversation, topic, keywords)

  log(chalk.green('Conversation saved.'))
}
