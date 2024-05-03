# Ei, GPT!

"Ei, GPT!" (or "Hey, GPT!") is a user-friendly Command Line Interface (CLI) tool that allows you to interact with OpenAI's ChatGPT directly from your terminal. It's built using Bun and TypeScript and is designed to be fast and efficient.

## Prerequisites

First you'll need to install [Bun](https://bun.sh/), it's a new JavaScript runtime built from scratch to serve the modern JavaScript ecosystem.

Bun is designed as a drop-in replacement for Node.js. It natively implements hundreds of Node.js and Web APIs, including `fs`, `path`, `Buffer` and more.

The goal of Bun is to run most of the world's server-side JavaScript and provide tools to improve performance, reduce complexity, and multiply developer productivity.

You'll also need to get an [API key](https://platform.openai.com/docs/quickstart) from OpenAI.

## Getting started

To get started, install the prerequisites, get the OpenAI API key, then clone the project to your local machine, run `bun link` inside the directory, followed by `bun link ei-gpt`, and set the api key with `ei set -k`.

## Usage

```
ei [prompt]              prompt the chatgpt model
ei list|ls               lists all conversations
ei image|img <prompt>    generates an image from a prompt
ei set <config> [value]  sets global configurations
ei directory|dir         opens the .ei-gpt directory
```

## Notes

- When you set the API key it will be encrypted and stored on your local machine.
- All of the messages will also be stored in the local machine until you clear them.  

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
