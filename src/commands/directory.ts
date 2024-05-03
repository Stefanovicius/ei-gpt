import os from 'os'
import { $ } from 'bun'
import { fromRootDir } from '../storage'

export async function openRootDir() {
  const platform = os.platform()
  try {
    switch (platform) {
      case 'win32':
        await $`start "${fromRootDir()}"`
        break
      case 'darwin':
        await $`open "${fromRootDir()}"`
        break
      case 'linux':
        await $`xdg-open "${fromRootDir()}"`
        break
      default:
        console.error('Unsupported platform')
    }
  } catch (error) {
    console.error(`Failed to open directory. ${error}`)
  }
}
