// Run in OpenCode Code Mode, not as a standalone Node script.
const [issues, errors] = await Promise.all([
  tools.issuedesk.list_issues(),
  tools.issuedesk.list_errors()
]);
const byID = new Map(issues.map(issue => [issue.id, issue]));
const groups = new Map();
let total = 0;
for (const event of errors) {
  const issue = event.issue_id === null ? undefined : byID.get(event.issue_id);
  if (event.issue_id !== null && !issue) throw new Error('Unknown issue reference');
  if (!Number.isSafeInteger(event.count) || event.count < 0) throw new Error('Invalid count');
  const key = event.issue_id ?? `unlinked:${event.id}`;
  if (!groups.has(key)) groups.set(key, {
    key, issue_id: event.issue_id,
    title: issue?.title ?? event.message,
    severity: issue?.severity ?? 'unknown', count: 0
  });
  groups.get(key).count += event.count;
  total += event.count;
}
return {
  grouped: [...groups.values()].sort((a, b) => b.count - a.count || a.key.localeCompare(b.key)),
  total
};
