import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { dirname } from 'node:path';
export const severityOrder = { high: 0, medium: 1, low: 2 };
export function validateIssues(items) {
  if (!Array.isArray(items)) throw new TypeError('issues must be an array');
  const ids = new Set();
  for (const item of items) {
    if (!item || typeof item.id !== 'string' || !/^ISS-\d+$/.test(item.id)) throw new Error('invalid issue id');
    if (ids.has(item.id)) throw new Error(`duplicate issue: ${item.id}`);
    ids.add(item.id);
    if (typeof item.title !== 'string' || !item.title.trim()) throw new Error('title is required');
    if (!Object.hasOwn(severityOrder, item.severity)) throw new Error('invalid severity');
    if (!['open', 'closed'].includes(item.status)) throw new Error('invalid status');
  }
  return items;
}
export function digest(issues, errors) {
  validateIssues(issues);
  const byId = new Map(issues.map(x => [x.id, x]));
  const groups = new Map();
  for (const event of errors) {
    if (!Number.isSafeInteger(event.count) || event.count < 0) throw new Error('invalid event count');
    if (event.issue_id !== null && !byId.has(event.issue_id)) throw new Error(`unknown issue: ${event.issue_id}`);
    const key = event.issue_id ?? `unlinked:${event.id}`;
    const group = groups.get(key) ?? { key, issue_id: event.issue_id, count: 0, title: byId.get(event.issue_id)?.title ?? event.message, severity: byId.get(event.issue_id)?.severity ?? 'unknown' };
    group.count += event.count;
    groups.set(key, group);
  }
  return [...groups.values()].sort((a,b) => b.count-a.count || a.key.localeCompare(b.key));
}
// One store instance owns the file. The queue serializes writes in this process.
// It is intentionally not a multi-process database.
export function createStore(path, issues) {
  validateIssues(issues);
  let queue = Promise.resolve();
  async function list() {
    try {
      const items = JSON.parse(await readFile(path,'utf8'));
      if (!Array.isArray(items)) throw new Error('invalid todo file');
      return items;
    } catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  }
  function create(issueID) {
    const result = queue.then(async () => {
      const issue = issues.find(x => x.id === issueID);
      if (!issue || issue.status !== 'open') throw new Error('issue must exist and be open');
      const items = await list();
      const existing = items.find(x => x.issue_id === issueID);
      if (existing) return { created: false, todo: existing };
      const todo = { id: `TODO-${issueID.slice(4)}`, issue_id: issueID, title: issue.title };
      await mkdir(dirname(path), { recursive: true });
      const temporary = path + '.tmp';
      await writeFile(temporary, JSON.stringify([...items,todo],null,2)+'\n');
      await rename(temporary,path);
      return { created: true, todo };
    });
    queue = result.catch(() => {});
    return result;
  }
  return { list, create };
}
export async function loadFixtures() {
  const issues = JSON.parse(await readFile(new URL('../fixtures/issues.json',import.meta.url),'utf8'));
  const errors = JSON.parse(await readFile(new URL('../fixtures/errors.json',import.meta.url),'utf8'));
  validateIssues(issues);
  return { issues, errors };
}
