import path from 'path'
import os from 'os'

const homeDir = os.homedir()

export const fromRootDir = (...paths: string[]) =>
  path.join(homeDir, '.ei-gpt', ...paths)

export const credentialsDirPath = fromRootDir('credentials')
export const credentialsIndexPath = fromRootDir('credentials', 'index')
export const messagesDirPath = fromRootDir('messages')
export const messagesIndexPath = fromRootDir('messages', 'index')
export const latestConversationPath = fromRootDir('messages', 'latest')

const readAsJSON = async (path: string) => await Bun.file(path).json()
const writeAsJSON = async (path: string, data: any) =>
  await Bun.write(path, JSON.stringify(data))

export interface IndexItem {
  id: string
  date: string
  topic: string
  keywords: string[]
  path: string
}

export const readIndex = async () => {
  try {
    const index: IndexItem[] = await readAsJSON(messagesIndexPath)
    return index
  } catch (error) {
    return []
  }
}

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function readConversation(id: string) {
  try {
    const index = await readIndex()
    const conversation = index.find((item: IndexItem) => item.id === id)
    if (!conversation) return []
    const messages: Message[] = await readAsJSON(conversation.path)
    return messages
  } catch (error) {
    return []
  }
}

export async function readLatestConversation() {
  try {
    const latestConversation: Message[] = await readAsJSON(
      latestConversationPath,
    )
    return latestConversation
  } catch (error) {
    return []
  }
}

export async function writeConversation(
  messages: Message[],
  topic: string,
  keywords: string[],
) {
  const id = crypto.randomUUID()
  const date = new Date().toISOString()
  const [year, month, day] = date.split('T')[0].split('-')
  const conversationPath = fromRootDir(
    'messages',
    year,
    month,
    day,
    `${id}.json`,
  )
  const index: IndexItem[] = await readIndex()
  index.push({ id, topic, keywords, date, path: conversationPath })
  await writeAsJSON(conversationPath, messages)
  await writeAsJSON(messagesIndexPath, index)
}

export async function storeLatestConversation(messages: Message[]) {
  await writeAsJSON(latestConversationPath, messages)
}
