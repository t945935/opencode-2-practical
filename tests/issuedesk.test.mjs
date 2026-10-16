import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadFixtures,digest,validateIssues,createStore } from '../lib/issuedesk.mjs';
const {issues,errors}=await loadFixtures();
test('aggregate repeated errors and preserve two distinct unlinked events',()=>{
 const result=digest(issues,errors);assert.equal(result[0].issue_id,'ISS-102');assert.equal(result[0].count,27);
 assert.equal(result.filter(x=>x.issue_id===null).length,2);
 assert.equal(result.reduce((sum,x)=>sum+x.count,0),49);
});
test('reject duplicate source IDs and invalid counts',()=>{
 assert.throws(()=>validateIssues([...issues,issues[0]]),/duplicate/);
 assert.throws(()=>digest(issues,[{id:'X',issue_id:null,count:-1}]),/count/);
 assert.throws(()=>digest(issues,[{id:'X',issue_id:'ISS-999',count:1}]),/unknown/);
});
test('parallel retries produce exactly one todo and survive reopening',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'issuedesk-test-'));const file=join(dir,'todos.json');
 try {
  const store=createStore(file,issues);const results=await Promise.all(Array.from({length:12},()=>store.create('ISS-102')));
  assert.equal(results.filter(x=>x.created).length,1);assert.equal((await store.list()).length,1);
  assert.equal((await createStore(file,issues).create('ISS-102')).created,false);
  await assert.rejects(store.create('ISS-105'),/open/);await assert.rejects(store.create('ISS-999'),/exist/);
  assert.equal((await store.create('ISS-101')).created,true);
 }finally{await rm(dir,{recursive:true,force:true})}
});
test('corrupt storage is reported instead of silently discarded',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'issuedesk-bad-'));const file=join(dir,'todos.json');
 try{await writeFile(file,'not-json');await assert.rejects(createStore(file,issues).create('ISS-102'));}
 finally{await rm(dir,{recursive:true,force:true})}
});
