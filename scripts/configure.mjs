import {mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
if(!process.argv[2])throw new Error('Usage: node scripts/configure.mjs /new/practice/directory');
const directory=resolve(process.argv[2]);await mkdir(directory,{recursive:true});
const file=join(directory,'opencode.json');
const config={mcp:{servers:{issuedesk:{type:'local',command:[process.execPath,fileURLToPath(new URL('../mcp/server.mjs',import.meta.url))],environment:{ISSUEDESK_DATA:join(directory,'runs','todos.json')}}}},permissions:[{action:'issuedesk_*',resource:'*',effect:'allow'}]};
await writeFile(file,JSON.stringify(config,null,2)+'\n',{flag:'wx'});
console.log('Created new config:',file);
