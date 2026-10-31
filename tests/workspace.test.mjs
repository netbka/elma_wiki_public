import test from 'node:test';
import assert from 'node:assert/strict';
import {initialWorkspace,createRequest,addComment,decodeWorkspace,loadWorkspace,saveWorkspace,STORAGE_KEY} from '../src/workspace/model.mjs';
import {findModulePlace} from '../src/workspace/modules-data.mjs';

const input={kind:'change',moduleId:'contracts',title:'Require an attachment',problem:'Contracts arrive without the required attachment.',expected:'Require the file before submitting.',place:{id:'attachment',label:'untrusted label',kind:'action'}};
function memory() {const entries=new Map();return {getItem:k=>entries.get(k)||null,setItem:(k,v)=>entries.set(k,v)};}

test('a contextual request keeps the trusted module element and survives a reload',()=>{
  const previous=initialWorkspace(),result=createRequest(previous,input,findModulePlace);
  assert.equal(result.ok,true);
  const record=result.state.requests[0];
  assert.equal(record.moduleId,'contracts');assert.equal(record.place.id,'attachment');
  assert.equal(record.place.kind,'field');assert.notEqual(record.place.label,'untrusted label');
  assert.equal(previous.requests.some(r=>r.id===result.id),false);
  const storage=memory();assert.equal(saveWorkspace(storage,previous,result.state).ok,true);
  const restored=loadWorkspace(storage);assert.deepEqual(restored.state.requests[0],record);
});
test('unrecognized module elements and incomplete changes cannot become stored requests',()=>{
  const state=initialWorkspace();
  for(const patch of [{place:{id:'missing-field'}},{place:null},{moduleId:'private-live-module'},{title:''},{problem:''},{expected:''},{kind:'execute'}]) {
    const result=createRequest(state,{...input,...patch},findModulePlace);assert.equal(result.ok,false);
  }
  assert.deepEqual(state,initialWorkspace());
});
test('questions do not require an invented expected change; request identifiers remain unique',()=>{
  const state=initialWorkspace();const a=createRequest(state,{...input,kind:'question',expected:''},findModulePlace);
  const b=createRequest(a.state,{...input,kind:'question',expected:''},findModulePlace);
  assert.equal(a.ok,true);assert.equal(b.ok,true);assert.notEqual(a.id,b.id);
  assert.equal(b.state.requests[0].expected,'');assert.equal(b.state.requests[0].stage,'analysis');
  const context=createRequest(state,{...input,kind:'question',expected:'Keep this additional question context.'},findModulePlace);
  assert.equal(context.state.requests[0].expected,'Keep this additional question context.');
});
test('comments survive serialization without changing the illustrated workflow stage',()=>{
  const state=initialWorkspace();const stage=state.requests[0].stage;
  const result=addComment(state,'W-14','Use the original route exactly at the threshold.');
  assert.equal(result.ok,true);const restored=decodeWorkspace(JSON.stringify(result.state));
  assert.equal(restored.requests[0].stage,stage);assert.equal(restored.requests[0].comments.length,1);
  assert.equal(addComment(state,'missing','A comment').ok,false);
  assert.equal(addComment(state,'W-14',' ').ok,false);
  assert.equal(addComment(state,'W-14','x'.repeat(2001)).ok,false);
});
test('an older tab cannot overwrite a newer saved request',()=>{
  const storage=memory(),base=initialWorkspace();
  const a=createRequest(base,input,findModulePlace);
  assert.equal(saveWorkspace(storage,base,a.state).ok,true);
  const b=addComment(base,'W-14','A reply from the older tab');
  const conflict=saveWorkspace(storage,base,b.state);
  assert.equal(conflict.ok,false);assert.equal(conflict.error,'conflict');
  assert.equal(loadWorkspace(storage).state.requests[0].id,a.id);
  assert.deepEqual(conflict.state,a.state);
});
test('corrupt or incompatible saved data recovers to the sample and reports the recovery',()=>{
  for(const raw of ['{','null',JSON.stringify({...initialWorkspace(),version:2}),JSON.stringify({...initialWorkspace(),requests:[...initialWorkspace().requests,initialWorkspace().requests[0]]})]) {
    const storage=memory();storage.setItem(STORAGE_KEY,raw);
    const result=loadWorkspace(storage);assert.equal(result.notice,'recovered');assert.deepEqual(result.state,initialWorkspace());
  }
});
test('storage failure reports that work is memory-only and keeps the new record',()=>{
  const unavailable={getItem(){throw new Error('denied');},setItem(){throw new Error('denied');}};
  assert.equal(loadWorkspace(unavailable).notice,'storage');
  const base=initialWorkspace(),next=createRequest(base,input,findModulePlace);
  const saved=saveWorkspace(unavailable,base,next.state);
  assert.equal(saved.ok,true);assert.equal(saved.notice,'storage');assert.equal(saved.state.requests[0].id,next.id);
});
