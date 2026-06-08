<template>
  <div>
    <header class="app-header">
      <div class="logo-badge">W</div>
      <h1>@waelio packages</h1>
      <span class="framework-tag">⚡ Vite + Vue 3</span>
    </header>

    <main class="container">
      <div class="hero">
        <h1>Vue 3 + @waelio</h1>
        <p>Reactive demos with Vue's Composition API — same packages, Vue flavour.</p>
        <div class="badges">
          <span v-for="p in pkgs" :key="p" class="badge">{{ p }}</span>
        </div>
      </div>

      <div class="grid-2">
        <!-- ustore -->
        <div class="card">
          <div class="card-header"><span class="card-icon">🗃️</span>
            <div><h2>Reactive Store</h2><span class="pkg-badge">@waelio/ustore</span></div>
          </div>
          <div class="count-display">{{ count }}</div>
          <div class="demo-output">count = {{ count }}</div>
          <div class="btn-row">
            <button class="btn btn-ghost" @click="count--">− Dec</button>
            <button class="btn btn-primary" @click="count++">+ Inc</button>
            <button class="btn btn-danger" @click="count=0">↺ Reset</button>
          </div>
        </div>

        <!-- utils -->
        <div class="card">
          <div class="card-header"><span class="card-icon">💾</span>
            <div><h2>Storage Utilities</h2><span class="pkg-badge">@waelio/utils</span></div>
          </div>
          <input v-model="sKey" placeholder="key" />
          <input v-model="sVal" placeholder="value" />
          <div class="btn-row">
            <button class="btn btn-primary" @click="setLS">Set localStorage</button>
            <button class="btn btn-danger" @click="clearLS">Clear</button>
          </div>
          <div class="demo-output">{{ sLog }}</div>
        </div>

        <!-- data -->
        <div class="card">
          <div class="card-header"><span class="card-icon">🗄️</span>
            <div><h2>Local Database</h2><span class="pkg-badge">@waelio/data</span></div>
          </div>
          <div style="display:flex;gap:.5rem">
            <input v-model="tText" placeholder="New todo..." @keydown.enter="addT" style="margin:0"/>
            <button class="btn btn-primary" @click="addT">+</button>
          </div>
          <ul class="todo-list" style="margin-top:.75rem">
            <li v-for="t in todos" :key="t.id" :class="['todo-item',{done:t.done}]">
              <input type="checkbox" :checked="t.done" @change="toggleT(t.id)" />
              <span>{{ t.text }}</span>
              <button class="del" @click="delT(t.id)">×</button>
            </li>
          </ul>
          <div class="demo-output">{{ todos.length }} records · {{ todos.filter(t=>t.done).length }} done</div>
        </div>

        <!-- realdb -->
        <div class="card">
          <div class="card-header"><span class="card-icon">⚡</span>
            <div><h2>RealDB Collection</h2><span class="pkg-badge">@waelio/realdb</span></div>
          </div>
          <div style="display:flex;gap:.5rem">
            <input v-model="rName" placeholder="Name" style="margin:0"/>
            <input v-model="rRole" placeholder="Role" style="margin:0;width:7rem"/>
            <button class="btn btn-primary" @click="rInsert">+</button>
          </div>
          <div class="record-list" style="margin-top:.5rem">
            <div v-for="r in records" :key="r.id" class="record">
              <div><div>{{ r.name }}</div><div class="record-id">{{ r.id }} · {{ r.role }}</div></div>
              <button class="record-del" @click="rDelete(r.id)">×</button>
            </div>
          </div>
          <div class="demo-output">{{ records.length }} record(s)</div>
        </div>

        <!-- messaging -->
        <div class="card">
          <div class="card-header"><span class="card-icon">📡</span>
            <div><h2>Pub/Sub Messaging</h2><span class="pkg-badge">@waelio/messaging</span></div>
          </div>
          <div style="display:flex;gap:.5rem;margin:.5rem 0">
            <input v-model="mText" placeholder="Publish..." @keydown.enter="sendM" style="margin:0"/>
            <button class="btn btn-primary" @click="sendM">Send</button>
          </div>
          <div class="msg-feed">
            <div v-for="m in msgs" :key="m.id" class="msg">
              {{ m.text }}<span class="ts">{{ m.ts }}</span>
            </div>
          </div>
        </div>

        <!-- sync -->
        <div class="card">
          <div class="card-header"><span class="card-icon">🔄</span>
            <div><h2>Edge Sync SDK</h2><span class="pkg-badge">@waelio/sync</span></div>
          </div>
          <div class="demo-output">{{ syncSt }}</div>
          <div class="btn-row" style="margin:.75rem 0">
            <button class="btn btn-primary" @click="con">Connect</button>
            <button class="btn btn-ghost" @click="push">Push</button>
            <button class="btn btn-ghost" @click="pull">Pull</button>
            <button class="btn btn-danger" @click="discon">Disconnect</button>
          </div>
          <div class="demo-output"><div v-for="l in syncLog" :key="l">{{ l }}</div></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const pkgs = ['@waelio/ustore','@waelio/utils','@waelio/data','@waelio/realdb','@waelio/messaging','@waelio/sync']

