import { Plugin } from '@opencode/plugin';
export const deployments=Object.freeze({api:{environment:'practice',revision:'demo-001',status:'healthy'},worker:{environment:'practice',revision:'demo-002',status:'degraded'}});
export function deploymentStatus(input){
 if(!input || typeof input.service!=='string' || !Object.hasOwn(deployments,input.service))throw new Error('Unknown practice service');
 return {service:input.service,...deployments[input.service]};
}
export default Plugin.define({id:'issuedesk.deployment',async setup(ctx){
 await ctx.tool.transform(editor=>{
  editor.namespace({name:'issuedesk',description:'Fictional deployment information for the book'});
  editor.add({name:'deployment_status',description:'Read fictional practice deployment status',input:{type:'object',properties:{service:{type:'string',enum:['api','worker']}},required:['service'],additionalProperties:false},options:{namespace:'issuedesk',codemode:true},execute:async input=>({content:JSON.stringify(deploymentStatus(input))})});
 });
}});
