import chalk from 'chalk'
import prompts from 'prompts'
import { type IndexItem, readIndex, readConversation } from '../storage'
import { formatDate } from '../utils'

const { log } = console

interface Choice {
  title: string
  value: IndexItem
}

export async function list() {
  const conversations = await readIndex()
  if (!conversations.length) return log('No conversations found.')

  const choices: Choice[] = conversations.map((conversation) => ({
    title: `${chalk.dim(formatDate(conversation.date))} ${conversation.topic}`,
    value: conversation,
  }))

  const suggestByDateTopicAndKeywords = async (
    input: string,
    choices: prompts.Choice[],
  ) => {
    const searchTerm = input.toLowerCase()

    const filteredChoices = choices.filter(({ value }) => {
      const dateMatch = value.date.toLowerCase().includes(searchTerm)
      const topicMatch = value.topic.toLowerCase().includes(searchTerm)
      const keywordMatch = value.keywords.some((keyword: string) =>
        keyword.toLowerCase().includes(searchTerm),
      )
      return dateMatch || topicMatch || keywordMatch
    })

    const sortedChoices = filteredChoices.sort(
      (a, b) =>
        new Date(b.value.date).getTime() - new Date(a.value.date).getTime(),
    )
    return sortedChoices
  }

  log()
  const { conversationChoice } = await prompts({
    type: 'autocomplete',
    name: 'conversationChoice',
    message: 'Search',
    initial: -1,
    limit: 20,
    choices,
    suggest: suggestByDateTopicAndKeywords,
    // @ts-ignore
    fallback: '    No conversation found.',
  })

  if (!conversationChoice) return log(chalk.dim('No conversation selected.'))

  const { id } = conversationChoice

  const conversation = await readConversation(id)
  const getName = (role: string) =>
    role === 'assistant' ? chalk.green('GPT:') : chalk.greenBright('You:')
  log(
    '\n' +
      conversation
        .map(({ role, content }) => `${getName(role)} ${content}`)
        .join('\n\n') +
      '\n',
  )
}