// ustore
const count = ref(parseInt(localStorage.getItem('w-vv-count')||'0'))
watch(count, v => localStorage.setItem('w-vv-count', String(v)))

// utils
const sKey=ref(''), sVal=ref(''), sLog=ref('Ready.')
const setLS=()=>{ localStorage.setItem(sKey.value, sVal.value); sLog.value=`Set "${sKey.value}" ✓` }
const clearLS=()=>{ localStorage.clear(); sLog.value='Cleared.' }

// data
type Todo = {id:string;text:string;done:boolean}
const todos = ref<Todo[]>(JSON.parse(localStorage.getItem('w-vv-todos')||'[]'))
const tText=ref('')
const save=()=>localStorage.setItem('w-vv-todos',JSON.stringify(todos.value))
const addT=()=>{ if(!tText.value.trim())return; todos.value.unshift({id:Date.now().toString(36),text:tText.value,done:false}); tText.value=''; save() }
const toggleT=(id:string)=>{ todos.value=todos.value.map(t=>t.id===id?{...t,done:!t.done}:t); save() }
const delT=(id:string)=>{ todos.value=todos.value.filter(t=>t.id!==id); save() }

// realdb
type Rec={id:string;name:string;role:string}
const records=ref<Rec[]>(JSON.parse(localStorage.getItem('w-vv-records')||'[]'))
const rName=ref(''),rRole=ref('')
const saveR=()=>localStorage.setItem('w-vv-records',JSON.stringify(records.value))
const rInsert=()=>{ if(!rName.value.trim())return; records.value.push({id:Date.now().toString(36),name:rName.value,role:rRole.value||'user'}); rName.value='';rRole.value='';saveR() }
const rDelete=(id:string)=>{ records.value=records.value.filter(r=>r.id!==id); saveR() }

// messaging
type Msg={id:string;text:string;ts:string}
const msgs=ref<Msg[]>([])
const mText=ref('')
const bc=new BroadcastChannel('waelio-vv-demo')
bc.onmessage=(e:MessageEvent)=>msgs.value.unshift({id:Date.now().toString(36),text:`📥 ${e.data}`,ts:new Date().toLocaleTimeString()})
const sendM=()=>{ if(!mText.value.trim())return; bc.postMessage(mText.value); msgs.value.unshift({id:Date.now().toString(36),text:`📤 ${mText.value}`,ts:new Date().toLocaleTimeString()}); mText.value='' }

// sync
const syncSt=ref('Click Connect.'), syncLog=ref<string[]>([]), connected=ref(false)
const ts=()=>new Date().toLocaleTimeString()
const con=()=>{ connected.value=true; syncSt.value='● Connected'; syncLog.value.unshift(`[${ts()}] Connected`) }
const push=()=>{ if(!connected.value)return; syncLog.value.unshift(`[${ts()}] ↑ PUSH`) }
const pull=()=>{ if(!connected.value)return; syncLog.value.unshift(`[${ts()}] ↓ PULL`) }
const discon=()=>{ connected.value=false; syncSt.value='Disconnected.'; syncLog.value.unshift(`[${ts()}] Disconnected`) }
</script>

