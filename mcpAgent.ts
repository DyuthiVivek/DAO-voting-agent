#!/usr/bin/env bun

import readline from 'node:readline/promises';
import process from 'node:process';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent, ToolNode } from '@langchain/langgraph/prebuilt';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { allJokeTools } from './tools/joke.js';
import { allWebSearchTools } from './tools/websearch.js';
import { allDaoTools } from './tools/dao-tools.ts';
import { createInstance as createLlmInstance } from './api/gemini.js';
import { createInstance as createHederaInstance } from './api/hedera-client.js'
import { convertMcpToLangchainTools } from '@h1deya/langchain-mcp-tools';


const mcpServers = {
  hederaMirrorNode: {
    command: 'npx',
    args: ['-y', 'openapi-mcp-server@1.2.0-beta05', './hedera-mn.openapi.yml']
  },
};

const { tools: mcpLangChainTools } = await convertMcpToLangchainTools(mcpServers, {
  toolTimeout: 1200000, // 30 seconds
});
const tools = [...mcpLangChainTools];
const toolsNode = new ToolNode(tools);

const checkpointSaver = new MemorySaver();

const llm = createLlmInstance();
createHederaInstance();

function ensureToolInstance(T) {
  try {
    if (typeof T === 'function') {
      return new T();
    }
  } catch (e) {}
    return T;
}

const toolClasses = [
  ...tools, // from MCP (Hedera) tools
  ...(typeof allJokeTools !== 'undefined' ? allJokeTools.map(ensureToolInstance) : []),
  ...(typeof allWebSearchTools !== 'undefined' ? allWebSearchTools.map(ensureToolInstance) : []),
  ...(typeof allDaoTools !== 'undefined' ? allDaoTools.map(ensureToolInstance) : [])
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
  ? `You are an agent with access to a Hedera account. Always use the following Hedera account number for any blockchain-related actions: ${HEDERA_ACCOUNT_ID}. If any transaction occurs, always return the transaction ID in your response.`
  : undefined;


let isFirstPrompt = true;
async function obtainAgentReply(userPrompt) {
  const messages = [];
  if (SYSTEM_PROMPT && isFirstPrompt) {
    messages.push(new SystemMessage(SYSTEM_PROMPT));
    isFirstPrompt = false;
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

Bun.serve({
  port: 5000,
  async fetch(req) {
    const { pathname } = new URL(req.url);

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (pathname === '/agent') {
      if (req.method === 'POST') {
        const { userPrompt } = await req.json();
        const agentReply = await obtainAgentReply(userPrompt);

        return new Response(JSON.stringify({ reply: agentReply }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }
    return new Response(null, { status: 404 });
  }
});

// while (true) {
//   console.log('You:\n');
//   const userPrompt = await readUserPrompt();

//   if (userPrompt.trim() === '/history') {
//     console.log('--- Agent History ---');
//     console.dir(checkpointSaver, { depth: null });
//     continue;
//   }

//   console.log('Agent:\n');
//   const agentReply = await obtainAgentReply(userPrompt);
//   console.log(agentReply);
// }
