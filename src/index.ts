#! /usr/bin/env bun

import { program } from 'commander'
import { version } from '../package.json'
import { getSetApiKey } from './credentials'
import { generateImage } from './commands/image'
import { openRootDir } from './commands/directory'
import { chat } from './commands/chat'
import { list } from './commands/list'

const { log } = console

program
  .name('ei')
  .version(version)
  .description(
    `"Ei, GPT!" is a user-friendly Command Line Interface (CLI) tool that allows you to interact with OpenAI's ChatGPT directly from your terminal.`,
  )
  .arguments('[prompt]')
  .action(chat)

program
  .command('list')
  .alias('ls')
  .description('lists all conversations')
  .action(list)

program
  .command('image <prompt>')
  .alias('img')
  .description('generates an image from a prompt')
  .action(generateImage)

program
  .command('set <config> [value]')
  .description('sets global configurations')
  .action((config, value) => {
    switch (config) {
      case 'api-key':
        getSetApiKey(true)
        break
      case 'model':
        log('Soon will allow you to set the default model.')
        break
      case 'language':
        log('Soon will allow you to set the default language.')
        break
      default:
        log(`Unknown configuration: ${config}`)
    }
  })

program
  .command('directory')
  .alias('dir')
  .description('opens the .ei-gpt directory')
  .action(openRootDir)

program.parse(process.argv)

if (!process.argv.slice(2).length) program.help()
