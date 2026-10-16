import { OpenCode } from '@opencode/sdk';
const host=await OpenCode.create();
try {
 const session=await host.sessions.create({location:{directory:process.cwd()},title:'IssueDesk SDK probe'});
 console.log(JSON.stringify({sessionCreated:!!session.id,projectPresent:!!session.projectID,modelRequested:false}));
}finally{await host.close()}
