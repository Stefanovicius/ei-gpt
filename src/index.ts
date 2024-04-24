#!/usr/bin/env bun

import { program } from 'commander'

program
  .version('0.0.1')
  .description('A CLI for chatting with ChatGPT.')
  .arguments('<prompt>')
  .option('-k, --set-api-key', 'Set API key interactively')
  .action((prompt, cmd) => {
    console.log('User prompt:', prompt)
    console.log('Set API key interactively:', cmd.setApiKey)
  });

program.parse(process.argv);
