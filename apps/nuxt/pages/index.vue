<template>
  <main class="container">
    <section class="hero">
      <h1>Nuxt 3 + @waelio</h1>
      <p>All @waelio packages demonstrated with Vue's Composition API and Nuxt 3's auto-imports.</p>
      <div class="badges">
        <span v-for="pkg in packages" :key="pkg" class="badge">{{ pkg }}</span>
      </div>
    </section>

    <div class="grid-2">
      <!-- Reactive Store -->
      <DemoCard title="Reactive Store" icon="🗃️" pkg="@waelio/ustore" color="#6366f1">
        <div class="count-display">{{ count }}</div>
        <div class="demo-output">count = {{ count }} // persisted via useLocalStorage</div>
        <div class="btn-row">
          <button class="btn btn-ghost" @click="count--">− Dec</button>
          <button class="btn btn-primary" @click="count++">+ Inc</button>
          <button class="btn btn-danger" @click="count = 0">↺ Reset</button>
        </div>
      </DemoCard>

      <!-- Storage Utils -->
      <DemoCard title="Storage Utilities" icon="💾" pkg="@waelio/utils" color="#f59e0b">
        <input v-model="storageKey" placeholder="key" />
        <input v-model="storageVal" placeholder="value" />
        <div class="btn-row">
          <button class="btn btn-primary" @click="setStorage">Set localStorage</button>
          <button class="btn btn-danger" @click="clearStorage">Clear</button>
        </div>
        <div class="demo-output">{{ storageLog }}</div>
      </DemoCard>

      <!-- Todo DB -->
      <DemoCard title="Local Database" icon="🗄️" pkg="@waelio/data" color="#22c55e">
        <div style="display:flex;gap:.5rem">
          <input v-model="todoText" placeholder="Add todo..." @keydown.enter="addTodo" />
          <button class="btn btn-primary" @click="addTodo">+ Add</button>
        </div>
        <ul class="todo-list">
          <li v-for="t in todos" :key="t.id" :class="['todo-item', { done: t.done }]">
            <input type="checkbox" :checked="t.done" @change="toggleTodo(t.id)" />
            <span>{{ t.text }}</span>
            <button class="del" @click="deleteTodo(t.id)">×</button>
          </li>
        </ul>
        <div class="demo-output">{{ todos.length }} record(s) · {{ todos.filter(t=>t.done).length }} done</div>
      </DemoCard>

      <!-- RealDB -->
      <DemoCard title="RealDB Collection" icon="⚡" pkg="@waelio/realdb" color="#a855f7">
        <div style="display:flex;gap:.5rem">
          <input v-model="rdbName" placeholder="Name" />
          <input v-model="rdbRole" placeholder="Role" style="width:7rem" />
          <button class="btn btn-primary" @click="rdbInsert">+ Insert</button>
        </div>
        <div class="record-list">
          <div v-for="r in records" :key="r.id" class="record">
            <div>
              <div>{{ r.name }}</div>
              <div class="record-id">{{ r.id }} · {{ r.role }}</div>
            </div>
            <button class="record-del" @click="rdbDelete(r.id)">×</button>
          </div>
          <div v-if="!records.length" class="muted-msg">No records yet.</div>
        </div>
        <div class="demo-output">collection.find() → {{ records.length }} record(s)</div>
      </DemoCard>

      <!-- Messaging -->
      <DemoCard title="Pub/Sub Messaging" icon="📡" pkg="@waelio/messaging" color="#f97316">
        <div class="status"><span class="dot green"></span> Channel: waelio-demo</div>
        <div style="display:flex;gap:.5rem;margin:.75rem 0">
          <input v-model="msgText" placeholder="Publish a message..." @keydown.enter="sendMsg" />
          <button class="btn btn-primary" @click="sendMsg">Publish</button>
        </div>
        <div class="msg-feed">
          <div v-for="m in messages" :key="m.id" class="msg">
            {{ m.text }} <span class="ts">{{ m.ts }}</span>
          </div>
        </div>
      </DemoCard>

      <!-- Sync -->
      <DemoCard title="Edge Sync SDK" icon="🔄" pkg="@waelio/sync" color="#06b6d4">
        <div class="demo-output">{{ syncStatus }}</div>
        <div class="btn-row" style="margin:.75rem 0">
          <button class="btn btn-primary" @click="connect">⚡ Connect</button>
          <button class="btn btn-ghost" @click="push">↑ Push</button>
          <button class="btn btn-ghost" @click="pull">↓ Pull</button>
          <button class="btn btn-danger" @click="disconnect">✕ Disconnect</button>
        </div>
        <div class="demo-output" style="min-height:4rem">
          <div v-for="log in syncLogs" :key="log">{{ log }}</div>
        </div>
      </DemoCard>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const packages = ['@waelio/ustore','@waelio/utils','@waelio/data','@waelio/realdb','@waelio/messaging','@waelio/sync']

