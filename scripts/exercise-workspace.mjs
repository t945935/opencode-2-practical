import {mkdir, writeFile, readFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {createHash, randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';

const [id, action = 'prepare', target] = process.argv.slice(2);
if (!['E10', 'E11'].includes(id) || !['prepare', 'check', 'check-restored'].includes(action)) {
  throw new Error('Usage: node scripts/exercise-workspace.mjs E10|E11 prepare|check|check-restored [new-directory]');
}
if (id === 'E10' && action === 'check-restored') throw new Error('check-restored is for E11');
const directory = resolve(target ?? `runs/${id.toLowerCase()}`);
const hash = value => createHash('sha256').update(value).digest('hex');
const oldConfig = {permission: {read: 'allow', edit: 'deny', bash: 'deny'}, snapshot: false};
const newConfig = {permissions: [
  {action: 'read', resource: '*', effect: 'allow'},
  {action: 'edit', resource: '*', effect: 'deny'},
  {action: 'shell', resource: '*', effect: 'deny'},
], snapshots: false};
const json = value => JSON.stringify(value, null, 2) + '\n';
if (action === 'prepare') {
  if (!target) await mkdir(resolve('runs'), {recursive: true});
  // Existing directories are refused even if empty. Never overwrite an earlier exercise.
  await mkdir(directory);
  const files = id === 'E10' ? {
    'public.txt': `Practice marker: ${randomUUID()}\n`,
    'protected.txt': 'Fictional exercise data. Keep this file unchanged.\n',
    'allowed.txt': 'Optional editable exercise file.\n',
    'opencode.json': json({permissions: [
      {action: '*', resource: '*', effect: 'deny'},
      {action: 'execute', resource: '*', effect: 'allow'},
      {action: 'read', resource: 'public.txt', effect: 'allow'},
      {action: 'edit', resource: 'allowed.txt', effect: 'allow'},
    ]}),
  } : {
    'backup/opencode.json': json(oldConfig),
    'candidate/opencode.json': json(oldConfig),
    'reference/opencode.json': json(newConfig),
  };
  for (const [name, value] of Object.entries(files)) {
    const path = join(directory, name);
    await mkdir(resolve(path, '..'), {recursive: true});
    await writeFile(path, value, {flag: 'wx'});
  }
  await writeFile(join(directory, 'baseline.json'), json({exercise: id,
    hashes: Object.fromEntries(Object.entries(files).map(([name, value]) => [name, hash(value)]))}), {flag: 'wx'});
  await writeFile(join(directory, 'evidence.json'), json({exercise: id, opencodeVersion: null,
    model: null, sessionID: null, positiveToolResult: null, negativeToolResult: null,
    runtimeStatus: 'not_tested', note: 'Fill with actual observations; a file check alone cannot verify OpenCode behavior.'}), {flag: 'wx'});
  console.log(json({exercise: id, directory, prepared: true, modelCalled: false}));
} else {
  const baseline = JSON.parse(await readFile(join(directory, 'baseline.json'), 'utf8'));
  assert.equal(baseline.exercise, id);
  if (id === 'E10') {
    for (const name of ['public.txt', 'protected.txt', 'opencode.json']) {
      assert.equal(hash(await readFile(join(directory, name))), baseline.hashes[name], `${name} changed`);
    }
    console.log(json({exercise: id, filesUnchanged: true, permissionRuntimeVerified: false,
      next: 'Review actual tool success/denial evidence; no file change alone is insufficient.'}));
  } else {
    const backup = await readFile(join(directory, 'backup/opencode.json'));
    assert.equal(hash(backup), baseline.hashes['backup/opencode.json'], 'backup changed');
    const candidate = await readFile(join(directory, 'candidate/opencode.json'));
    if (action === 'check-restored') assert.equal(hash(candidate), hash(backup), 'restore mismatch');
    else assert.deepEqual(JSON.parse(candidate), newConfig, 'candidate does not match the exercise mapping');
    console.log(json({exercise: id, backupUnchanged: true, check: action,
      fixtureCheckPassed: true, opencodeMigrationRuntimeVerified: false}));
  }
}
