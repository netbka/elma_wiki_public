import {useEffect,useRef,useState} from 'react';
import {addComment,createRequest,loadWorkspace,saveWorkspace,STORAGE_KEY} from './model.mjs';
import {findModulePlace} from './modules-data.mjs';

const browserStorage={getItem:key=>window.localStorage.getItem(key),setItem:(key,value)=>window.localStorage.setItem(key,value)};

export function useWorkspace() {
  const [loaded,setLoaded]=useState(()=>loadWorkspace(browserStorage));
  const current=useRef(loaded);current.current=loaded;
  useEffect(()=>{
    const update=e=>{if(e.key===STORAGE_KEY&&current.current.notice!=='storage'){const result=loadWorkspace(browserStorage);current.current=result;setLoaded(result);}};
    window.addEventListener('storage',update);return()=>window.removeEventListener('storage',update);
  },[]);
  function change(operation) {
    const previous=current.current;
    const result=operation(previous.state);
    if(!result.ok) return result;
    const saved=previous.notice==='storage'?{ok:true,state:result.state,notice:'storage'}:saveWorkspace(browserStorage,previous.state,result.state);
    const next={state:saved.state,notice:saved.error==='conflict'?'conflict':saved.notice||null};
    current.current=next;setLoaded(next);
    return saved.ok?{ok:true,id:result.id}:{ok:false,error:saved.error};
  }
  return {...loaded,create:values=>change(s=>createRequest(s,values,findModulePlace)),comment:(id,value)=>change(s=>addComment(s,id,value))};
}
