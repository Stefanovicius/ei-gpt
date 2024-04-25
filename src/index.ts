#! /usr/bin/env bun

import { program } from 'commander'
import { getApiKey } from './credentials'
import { GPT } from './gpt'

program
  .name('ei')
  .version('0.1.2')
  .description(
    `"Ei, GPT!" is a user-friendly Command Line Interface (CLI) tool that allows you to interact with OpenAI's ChatGPT directly from your terminal.`,
  )

program
  .arguments('[prompt]')
  .option('-k, --set-api-key', 'Set API key interactively')
  .action(async (prompt, cmd) => {
    const apiKey = await getApiKey(cmd.setApiKey ?? false)
    if (!prompt) return
    const gpt = new GPT(apiKey)
    await gpt.sendMessage(prompt)
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) program.help()
