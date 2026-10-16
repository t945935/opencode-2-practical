import { connect,complete } from '../lib/client.mjs';
import { mkdir,open,unlink } from 'node:fs/promises';
import { resolve,join } from 'node:path';
const directory=resolve(process.argv[2] ?? '.');
const output=resolve(process.argv[3] ?? 'runs');await mkdir(output,{recursive:true});
const lockPath=join(output,'daily-review.lock');
let lock;
try{lock=await open(lockPath,'wx');}catch(e){if(e.code==='EEXIST')throw new Error('Review already running, or stale lock needs inspection');throw e;}
try{
 const client=await connect();
 const session=await client.session.create({location:{directory},title:'Daily IssueDesk review',permissions:[{action:'*',resource:'*',effect:'deny'},{action:'read',resource:'*',effect:'allow'},{action:'glob',resource:'*',effect:'allow'},{action:'grep',resource:'*',effect:'allow'}]});
 const result=await complete(client,session,'Read the project files and report likely correctness issues with file references. Do not change any files.');
 const report=await open(join(output,'review-'+Date.now()+'.json'),'wx');
 try{await report.writeFile(JSON.stringify(result,null,2));}finally{await report.close()}
 console.log('Review completed:',session.id);
}finally{await lock.close();await unlink(lockPath)}
