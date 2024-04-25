import readline from 'readline/promises'
import crypto from 'crypto'

import { eiDir, colorize } from './utils'

const credentialsDir = 'credentials'
const credentialsPath = eiDir(credentialsDir, 'index')
const algorithm = 'aes-256-cbc'

function encrypt(text: string) {
  const key = crypto.randomBytes(32)
  const iv = crypto.randomBytes(16)
  const ivString = iv.toString('hex')
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  Bun.write(eiDir(credentialsDir, ivString), key.toString('hex'))
  return [ivString, encrypted.toString('hex')]
}

async function decrypt(iv: string, encryptedText: string) {
  const key = await Bun.file(eiDir(credentialsDir, iv)).text()
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
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  const apiKey = await rl.question(colorize('Enter your API key: ', 0, 0, 255))
  const encrypted = encrypt(apiKey)
  const encryptedJSON = JSON.stringify(encrypted)
  Bun.write(credentialsPath, encryptedJSON)
  rl.close()
  console.log(colorize('Success.', 0, 255, 0))
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

export async function getApiKey(setApiKey: boolean) {
  if (setApiKey) return await setEncryptReturnApiKey()
  else {
    const apiKey = await getEncryptedApiKey()
    if (!apiKey) return await setEncryptReturnApiKey()
    return apiKey
  }
}