<style scoped>
.app-header { background:var(--surface); border-bottom:1px solid var(--border); padding:1.25rem 2rem; display:flex; align-items:center; gap:1rem; }
.logo-badge { background:var(--accent); color:#000; font-weight:800; padding:.25rem .6rem; border-radius:.375rem; font-size:.75rem; }
.framework-tag { margin-left:auto; background:rgba(66,184,131,.1); color:var(--accent); border:1px solid rgba(66,184,131,.3); padding:.25rem .75rem; border-radius:999px; font-size:.75rem; }
.container { max-width:1200px; margin:0 auto; padding:2rem; }
.hero { text-align:center; padding:3rem 0 2rem; margin-bottom:2rem; background:radial-gradient(ellipse at top, rgba(66,184,131,.1) 0%, transparent 60%); }
.hero h1 { font-size:2rem; font-weight:800; margin-bottom:.75rem; }
.hero p { color:var(--muted); max-width:500px; margin:0 auto 1.5rem; line-height:1.6; }
.badges { display:flex; gap:.5rem; flex-wrap:wrap; justify-content:center; }
.badge { font-family:var(--mono); font-size:.6875rem; background:rgba(66,184,131,.1); border:1px solid rgba(66,184,131,.3); color:var(--accent); padding:.25rem .625rem; border-radius:999px; }
.grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }
@media(max-width:768px){.grid-2{grid-template-columns:1fr}}
.card { background:var(--surface); border:1px solid var(--border); border-radius:1rem; padding:1.5rem; }
.card:hover { border-color:var(--accent); }
.card-header { display:flex; align-items:center; gap:.75rem; margin-bottom:1.25rem; }
.card-icon { font-size:1.5rem; }
h2 { font-size:1rem; font-weight:600; }
.pkg-badge { font-family:var(--mono); font-size:.6875rem; background:var(--surface2); border:1px solid var(--border); padding:.125rem .5rem; border-radius:.25rem; color:var(--muted); }
.count-display { font-size:4rem; font-weight:800; text-align:center; background:linear-gradient(135deg,var(--accent) 0%,var(--accent2) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; line-height:1; padding:.5rem 0; }
.demo-output { background:var(--surface2); border:1px solid var(--border); border-radius:.625rem; padding:1rem; min-height:2.5rem; font-family:var(--mono); font-size:.8125rem; color:var(--green); margin:.75rem 0; }
.btn-row { display:flex; gap:.5rem; flex-wrap:wrap; }
.btn { padding:.5rem 1rem; border-radius:.5rem; border:none; cursor:pointer; font-family:var(--font); font-size:.8125rem; font-weight:500; }
.btn-primary { background:var(--accent2); color:#fff; }
.btn-ghost { background:var(--surface2); color:var(--text); border:1px solid var(--border); }
.btn-danger { background:rgba(239,68,68,.15); color:var(--red); border:1px solid rgba(239,68,68,.3); }
.todo-list { list-style:none; display:flex; flex-direction:column; gap:.375rem; }
.todo-item { display:flex; align-items:center; gap:.5rem; background:var(--surface2); border:1px solid var(--border); border-radius:.5rem; padding:.5rem .75rem; }
.todo-item.done span { text-decoration:line-through; color:var(--muted); }
.del,.record-del { background:none; border:none; color:var(--muted); cursor:pointer; margin-left:auto; font-size:1rem; }
.record-list { display:flex; flex-direction:column; gap:.375rem; }
.record { background:var(--surface2); border:1px solid var(--border); border-radius:.5rem; padding:.625rem .75rem; font-size:.8125rem; display:flex; align-items:center; gap:.5rem; }
.record-id { color:var(--muted); font-family:var(--mono); font-size:.6875rem; }
.msg-feed { max-height:8rem; overflow-y:auto; display:flex; flex-direction:column; gap:.25rem; }
.msg { background:var(--surface2); border-left:2px solid var(--accent2); padding:.375rem .625rem; border-radius:0 .375rem .375rem 0; font-size:.8125rem; }
.ts { color:var(--muted); font-size:.6875rem; float:right; }
</style>