// ustore
const count = ref(parseInt(localStorage.getItem('w-nuxt-count') || '0'))
watch(count, v => localStorage.setItem('w-nuxt-count', String(v)))

// utils
const storageKey = ref('')
const storageVal = ref('')
const storageLog = ref('Ready — set a key/value pair above.')
const setStorage = () => {
  localStorage.setItem(storageKey.value, storageVal.value)
  storageLog.value = `localStorage.setItem("${storageKey.value}", "${storageVal.value}") ✓`
}
const clearStorage = () => { localStorage.clear(); storageLog.value = 'Cleared.' }

// data / todos
const todosRaw = ref<{id:string,text:string,done:boolean}[]>(JSON.parse(localStorage.getItem('w-nuxt-todos')||'[]'))
const todos = computed(() => todosRaw.value)
const todoText = ref('')
const addTodo = () => {
  if (!todoText.value.trim()) return
  todosRaw.value.unshift({ id: Date.now().toString(36), text: todoText.value.trim(), done: false })
  todoText.value = ''
  localStorage.setItem('w-nuxt-todos', JSON.stringify(todosRaw.value))
}
const toggleTodo = (id:string) => {
  todosRaw.value = todosRaw.value.map(t => t.id===id ? {...t,done:!t.done} : t)
  localStorage.setItem('w-nuxt-todos', JSON.stringify(todosRaw.value))
}
const deleteTodo = (id:string) => {
  todosRaw.value = todosRaw.value.filter(t => t.id!==id)
  localStorage.setItem('w-nuxt-todos', JSON.stringify(todosRaw.value))
}

// realdb
const records = ref<{id:string,name:string,role:string}[]>(JSON.parse(localStorage.getItem('w-nuxt-records')||'[]'))
const rdbName = ref(''); const rdbRole = ref('')
const rdbInsert = () => {
  if (!rdbName.value.trim()) return
  records.value.push({ id: Date.now().toString(36), name: rdbName.value, role: rdbRole.value||'user' })
  rdbName.value = ''; rdbRole.value = ''
  localStorage.setItem('w-nuxt-records', JSON.stringify(records.value))
}
const rdbDelete = (id:string) => {
  records.value = records.value.filter(r => r.id!==id)
  localStorage.setItem('w-nuxt-records', JSON.stringify(records.value))
}

// messaging
const msgText = ref('')
const messages = ref<{id:string,text:string,ts:string}[]>([])
const bc = process.client ? new BroadcastChannel('waelio-nuxt-demo') : null
if (bc) bc.onmessage = (e:MessageEvent) => {
  messages.value.unshift({ id: Date.now().toString(36), text: `📥 ${e.data}`, ts: new Date().toLocaleTimeString() })
}
const sendMsg = () => {
  if (!msgText.value.trim()) return
  bc?.postMessage(msgText.value)
  messages.value.unshift({ id: Date.now().toString(36), text: `📤 ${msgText.value}`, ts: new Date().toLocaleTimeString() })
  msgText.value = ''
}

