# Trustless DAO agent

## Contact names and Telegram Handle

Dyuthi Vivek - @DyuthiVivek (primary contact) <br>
Swetha Murali - @swetha344

## Team name

Ctrl+alt+elite

## Project Title

Trustless DAO Agent

## Elevator pitch

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

## Install steps

## Environment variables

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

## Usage example

## Known issues
