import { setTimeout } from 'node:timers/promises';
import { loadFixtures,validateIssues } from '../lib/issuedesk.mjs';
console.log('Practice validation started');
await setTimeout(3000);
const {issues}=await loadFixtures();validateIssues(issues);
console.log(`Validated ${issues.length} issues`);
