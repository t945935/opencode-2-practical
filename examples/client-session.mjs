import { connect } from '../lib/client.mjs';
import { resolve } from 'node:path';
const directory=resolve(process.argv[2] ?? '.');
const client=await connect();
const session=await client.session.create({location:{directory},title:'IssueDesk reader session'});
const again=await client.session.get({sessionID:session.id});
console.log(JSON.stringify({version:(await client.server.info()).version,sessionID:session.id,sameSession:session.id===again.id},null,2));
