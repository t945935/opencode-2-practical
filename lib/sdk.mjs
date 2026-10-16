import {OpenCode} from '@opencode/sdk';
import {resolve} from 'node:path';
import {stat} from 'node:fs/promises';

export {selectedModel} from './model.mjs';

export async function createHost() {
  const database = process.env.ISSUEDESK_DATABASE;
  if (!database) return OpenCode.create();
  const path = resolve(database);
  if (!(await stat(path)).isFile()) throw new Error('ISSUEDESK_DATABASE must be an existing practice database');
  return OpenCode.create({database: {path}});
}
