import path from 'path'
import os from 'os'

const homeDir = os.homedir()

export const eiDir = (...paths: string[]) =>
  path.join(homeDir, '.ei-gpt', ...paths)

export const colorize = (
  text: string,
  r: number,
  g: number,
  b: number
) => {
  const resetCode = '\x1b[0m'
  const colorEscapeCode = `\x1b[38;2;${r};${g};${b}m`
  return `${colorEscapeCode}${text}${resetCode}`
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
