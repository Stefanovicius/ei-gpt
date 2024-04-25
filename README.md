# Ei, GPT!

"Ei, GPT!" (or "Hey, GPT!") is a user-friendly Command Line Interface (CLI) tool that allows you to interact with OpenAI's ChatGPT directly from your terminal. It's built using Bun and TypeScript and is designed to be fast and efficient.

## Prerequisites

First you'll need to install [Bun](https://bun.sh/), it's a new JavaScript runtime built from scratch to serve the modern JavaScript ecosystem.

Bun is designed as a drop-in replacement for Node.js. It natively implements hundreds of Node.js and Web APIs, including fs, path, Buffer and more.

The goal of Bun is to run most of the world's server-side JavaScript and provide tools to improve performance, reduce complexity, and multiply developer productivity.

You'll also need to get an [API key](https://platform.openai.com/docs/quickstart) from OpenAI.

## Getting started

To get started, you'll need to clone the project to your local machine, and run `bun link` inside the directory, followed by `bun link ei-gpt`.

Once you've done setting up, you can start using the tool by running `ei <prompt>`. It will ask you for an OpenAI API key on the first run (the project includes a secure mechanism for storing these keys), after you set it, you can begin making prompts to ChatGPT.

In the future, you'll be able to install "Ei, GPT!" by running `bun i -g ei-gpt`, making it even easier to start chatting with GPT.

## Notes

At the moment you can only prompt the GPT once, without any context, the GPT is only informed about the directory you're in and what type of system you're using. In the future the GPT will have more context, and will be able to intelligently choose to continue any past conversation. Stay tuned!
