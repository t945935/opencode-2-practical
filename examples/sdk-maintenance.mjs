import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { createHost, selectedModel } from '../lib/sdk.mjs';
import { complete } from '../lib/client.mjs';
const directory=resolve(process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : '.');
const execute=process.argv.includes('--execute');
const model=execute ? selectedModel() : undefined;
const requestIndex=process.argv.indexOf('--request');
if(requestIndex>=0 && (!process.argv[requestIndex+1] || process.argv[requestIndex+1].startsWith('--')))throw new Error('--request needs a text file');
const request=requestIndex>=0 ? await readFile(resolve(process.argv[requestIndex+1]),'utf8') : 'Inspect this practice project, make a concise maintenance report, and run its existing tests if available. Do not push or deploy.';
const host=await createHost();
try{
 const session=await host.sessions.create({location:{directory},title:'IssueDesk maintenance',...(model ? {model} : {})});
 if(!execute){
  console.log(JSON.stringify({mode:'structure-only',sessionCreated:!!session.id,instruction:'Add --execute to send a model request, after configuring a model.'}));
 }else{
  const result=await complete(host,session,request);
  console.log(JSON.stringify(result,null,2));
 }
}finally{await host.close()}
