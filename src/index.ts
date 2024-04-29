#! /usr/bin/env bun

import { type ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { program } from 'commander'
import { version } from '../package.json'
import { getApiKey } from './credentials'
import { latestConversationPath } from './gpt'
import { GPT } from './gpt'

const { log } = console

program
  .name('ei')
  .version(version)
  .description(
    `"Ei, GPT!" is a user-friendly Command Line Interface (CLI) tool that allows you to interact with OpenAI's ChatGPT directly from your terminal.`,
  )

program
  .arguments('[prompt]')
  .option('-i, --image', '❌ generates an image based on the prompt')
  .action(async (prompt) => {
    const apiKey = await getApiKey(false)
    const gpt = new GPT(apiKey)
    await gpt.sendMessage(prompt)
  })

program
  .command('edit')
  .alias('ed')
  .description('❌ lets you edit the last prompt')
  .action(() => {
    log('Editing the last prompt...')
  })

program
  .command('regen')
  .alias('re')
  .description('❌ regenerates the last response')
  .action(() => {
    log('Regenerating the last response...')
  })

program
  .command('prev')
  .alias('pr')
  .description('❌ prints the previous response')
  .option('-f, --first', '❌ prints the first response')
  .option('-c, --conversation', '❌ prints the previous conversation')
  .action(() => {
    log('Printing the previous response...')
  })

program
  .command('next')
  .alias('nx')
  .description('❌ prints the next response')
  .option('-l, --last', '❌ prints the last response')
  .option('-c, --conversation', '❌ prints the next conversation')
  .action(() => {
    log('Printing the next response...')
  })

program
  .command('copy')
  .alias('cp')
  .description('❌ copies the last response')
  .option('-a, --all', '❌ copies all of the conversation')
  .action((cmd) => {
    if (cmd.all) log('Copying the whole conversation...')
    log('Copying the last response...')
  })

program
  .command('new')
  .description('❌ starts a new conversation')
  .option('-d, --drop', '❌ drops the latest conversation')
  .action((cmd) => {
    if (!cmd.drop) log('Prompting to save the latest conversation...')
    log('Starting a new conversation...')
  })

program
  .command('save')
  .alias('sv')
  .description('❌ saves the latest conversation')
  .option('-a, --all', '❌ copies all of the conversation')
  .option('-d, --destination', '❌ destination to save the conversation')
  .action(() => {
    log('Is there an latest conversation?')
    log('Should I save the conversation?')
    log('Categorizing and naming the conversation...')
    log('Is this category and name okay?')
    log('Prompting to edit the category and name...')
    log('Saving the conversation...')
  })

program
  .command('clear')
  .alias('cls')
  .description('✔️  clears the latest conversation')
  .action(() => {
    GPT.saveConversation([])
    log('Conversation cleared.')
  })

program
  .command('latest')
  .alias('lt')
  .description('✔️  prints the latest conversation')
  .action(async () => {
    const latestConversationFile = Bun.file(latestConversationPath)
    const latestConversationJson = await latestConversationFile.json()
    const latestConversation = latestConversationJson
      .map(({ content }: ChatCompletionMessageParam) => content)
      .join('\n\n')
    log(latestConversation)
  })

program
  .command('list')
  .alias('ls')
  .description('❌ lists all conversations')
  .action(() => {
    log('Listing all conversations...')
  })

program
  .command('set')
  .description('sets configurations')
  .option('-k, --api-key', 'set api key')
  .option('-m, --model', '❌ set model')
  .option('-l, --language', '❌ set language')
  .action((cmd) => {
    if (cmd.apiKey) getApiKey(true)
    if (cmd.model) log('Eventually will allow you to set the model.')
    if (cmd.language) log('Soon will allow you to set the language.')
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) program.help()
