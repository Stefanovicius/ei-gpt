#! /usr/bin/env bun

import { program } from 'commander'
import { getApiKey } from './credentials'
import { GPT } from './gpt'

program
  .name('ei')
  .version('0.2.0')
  .description(
    `"Ei, GPT!" is a user-friendly Command Line Interface (CLI) tool that allows you to interact with OpenAI's ChatGPT directly from your terminal.`,
  )

program.arguments('[prompt]').action(async (prompt) => {
  const apiKey = await getApiKey(false)
  const gpt = new GPT(apiKey)
  // Check for message relevance, if the message is irrelevant, name
  // and save the currently cached conversation, and start a new one
  await gpt.sendMessage(prompt)
})

program
  .command('cls')
  .description('clear/reset the last conversation')
  .action(() => {
    GPT.saveConversation([])
    console.log('Conversation cleared.')
  })

program
  .command('set')
  .description(
    `-k, --api-key   set api key
-m, --model     set model
-l, --language  set language`,
  )
  .option('-k, --api-key', 'set api key')
  .option('-m, --model', 'set model')
  .option('-l, --language', 'set language')
  .action((cmd) => {
    if (cmd.apiKey) getApiKey(true)
    if (cmd.model) console.log('Eventually will allow you to set the model.')
    if (cmd.language) console.log('Soon will allow you to set the language.')
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) program.help()
