import {mkdtemp, writeFile, readFile, copyFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {createStore, loadFixtures} from '../lib/issuedesk.mjs';

const directory = await mkdtemp(join(tmpdir(), 'issuedesk-e13-'));
try {
  const {issues} = await loadFixtures();
  const path = join(directory, 'todos.json');
  const backup = join(directory, 'todos.backup.json');
  const store = createStore(path, issues);
  await store.create('ISS-102');
  await copyFile(path, backup);
  const broken = '{ deliberately broken exercise JSON';
  await writeFile(path, broken);
  let failure;
  try { await store.create('ISS-101'); } catch (error) { failure = error; }
  assert.ok(failure instanceof SyntaxError, 'invalid JSON must be rejected');
  assert.equal(await readFile(path, 'utf8'), broken, 'failed write must preserve the damaged evidence');
  await copyFile(backup, path);
  const afterRestore = await store.list();
  assert.equal(afterRestore.length, 1);
  assert.equal(afterRestore[0].issue_id, 'ISS-102');
  assert.equal((await store.create('ISS-102')).created, false);
  console.log(JSON.stringify({exercise: 'E13', fault: 'invalid JSON', observedError: failure.name,
    damagedDataPreserved: true, restoredTodos: 1, duplicateCreatedAfterRestore: false,
    layer: 'local application storage', modelCalled: false, passed: true}, null, 2));
} finally {
  await rm(directory, {recursive: true, force: true});
}
