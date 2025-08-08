#!/usr/bin/env bun

import readline from 'node:readline/promises';
import process from 'node:process';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent, ToolNode } from '@langchain/langgraph/prebuilt';
import { HumanMessage } from '@langchain/core/messages';
import { allJokeTools } from './tools/joke.js';
import { createInstance as createLlmInstance } from './api/gemini.js';
import { createInstance as createHederaInstance } from './api/hedera-client.js'
import { convertMcpToLangchainTools } from '@h1deya/langchain-mcp-tools';
import { create } from 'node:domain';

const mcpServers = {
  hederaMirrorNode: {
    command: 'npx',
    args: ['-y', 'openapi-mcp-server@1.2.0-beta05', './hedera-mn.openapi.yml']
  },
};

const { tools: mcpLangChainTools } = await convertMcpToLangchainTools(mcpServers);
const tools = [...mcpLangChainTools];
const toolsNode = new ToolNode(tools);

const checkpointSaver = new MemorySaver();

const llm = createLlmInstance();
createHederaInstance();

// Bind Hedera and joke tools to the LLM
const toolClasses = [
  ...tools, // from MCP (Hedera) tools
  ...(typeof allJokeTools !== 'undefined' ? allJokeTools : []) // if joke tools are imported
];
const llmWithTools = llm.bindTools(toolClasses);

const agent = createReactAgent({
  llm: llmWithTools,
  tools: toolClasses,
  checkpointSaver,
});


const rlp = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function readUserPrompt() {
  const lines = [];
  while (true) {
    const line = await rlp.question('');
    if (line == '' && lines[lines.length - 1] === '') {
      return lines.join('\n');
    }
    lines.push(line);
  }
}


const HEDERA_ACCOUNT_ID = process.env.HEDERA_ACCOUNT_ID;
const SYSTEM_PROMPT = HEDERA_ACCOUNT_ID
  ? `You are an agent with access to a Hedera account. Always use the following Hedera account number for any blockchain-related actions: ${HEDERA_ACCOUNT_ID}`
  : undefined;

async function obtainAgentReply(userPrompt) {
  const messages = [];
  if (SYSTEM_PROMPT) {
    messages.push({ role: 'system', content: SYSTEM_PROMPT });
  }
  messages.push(new HumanMessage(userPrompt));
  const reply = await agent.invoke(
    {
      messages,
    },
    {
      configurable: { thread_id: '0x0001' },
    },
  );

  const agentReply = reply.messages[reply.messages.length - 1].content;
  return agentReply;
}

while (true) {
  console.log('You:\n');
  const userPrompt = await readUserPrompt();

  if (userPrompt.trim() === '/history') {
    console.log('--- Agent History ---');
    console.dir(checkpointSaver, { depth: null });
    continue;
  }

  console.log('Agent:\n');
  const agentReply = await obtainAgentReply(userPrompt);
  console.log(agentReply);
}
