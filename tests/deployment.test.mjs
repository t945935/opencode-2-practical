import test from 'node:test';
import assert from 'node:assert/strict';
import {deploymentStatus} from '../plugins/deployment/index.mjs';
test('deployment tool exposes fictional state and rejects unknown services',()=>{
 assert.equal(deploymentStatus({service:'api'}).status,'healthy');
 assert.equal(deploymentStatus({service:'worker'}).status,'degraded');
 assert.throws(()=>deploymentStatus({service:'__proto__'}),/Unknown/);
 assert.throws(()=>deploymentStatus({service:'missing'}),/Unknown/);
});
