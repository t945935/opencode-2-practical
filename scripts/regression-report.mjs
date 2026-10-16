import {spawnSync} from 'node:child_process';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {createHash, randomUUID} from 'node:crypto';
import {resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const label = process.argv[2];
if (!label || !/^[a-zA-Z0-9_-]{1,40}$/.test(label)) throw new Error('Usage: node scripts/regression-report.mjs baseline|candidate');
const root = fileURLToPath(new URL('../', import.meta.url));
const directory = resolve(root, 'runs/regression', `${label}-${Date.now()}-${randomUUID().slice(0,8)}`);
await mkdir(directory, {recursive: true});
const checks = [
  ['domain-tests', process.execPath, ['--test', 'tests/issuedesk.test.mjs', 'tests/deployment.test.mjs']],
  ['mcp', process.execPath, ['scripts/mcp-smoke.mjs']],
  ['recovery', process.execPath, ['scripts/fault-recovery.mjs']],
];
const results = [];
for (const [name, command, args] of checks) {
  const result = spawnSync(command, args, {cwd: root, encoding: 'utf8', timeout: 60000});
  await writeFile(join(directory, `${name}.log`), (result.stdout ?? '') + (result.stderr ?? '') + (result.error?.message ?? ''));
  results.push({name, exitCode: result.status, signal: result.signal, error: result.error?.code ?? null,
    passed: result.status === 0 && !result.error});
}
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const lock = await readFile(join(root, 'package-lock.json'));
const report = {exercise: 'E14', label, recordedAt: new Date().toISOString(),
  node: process.version, platform: process.platform, architecture: process.arch,
  companionVersion: pkg.version, dependencies: pkg.dependencies,
  lockSHA256: createHash('sha256').update(lock).digest('hex'), checks: results,
  passed: results.every(x => x.passed),
  coverage: 'local tests, MCP transport, data recovery', modelTested: false,
  opencodeRuntimeTested: false, actualUpgradeVerified: false};
await writeFile(join(directory, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({report: join(directory, 'report.json'), ...report}, null, 2));
if (!report.passed) process.exitCode = 1;
