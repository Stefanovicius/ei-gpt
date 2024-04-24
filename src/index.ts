#! /usr/bin/env bun

import { program } from 'commander'
import { getApiKey } from './credentials'

program
  .version('0.0.2')
  .description('A CLI for chatting with ChatGPT.')
  .arguments('<prompt>')
  .option('-k, --set-api-key', 'Set API key interactively')
  .action(async (prompt, cmd) => {
    const apiKey = await getApiKey(cmd.setApiKey ?? false)
    // This is where the chat functionality will go
  })

program.parse(process.argv)
