import path from 'path'
import os from 'os'

const homeDir = os.homedir()

export const hejDir = (...paths: string[]) =>
  path.join(homeDir, '.hej-gpt', ...paths)
