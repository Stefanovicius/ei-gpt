import crypto from 'crypto'
import chalk from 'chalk'
import prompts from 'prompts'

import { fromRootDir } from './storage'

const credentialsDir = 'credentials'
const credentialsPath = fromRootDir(credentialsDir, 'index')
const algorithm = 'aes-256-cbc'

function encrypt(text: string) {
  const key = crypto.randomBytes(32)
  const iv = crypto.randomBytes(16)
  const ivString = iv.toString('hex')
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  Bun.write(fromRootDir(credentialsDir, ivString), key.toString('hex'))
  return [ivString, encrypted.toString('hex')]
}

async function decrypt(iv: string, encryptedText: string) {
  const key = await Bun.file(fromRootDir(credentialsDir, iv)).text()
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, 'hex'),
    Buffer.from(iv, 'hex'),
  )
  let decrypted = decipher.update(Buffer.from(encryptedText, 'hex'))
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

async function setEncryptReturnApiKey() {
  const { apiKey } = await prompts({
    type: 'password',
    name: 'apiKey',
    message: 'OpenAI API key',
  })
  const encrypted = encrypt(apiKey)
  const encryptedJSON = JSON.stringify(encrypted)
  Bun.write(credentialsPath, encryptedJSON)
  chalk.green('Success.')
  return apiKey
}

async function getEncryptedApiKey() {
  try {
    const encrypted = await Bun.file(credentialsPath).json()
    return decrypt(encrypted[0], encrypted[1])
  } catch (err) {
    // @ts-ignore
    if (err.code !== 'ENOENT') console.error(err)
    return null
  }
}

export async function getSetApiKey(set: boolean = false) {
  if (set) return await setEncryptReturnApiKey()
  else {
    const apiKey = await getEncryptedApiKey()
    if (!apiKey) return await setEncryptReturnApiKey()
    return apiKey
  }
}
