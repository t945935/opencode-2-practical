import {mkdir, copyFile, writeFile} from 'node:fs/promises';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const target = process.argv[2];
if (!target || target.startsWith('--')) throw new Error('Usage: node scripts/prepare-first-task.mjs NEW_DIRECTORY [--completed]');
const directory = resolve(target);
const root = fileURLToPath(new URL('../', import.meta.url));
const completed = process.argv.includes('--completed');
await mkdir(directory); // Never overwrite a previous exercise.
for (const name of ['lib/issuedesk.mjs', 'tests/issuedesk.test.mjs', 'fixtures/issues.json', 'fixtures/errors.json']) {
  const source = completed && !name.startsWith('fixtures/') ? join(root, 'samples/first-task-complete', name) : join(root, name);
  const output = join(directory, name);
  await mkdir(dirname(output), {recursive: true});
  await copyFile(source, output);
}
const config = {permissions: [
  {action: '*', resource: '*', effect: 'deny'},
  ...['execute', 'read', 'glob', 'grep'].map(action => ({action, resource: '*', effect: 'allow'})),
  {action: 'edit', resource: 'lib/*', effect: 'allow'},
  {action: 'edit', resource: 'tests/*', effect: 'allow'},
  ...['npm test *', 'node --test *', 'git status *', 'git diff *'].map(resource => ({action: 'shell', resource, effect: 'allow'})),
]};
await writeFile(join(directory, 'opencode.json'), JSON.stringify(config, null, 2) + '\n');
await writeFile(join(directory, 'package.json'), JSON.stringify({name: 'issuedesk-first-task', private: true,
  type: 'module', scripts: {test: 'node --test tests/*.test.mjs'}}, null, 2) + '\n');
console.log(JSON.stringify({directory, mode: completed ? 'completed-reference' : 'starter',
  instruction: 'Run npm test, initialize your own Git baseline, then start the model exercise.'}, null, 2));
