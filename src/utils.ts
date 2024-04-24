import path from 'path'
import os from 'os'

const homeDir = os.homedir()

export const hejDir = (...paths: string[]) =>
  path.join(homeDir, '.hej-gpt', ...paths)

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
