#! /usr/bin/env bun

import { program } from 'commander'
import { getApiKey } from './credentials'
import { GPT } from './gpt'

program
  .version('0.1.0')
  .description('A CLI for chatting with ChatGPT.')
  .arguments('<prompt>')
  .option('-k, --set-api-key', 'Set API key interactively')
  .action(async (prompt, cmd) => {
    const apiKey = await getApiKey(cmd.setApiKey ?? false)
    const gpt = new GPT(apiKey)
    await gpt.sendMessage(prompt)
  })

program.parse(process.argv)
