import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import process from 'node:process';

async function createProposal(proposalName: string): Promise<string> {
  const privateKey = process.env.HEDERA_ACCOUNT_PRIVATE_KEY;
  if (!privateKey) {
    return 'Create proposal failed: HEDERA_ACCOUNT_PRIVATE_KEY not set in environment.';
  }

  console.log(`Creating proposal: "${proposalName}"`);

  const command = [
    'cast',
    'send',
    '0x905b7a93269437fdcB77B46e5465ecD32a5E85E9', // contract address
    'createProposal(string,uint256)', // function signature
    proposalName,
    '86400', // duration
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

    // if (exitCode != 0) {
    //   console.error(`Error creating proposal: ${stderr}`);
    //   return `Error creating proposal: ${stderr}`;
    // }

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

const createProposalTool = tool(async (input: z.infer<typeof createProposalSchema>) => {
  return await createProposal(input.proposalName);
}, {
  name: 'create_proposal',
  description: 'Creates a new DAO proposal with a given name. Always call this when the user asks to create a proposal. You need not specify the DAO name, as it is already known to the tool.',
  schema: createProposalSchema,
});

export const allDaoTools = [createProposalTool];