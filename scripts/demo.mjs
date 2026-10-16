import { loadFixtures, digest, createStore } from '../lib/issuedesk.mjs';
import { resolve } from 'node:path';
const { issues, errors } = await loadFixtures();
const store = createStore(resolve(process.env.ISSUEDESK_DATA ?? 'runs/todos.json'), issues);
const results = await Promise.all(issues.filter(x=>x.status==='open').map(x=>store.create(x.id)));
console.log(JSON.stringify({mode:'local-data-demo-no-model',created:results.filter(x=>x.created).length,todos:await store.list(),digest:digest(issues,errors)},null,2));
