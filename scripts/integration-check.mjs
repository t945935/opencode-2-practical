import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {loadFixtures,validateIssues,digest,createStore} from '../lib/issuedesk.mjs';
const target=process.argv[2];
if(!target || target.startsWith('--'))throw new Error('Usage: node scripts/integration-check.mjs NEW_OUTPUT_DIRECTORY');
const directory=resolve(target);await mkdir(directory);
const {issues,errors}=await loadFixtures();validateIssues(issues);
const store=createStore(join(directory,'todos.json'),issues);
const open=issues.filter(x=>x.status==='open');
const first=await Promise.all(open.map(x=>store.create(x.id)));
const repeat=await Promise.all(open.map(x=>store.create(x.id)));
const todos=await store.list();const groups=digest(issues,errors);
assert.equal(first.filter(x=>x.created).length,5);assert.equal(repeat.filter(x=>x.created).length,0);
assert.equal(todos.length,5);assert.equal(new Set(todos.map(x=>x.issue_id)).size,5);
assert.equal(groups[0].issue_id,'ISS-102');assert.equal(groups[0].count,27);
assert.equal(groups.reduce((n,x)=>n+x.count,0),49);assert.equal(groups.filter(x=>x.issue_id===null).length,2);
const report={scope:'local integration baseline',modelCalled:false,opencodeRuntimeTested:false,
 issues:issues.length,events:errors.length,firstCreated:5,repeatCreated:0,todos:5,totalCount:49,groups,
 todoSha256:createHash('sha256').update(await readFile(join(directory,'todos.json'))).digest('hex'),passed:true};
await writeFile(join(directory,'report.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({directory,...report},null,2));
