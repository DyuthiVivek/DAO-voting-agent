import { Tool } from '@langchain/core/tools';
import process from 'node:process';

async function webSearch(query: string): Promise<string> {
  const apiKey = process.env.SERPER_API_KEY;
  console.log('Web search query:', query);
  if (!apiKey) {
    return 'Web search failed: SERPER_API_KEY not set in environment.';
  }
  const myHeaders = new Headers();
  myHeaders.append('X-API-KEY', apiKey);
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({ q: query });
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow' as RequestRedirect,
  };

  try {
    const response = await fetch('https://google.serper.dev/search', requestOptions);
    const result = await response.text();
    // console.log('Web search result:', result);
    return result;
  } catch (error) {
    return `Web search error: ${error}`;
  }
}

export class WebSearchTool extends Tool {
  name = 'web_search';
  description = 'Search the web for up-to-date information. Always use this tool to find the latest information on any DAO and do some sentiment analysis before voting.';

  async _call(input: string): Promise<string> {
    return await webSearch(input);
  }
}

export const allWebSearchTools = [WebSearchTool];
