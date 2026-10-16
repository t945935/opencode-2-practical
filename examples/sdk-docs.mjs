import { OpenCode } from '@opencode/sdk';
import { resolve } from 'node:path';
import { complete } from '../lib/client.mjs';
const directory=resolve(process.argv[2] ?? 'samples');
const host=await OpenCode.create();
try{
 const session=await host.sessions.create({location:{directory},title:'IssueDesk documentation',permissions:[{action:'*',resource:'*',effect:'deny'},{action:'read',resource:'*.md',effect:'allow'},{action:'edit',resource:'*.md',effect:'allow'},{action:'glob',resource:'*.md',effect:'allow'}]});
 if(!process.argv.includes('--execute'))console.log(JSON.stringify({mode:'structure-only',sessionCreated:!!session.id,permissions:session.permissions}));
 else console.log(JSON.stringify(await complete(host,session,'Read the Markdown documents in this directory. Improve the instructions without inventing commands; only edit Markdown files. Report changes.'),null,2));
}finally{await host.close()}
