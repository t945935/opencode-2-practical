import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { resolve } from 'node:path';
import { loadFixtures, createStore, digest } from '../lib/issuedesk.mjs';
const { issues, errors } = await loadFixtures();
const store = createStore(resolve(process.env.ISSUEDESK_DATA ?? 'runs/todos.json'), issues);
const empty = { type: 'object', properties: {}, additionalProperties: false };
const tools = [
  { name:'list_issues', description:'List fictional IssueDesk issues', inputSchema:empty },
  { name:'list_errors', description:'List fictional error events', inputSchema:empty },
  { name:'list_todos', description:'List local practice todos', inputSchema:empty },
  { name:'create_todo', description:'Create a todo for an open issue, idempotent by issue_id', inputSchema:{type:'object',properties:{issue_id:{type:'string',pattern:'^ISS-[0-9]+$'}},required:['issue_id'],additionalProperties:false} },
  { name:'error_digest', description:'Aggregate error counts; retain unlinked events separately', inputSchema:empty },
];
const server = new Server({ name:'issuedesk-book', version:'0.2.0' }, { capabilities:{tools:{}} });
server.setRequestHandler(ListToolsRequestSchema, async()=>({tools}));
server.setRequestHandler(CallToolRequestSchema, async request=>{
  try {
    const { name, arguments:args={} } = request.params;
    const allowed = name==='create_todo' ? ['issue_id'] : [];
    if (Object.keys(args).some(k=>!allowed.includes(k))) throw new Error('unexpected argument');
    let output;
    switch(name){
      case 'list_issues': output=issues;break;
      case 'list_errors': output=errors;break;
      case 'list_todos': output=await store.list();break;
      case 'create_todo':
        if(typeof args.issue_id!=='string') throw new Error('issue_id is required');
        output=await store.create(args.issue_id);break;
      case 'error_digest': output=digest(issues,errors);break;
      default: throw new Error('unknown tool');
    }
    return {content:[{type:'text',text:JSON.stringify(output)}]};
  } catch(error) { return {isError:true,content:[{type:'text',text:error.message}]}; }
});
// stdout is reserved for the MCP transport. Do not console.log debug messages.
await server.connect(new StdioServerTransport());
