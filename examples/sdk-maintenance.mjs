import { OpenCode } from '@opencode/sdk';
import { resolve } from 'node:path';
import { complete } from '../lib/client.mjs';
const directory=resolve(process.argv[2] ?? '.');
const host=await OpenCode.create();
try{
 const session=await host.sessions.create({location:{directory},title:'IssueDesk maintenance'});
 if(!process.argv.includes('--execute')){
  console.log(JSON.stringify({mode:'structure-only',sessionCreated:!!session.id,instruction:'Add --execute to send a model request, after configuring a model.'}));
 }else{
  const result=await complete(host,session,'Inspect this practice project, make a concise maintenance report, and run its existing tests if available. Do not push or deploy.');
  console.log(JSON.stringify(result,null,2));
 }
}finally{await host.close()}
