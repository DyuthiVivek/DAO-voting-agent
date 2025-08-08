# Trustless DAO agent

## Contact Names and Telegram Handles

Dyuthi Vivek - @DyuthiVivek (primary contact) <br>
Swetha Murali - @swetha344

## Team Name

Ctrl+Alt+Elite

## Project Title

Trustless DAO Agent

## Elevator Pitch

Autonomous trustless AI agent that researches DAO proposals via web search, matches them to your preferences, and votes/stakes on Hedera.

## Description

The **Trustless DAO Agent** is an AI governance assistant that combines **personalized automation** with **real-time intelligence gathering**, keeping DAO members engaged without constant manual effort.
Built on **LangGraph** for multi-step reasoning and **Hedera** for secure, efficient smart contract execution, it goes beyond simple preference-based voting by conducting **live web searches** to inform its decisions.

Low voter turnout and uninformed participation often lead to poor DAO governance. This agent solves that by merging **automated execution** with **up-to-date research**, ensuring your votes are informed, aligned with your values, and executed without you having to be online.

When a new DAO proposal emerges, the agent:

1. Fetches and parses proposal details from Snapshot, Hedera-native DAOs, and Tally.
2. Runs targeted web searches (news, forums, analytics dashboards, social sentiment) for context.
3. Analyzes findings against your preferences and risk thresholds.
4. Generates a transparent decision explanation.
5. Executes the decision trustlessly — voting, staking, or lending tokens without ever holding your private keys.

Security is central: your keys stay in your control, delegation is revocable, and all actions are verifiable on-chain. The decision process, including research data, is fully auditable in a **React-based governance dashboard** where you can configure preferences, review proposals with AI explanations, override votes, and track token performance.

## Installation

1. Set environment variables listed below in a .env file.
2. Install `bun` using the command `curl -fsSL https://bun.sh/install | bash`.
3. Run `node mcpAgent.ts` in the background and `npm run dev` to start the frontend.
   
## Environment Variables

```sh
# Hedera config
# e.g. 0.0.12345
HEDERA_ACCOUNT_ID=

# e.g. 0xabcd1234x
HEDERA_ACCOUNT_PRIVATE_KEY=

# testnet, mainnet, previewnet, or localnode
HEDERA_ACCOUNT_NETWORK=

# ECDSA or EdDSA
HEDERA_ACCOUNT_PRIVATE_KEY_TYPE=

# Gemini config
GEMINI_API_URL=https://generativelanguage.googleapis.com

# e.g. your-google-api-key
GEMINI_API_KEY=

# e.g. gemini-pro
GEMINI_MODEL=

# serper api key
SERPER_API_KEY=
```

## Usage Example

USER PROMPT: Here is the smart contract ID for my Pizza Topping DAO: xxx. Monitor all proposals and vote YES only for veggie toppings, vote NO otherwise. 

AGENT RESPONSE: Noted! Fetching all proposals:

- Proposal 1: Onion
- Proposal 2: Pineapple
- Proposal 3: Chicken

Among the proposals listed, onions are vegetables but pineapple and chicken are not. I will vote YES for proposal 1 and NO for proposals 2 and 3 on your behalf.

## Known Issues

Due to unavailability of proposal creation methods on HashioDAO, we simulated the DAO process by creating our own smart contracts outlining the rules of a DAO. In the future, we hope to integrate our MCP with existing DAO platforms such as HashioDAO, providing a one-stop solution to automated DAO management.
