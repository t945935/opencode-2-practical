import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const dir=await mkdtemp(join(tmpdir(),'issuedesk-mcp-'));
const client=new Client({name:'book-smoke',version:'0.2.0'});
const transport=new StdioClientTransport({command:process.execPath,args:[fileURLToPath(new URL('../mcp/server.mjs',import.meta.url))],env:{...process.env,ISSUEDESK_DATA:join(dir,'todos.json')}});
try {
 await client.connect(transport);
 const catalog=await client.listTools();assert.equal(catalog.tools.length,5);
 const call=async(name,args={})=>{
   const r=await client.callTool({name,arguments:args});
   if(r.isError)throw new Error(r.content[0].text);
   return JSON.parse(r.content[0].text);
 };
 const issues=await call('list_issues');assert.equal(issues.length,6);
 const first=await call('create_todo',{issue_id:'ISS-102'});
 const again=await call('create_todo',{issue_id:'ISS-102'});
 assert.equal(first.created,true);assert.equal(again.created,false);
 assert.equal((await call('list_todos')).length,1);
 const report=await call('error_digest');assert.equal(report[0].count,27);
 const denied=await client.callTool({name:'create_todo',arguments:{issue_id:'ISS-105'}});assert.equal(denied.isError,true);
 console.log(JSON.stringify({mcp:'real-stdio-transport',tools:catalog.tools.map(x=>x.name),deduplication:'passed',closed_issue_rejected:true,top_error_count:27,model_flow_tested:false},null,2));
} finally { await client.close();await transport.close();await rm(dir,{recursive:true,force:true}); }
