import {readFile} from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHost, selectedModel } from '../lib/sdk.mjs';
import { complete } from '../lib/client.mjs';
const directory=resolve(process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'samples');
const execute=process.argv.includes('--execute');
const model=execute ? selectedModel() : undefined;
const requestIndex=process.argv.indexOf('--request');
if(requestIndex>=0 && (!process.argv[requestIndex+1] || process.argv[requestIndex+1].startsWith('--')))throw new Error('--request needs a text file');
const request=requestIndex>=0 ? await readFile(resolve(process.argv[requestIndex+1]),'utf8') : 'Read the Markdown documents in this directory. Improve headings and instruction order while preserving all commands and factual claims. Do not invent commands or capabilities; only edit Markdown files. Report actual changes.';
const host=await createHost();
try{
 const session=await host.sessions.create({location:{directory},title:'IssueDesk documentation',...(model ? {model} : {}),permissions:[{action:'*',resource:'*',effect:'deny'},{action:'read',resource:'*.md',effect:'allow'},{action:'edit',resource:'*.md',effect:'allow'},{action:'glob',resource:'*.md',effect:'allow'}]});
 if(!execute)console.log(JSON.stringify({mode:'structure-only',sessionCreated:!!session.id,permissions:session.permissions}));
 else console.log(JSON.stringify(await complete(host,session,request),null,2));
}finally{await host.close()}
