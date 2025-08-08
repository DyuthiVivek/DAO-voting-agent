import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import process from 'node:process';

// ========================================================
// Create Proposal Tool
// ========================================================
async function createProposal(proposalName: string): Promise<string> {
  const privateKey = process.env.HEDERA_ACCOUNT_PRIVATE_KEY;
  if (!privateKey) {
    return 'Create proposal failed: HEDERA_ACCOUNT_PRIVATE_KEY not set in environment.';
  }

  console.log(`Creating proposal: "${proposalName}"`);

  const command = [
    'cast',
    'send',
    '0x905b7a93269437fdcB77B46e5465ecD32a5E85E9',
    'createProposal(string,uint256)',
    proposalName,
    '86400',
    '--private-key',
    privateKey,
    '--rpc-url',
    'https://testnet.hashio.io/api',
  ];

  try {
    const proc = Bun.spawn(command);
    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    const exitCode = await proc.exitCode;

    console.log(`Proposal creation stdout: ${stdout}`);
    return `Proposal created successfully. Transaction details: ${stdout}`;
  } catch (error: any) {
    console.error(`Error executing cast command: ${error.message}`);
    return `Error executing cast command: ${error.message}`;
  }
}

const createProposalSchema = z.object({
  proposalName: z.string().describe("The name or title for the new DAO proposal."),
});

const createProposalTool = tool(
  async (input: z.infer<typeof createProposalSchema>) => {
    return await createProposal(input.proposalName);
  },
  {
    name: 'create_proposal',
    description: 'Creates a new DAO proposal with a given name.',
    schema: createProposalSchema,
  }
);

// ========================================================
// Get All Proposals Tool
// ========================================================
async function getAllProposals(): Promise<string> {
  const command = [
    'bash',
    '-c',
    `for id in $(seq 1 $(cast call 0x905b7a93269437fdcB77B46e5465ecD32a5E85E9 "proposalCount()(uint256)" --rpc-url "https://testnet.hashio.io/api")); do cast call 0x905b7a93269437fdcB77B46e5465ecD32a5E85E9 "proposals(uint256)(address,string,uint256,uint256,uint256,bool)" $id --rpc-url "https://testnet.hashio.io/api"; done`
  ];

  try {
    const proc = Bun.spawn(command);
    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    const exitCode = await proc.exitCode;

    console.log(`Get all proposals stdout: ${stdout}`);
    return stdout.trim();
  } catch (error: any) {
    console.error(`Error executing cast command: ${error.message}`);
    return `Error executing cast command: ${error.message}`;
  }
}

const getAllProposalsTool = tool(
  async () => {
    return await getAllProposals();
  },
  {
    name: 'get_all_proposals',
    description: `Fetches all DAO proposals. Return only information about relevant proposals that the user is asking. Each proposal will look like this:
<Proposal name>
<deadline_unix>
<votes_for>
<votes_against>
<executed_bool>`,
    schema: z.object({}),
  }
);

// ========================================================
// Vote Tool
// ========================================================
async function voteOnProposal(proposalId: number, support: boolean): Promise<string> {
  const privateKey = process.env.HEDERA_ACCOUNT_PRIVATE_KEY;
  if (!privateKey) {
    return 'Vote failed: HEDERA_ACCOUNT_PRIVATE_KEY not set in environment.';
  }

  const command = [
    'cast',
    'send',
    '0x905b7a93269437fdcB77B46e5465ecD32a5E85E9',
    'vote(uint256,bool)',
    proposalId.toString(),
    support.toString(),
    '--private-key',
    privateKey,
    '--rpc-url',
    'https://testnet.hashio.io/api',
  ];

  try {
    const proc = Bun.spawn(command);
    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    const exitCode = await proc.exitCode;

    console.log(`Vote stdout: ${stdout}`);
    return `Voted successfully. Transaction details: ${stdout}`;
  } catch (error: any) {
    console.error(`Error executing cast command: ${error.message}`);
    return `Error executing cast command: ${error.message}`;
  }
}

const voteOnProposalSchema = z.object({
  proposalId: z.number().describe('The ID of the proposal to vote on.'),
  support: z.boolean().describe('True to vote in favor, false to vote against.'),
});

const voteOnProposalTool = tool(
  async (input: z.infer<typeof voteOnProposalSchema>) => {
    return await voteOnProposal(input.proposalId, input.support);
  },
  {
    name: 'vote_on_proposal',
    description: 'Casts a vote on a DAO proposal. If you are not provided the proposal ID, you can use the get_all_proposals tool to fetch all proposals. The first proposal has ID 1, second has ID 2, and so on.',
    schema: voteOnProposalSchema,
  }
);

// ========================================================
// Export All Tools
// ========================================================
export const allDaoTools = [
  createProposalTool,
  getAllProposalsTool,
  voteOnProposalTool
];