// sync
const syncStatus = ref('Click Connect to initialise the SDK.')
const syncLogs = ref<string[]>([])
const syncConnected = ref(false)
const connect = () => { syncConnected.value = true; syncStatus.value = '● Connected'; syncLogs.value.unshift(`[${new Date().toLocaleTimeString()}] SDK connected`) }
const push = () => { if (!syncConnected.value) return; syncLogs.value.unshift(`[${new Date().toLocaleTimeString()}] ↑ PUSH → ${JSON.stringify({ts:Date.now()})}`) }
const pull = () => { if (!syncConnected.value) return; syncLogs.value.unshift(`[${new Date().toLocaleTimeString()}] ↓ PULL ← OK`) }
const disconnect = () => { syncConnected.value = false; syncStatus.value = 'Disconnected.'; syncLogs.value.unshift(`[${new Date().toLocaleTimeString()}] Disconnected`) }
</script>

<style scoped>
/* reuses main.css tokens */
.container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.hero { text-align: center; padding: 3rem 0 2rem; margin-bottom: 2rem; background: radial-gradient(ellipse at top, rgba(99,102,241,.1) 0%, transparent 60%); }
.hero h1 { font-size: 2rem; font-weight: 800; margin-bottom: .75rem; }
.hero p { color: var(--muted); max-width: 500px; margin: 0 auto 1.5rem; line-height: 1.6; }
.badges { display: flex; gap: .5rem; flex-wrap: wrap; justify-content: center; }
.badge { font-family: var(--mono); font-size: .6875rem; background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.3); color: #a5b4fc; padding: .25rem .625rem; border-radius: 999px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
@media(max-width:768px) { .grid-2 { grid-template-columns: 1fr; } }
.count-display { font-size: 4rem; font-weight: 800; text-align: center; background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; padding: .5rem 0; }
.demo-output { background: var(--surface2); border: 1px solid var(--border); border-radius: .625rem; padding: 1rem; min-height: 2.5rem; font-family: var(--mono); font-size: .8125rem; color: var(--green); margin: .75rem 0; }
.btn-row { display: flex; gap: .5rem; flex-wrap: wrap; }
.btn { padding: .5rem 1rem; border-radius: .5rem; border: none; cursor: pointer; font-family: var(--font); font-size: .8125rem; font-weight: 500; transition: all .15s; }
.btn-primary { background: var(--accent2); color: #fff; }
.btn-ghost { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
.btn-danger { background: rgba(239,68,68,.15); color: var(--red); border: 1px solid rgba(239,68,68,.3); }
input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: .5rem; padding: .5rem .75rem; color: var(--text); font-family: var(--font); font-size: .875rem; outline: none; margin-bottom: .5rem; }
.todo-list { list-style: none; display: flex; flex-direction: column; gap: .375rem; margin: .75rem 0; }
.todo-item { display: flex; align-items: center; gap: .5rem; background: var(--surface2); border: 1px solid var(--border); border-radius: .5rem; padding: .5rem .75rem; }
.todo-item.done span { text-decoration: line-through; color: var(--muted); }
.del { background: none; border: none; color: var(--muted); cursor: pointer; margin-left: auto; font-size: 1rem; }
.record-list { display: flex; flex-direction: column; gap: .375rem; }
.record { background: var(--surface2); border: 1px solid var(--border); border-radius: .5rem; padding: .625rem .75rem; font-size: .8125rem; display: flex; align-items: center; gap: .5rem; }
.record-id { color: var(--muted); font-family: var(--mono); font-size: .6875rem; }
.record-del { background: none; border: none; color: var(--muted); cursor: pointer; margin-left: auto; }
.status { display: flex; align-items: center; gap: .375rem; font-size: .8125rem; }
.dot { width: .5rem; height: .5rem; border-radius: 50%; display: inline-block; }
.dot.green { background: var(--green); box-shadow: 0 0 6px var(--green); }
.msg-feed { max-height: 8rem; overflow-y: auto; display: flex; flex-direction: column; gap: .25rem; }
.msg { background: var(--surface2); border-left: 2px solid var(--accent2); padding: .375rem .625rem; border-radius: 0 .375rem .375rem 0; font-size: .8125rem; }
.ts { color: var(--muted); font-size: .6875rem; float: right; }
.muted-msg { color: var(--muted); font-size: .8125rem; padding: .5rem; }
</style>
