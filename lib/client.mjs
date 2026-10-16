import { OpenCode } from '@opencode/client';
import { Service } from '@opencode/client/service';
export async function connect(){
 if(process.env.ISSUEDESK_SERVER_URL){
  const password=process.env.ISSUEDESK_SERVER_PASSWORD;
  if(!password)throw new Error('Set ISSUEDESK_SERVER_PASSWORD for the selected server');
  return OpenCode.make({baseUrl:process.env.ISSUEDESK_SERVER_URL,headers:{authorization:'Basic '+Buffer.from('opencode:'+password).toString('base64')}});
 }
 const endpoint=await Service.ensure({version:v=>v.startsWith('2.')});
 return OpenCode.make({baseUrl:endpoint.url,headers:Service.headers(endpoint)});
}
export async function complete(client,session,text){
 await client.session.prompt({sessionID:session.id,text});
 try{await client.session.wait({sessionID:session.id},{signal:AbortSignal.timeout(120000)});}
 catch(error){await client.session.interrupt({sessionID:session.id});throw error;}
 const final=await client.session.get({sessionID:session.id});
 if(final.outcome!=='succeeded')throw new Error(`Session ended with ${final.outcome ?? 'unknown outcome'}`);
 return {session:final,messages:await client.session.context({sessionID:session.id})};
}
