import { useState, useEffect, useRef } from 'react'

type Todo = { id: string; text: string; done: boolean }
type Record = { id: string; name: string; role: string }
type Msg = { id: string; text: string; ts: string }

function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(() => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(initial)) }
    catch { return initial }
  })
  const set = (v: T) => { localStorage.setItem(key, JSON.stringify(v)); setVal(v) }
  return [val, set]
}

export default function App() {
  const pkgs = ['@waelio/ustore','@waelio/utils','@waelio/data','@waelio/realdb','@waelio/messaging','@waelio/sync']

  // ustore
  const [count, setCount] = useLocalStorage('w-vr-count', 0)

  // utils
  const [sKey, setSKey] = useState('')
  const [sVal, setSVal] = useState('')
  const [sLog, setSLog] = useState('Ready.')

  // data
  const [todos, setTodos] = useLocalStorage<Todo[]>('w-vr-todos', [])
  const [tText, setTText] = useState('')
  const addTodo = () => {
    if (!tText.trim()) return
    setTodos([{ id: Date.now().toString(36), text: tText, done: false }, ...todos])
    setTText('')
  }

  // realdb
  const [records, setRecords] = useLocalStorage<Record[]>('w-vr-records', [])
  const [rName, setRName] = useState('')
  const [rRole, setRRole] = useState('')

  // messaging
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [mText, setMText] = useState('')
  const bc = useRef<BroadcastChannel | null>(null)
  useEffect(() => {
    bc.current = new BroadcastChannel('waelio-vr-demo')
    bc.current.onmessage = (e: MessageEvent) =>
      setMsgs(prev => [{ id: Date.now().toString(36), text: `📥 ${e.data}`, ts: new Date().toLocaleTimeString() }, ...prev])
    return () => bc.current?.close()
  }, [])

  // sync
  const [connected, setConnected] = useState(false)
  const [syncSt, setSyncSt] = useState('Click Connect.')
  const [syncLog, setSyncLog] = useState<string[]>([])
  const ts = () => new Date().toLocaleTimeString()

  return (
    <div>
      <header style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'1.25rem 2rem', display:'flex', alignItems:'center', gap:'1rem' }}>
        <div style={{ background:'var(--accent)', color:'#000', fontWeight:800, padding:'.25rem .6rem', borderRadius:'.375rem', fontSize:'.75rem' }}>W</div>
        <h1 style={{ fontSize:'1.125rem', fontWeight:600 }}>@waelio packages</h1>
        <span style={{ marginLeft:'auto', background:'rgba(97,218,251,.1)', color:'var(--accent)', border:'1px solid rgba(97,218,251,.3)', padding:'.25rem .75rem', borderRadius:'999px', fontSize:'.75rem' }}>⚛️ Vite + React 18</span>
      </header>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'2rem' }}>
        <div style={{ textAlign:'center', padding:'3rem 0 2rem', marginBottom:'2rem', background:'radial-gradient(ellipse at top, rgba(97,218,251,.08) 0%, transparent 60%)' }}>
          <h1 style={{ fontSize:'2rem', fontWeight:800, marginBottom:'.75rem' }}>React 18 + @waelio</h1>
          <p style={{ color:'var(--muted)', maxWidth:500, margin:'0 auto 1.5rem', lineHeight:1.6 }}>useState + custom hooks — same packages, React flavour.</p>
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', justifyContent:'center' }}>
            {pkgs.map(p => <span key={p} style={{ fontFamily:'var(--mono)', fontSize:'.6875rem', background:'rgba(97,218,251,.08)', border:'1px solid rgba(97,218,251,.25)', color:'var(--accent)', padding:'.25rem .625rem', borderRadius:'999px' }}>{p}</span>)}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
          {/* ustore */}
          <Card title="Reactive Store" icon="🗃️" pkg="@waelio/ustore">
            <div style={{ fontSize:'4rem', fontWeight:800, textAlign:'center', background:'linear-gradient(135deg,var(--accent) 0%,var(--accent2) 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1, padding:'.5rem 0' }}>{count}</div>
            <Output>count = {count}</Output>
            <BtnRow>
              <Btn variant="ghost" onClick={() => setCount(count - 1)}>− Dec</Btn>
              <Btn variant="primary" onClick={() => setCount(count + 1)}>+ Inc</Btn>
              <Btn variant="danger" onClick={() => setCount(0)}>↺ Reset</Btn>
            </BtnRow>
          </Card>

          {/* utils */}
          <Card title="Storage Utilities" icon="💾" pkg="@waelio/utils">
            <input value={sKey} onChange={e=>setSKey(e.target.value)} placeholder="key" style={{ marginBottom:'.5rem' }} />
            <input value={sVal} onChange={e=>setSVal(e.target.value)} placeholder="value" style={{ marginBottom:'.5rem' }} />
            <BtnRow>
              <Btn variant="primary" onClick={() => { localStorage.setItem(sKey, sVal); setSLog(`Set "${sKey}" ✓`) }}>Set localStorage</Btn>
              <Btn variant="danger" onClick={() => { localStorage.clear(); setSLog('Cleared.') }}>Clear</Btn>
            </BtnRow>
            <Output>{sLog}</Output>
          </Card>

          {/* data */}
          <Card title="Local Database" icon="🗄️" pkg="@waelio/data">
            <div style={{ display:'flex', gap:'.5rem' }}>
              <input value={tText} onChange={e=>setTText(e.target.value)} placeholder="New todo..." onKeyDown={e=>e.key==='Enter'&&addTodo()} />
              <Btn variant="primary" onClick={addTodo}>+</Btn>
            </div>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'.375rem', margin:'.75rem 0' }}>
              {todos.map(t => (
                <li key={t.id} style={{ display:'flex', alignItems:'center', gap:'.5rem', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'.5rem', padding:'.5rem .75rem' }}>
                  <input type="checkbox" checked={t.done} onChange={() => setTodos(todos.map(x => x.id===t.id ? {...x,done:!x.done} : x))} />
                  <span style={{ textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--muted)' : 'inherit' }}>{t.text}</span>
                  <button onClick={() => setTodos(todos.filter(x=>x.id!==t.id))} style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', marginLeft:'auto' }}>×</button>
                </li>
              ))}
            </ul>
            <Output>{todos.length} record(s) · {todos.filter(t=>t.done).length} done</Output>
          </Card>

          {/* realdb */}
          <Card title="RealDB Collection" icon="⚡" pkg="@waelio/realdb">
            <div style={{ display:'flex', gap:'.5rem' }}>
              <input value={rName} onChange={e=>setRName(e.target.value)} placeholder="Name" />
              <input value={rRole} onChange={e=>setRRole(e.target.value)} placeholder="Role" style={{ width:'7rem' }} />
              <Btn variant="primary" onClick={() => { if(!rName.trim())return; setRecords([...records,{id:Date.now().toString(36),name:rName,role:rRole||'user'}]); setRName('');setRRole('') }}>+</Btn>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.375rem', marginTop:'.5rem' }}>
              {records.map(r => (
                <div key={r.id} style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'.5rem', padding:'.625rem .75rem', fontSize:'.8125rem', display:'flex', alignItems:'center', gap:'.5rem' }}>
                  <div><div>{r.name}</div><div style={{ color:'var(--muted)', fontFamily:'var(--mono)', fontSize:'.6875rem' }}>{r.id} · {r.role}</div></div>
                  <button onClick={() => setRecords(records.filter(x=>x.id!==r.id))} style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', marginLeft:'auto' }}>×</button>
                </div>
              ))}
            </div>
            <Output>{records.length} record(s)</Output>
          </Card>

          {/* messaging */}
          <Card title="Pub/Sub Messaging" icon="📡" pkg="@waelio/messaging">
            <div style={{ display:'flex', gap:'.5rem', margin:'.5rem 0' }}>
              <input value={mText} onChange={e=>setMText(e.target.value)} placeholder="Publish..." onKeyDown={e=>{ if(e.key==='Enter'&&mText.trim()){ bc.current?.postMessage(mText); setMsgs(prev=>[{id:Date.now().toString(36),text:`📤 ${mText}`,ts:new Date().toLocaleTimeString()},...prev]); setMText('') }}} />
              <Btn variant="primary" onClick={() => { if(!mText.trim())return; bc.current?.postMessage(mText); setMsgs(prev=>[{id:Date.now().toString(36),text:`📤 ${mText}`,ts:new Date().toLocaleTimeString()},...prev]); setMText('') }}>Send</Btn>
            </div>
            <div style={{ maxHeight:'8rem', overflowY:'auto', display:'flex', flexDirection:'column', gap:'.25rem' }}>
              {msgs.map(m => <div key={m.id} style={{ background:'var(--surface2)', borderLeft:'2px solid var(--accent2)', padding:'.375rem .625rem', borderRadius:'0 .375rem .375rem 0', fontSize:'.8125rem' }}>{m.text} <span style={{ color:'var(--muted)', fontSize:'.6875rem', float:'right' }}>{m.ts}</span></div>)}
            </div>
          </Card>

          {/* sync */}
          <Card title="Edge Sync SDK" icon="🔄" pkg="@waelio/sync">
            <Output>{syncSt}</Output>
            <BtnRow>
              <Btn variant="primary" onClick={() => { setConnected(true); setSyncSt('● Connected'); setSyncLog(p=>[`[${ts()}] Connected`,...p]) }}>Connect</Btn>
              <Btn variant="ghost" onClick={() => connected && setSyncLog(p=>[`[${ts()}] ↑ PUSH`,...p])}>Push</Btn>
              <Btn variant="ghost" onClick={() => connected && setSyncLog(p=>[`[${ts()}] ↓ PULL`,...p])}>Pull</Btn>
              <Btn variant="danger" onClick={() => { setConnected(false); setSyncSt('Disconnected.'); setSyncLog(p=>[`[${ts()}] Disconnected`,...p]) }}>Disconnect</Btn>
            </BtnRow>
            <Output>{syncLog.map((l,i)=><div key={i}>{l}</div>)}</Output>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Mini components
function Card({ title, icon, pkg, children }: { title:string;icon:string;pkg:string;children:React.ReactNode }) {
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'1rem', padding:'1.5rem' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1.25rem' }}>
        <span style={{ fontSize:'1.5rem' }}>{icon}</span>
        <div>
          <h2 style={{ fontSize:'1rem', fontWeight:600 }}>{title}</h2>
          <span style={{ fontFamily:'var(--mono)', fontSize:'.6875rem', background:'var(--surface2)', border:'1px solid var(--border)', padding:'.125rem .5rem', borderRadius:'.25rem', color:'var(--muted)' }}>{pkg}</span>
        </div>
      </div>
      {children}
    </div>
  )
}

function Output({ children }: { children: React.ReactNode }) {
  return <div style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'.625rem', padding:'1rem', minHeight:'2.5rem', fontFamily:'var(--mono)', fontSize:'.8125rem', color:'var(--green)', margin:'.75rem 0' }}>{children}</div>
}

function BtnRow({ children }: { children: React.ReactNode }) {
  return <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>{children}</div>
}

const btnStyles = {
  primary: { background:'var(--accent2)', color:'#fff', border:'none' },
  ghost: { background:'var(--surface2)', color:'var(--text)', border:'1px solid var(--border)' },
  danger: { background:'rgba(239,68,68,.15)', color:'var(--red)', border:'1px solid rgba(239,68,68,.3)' },
}

function Btn({ variant, onClick, children }: { variant: keyof typeof btnStyles; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} style={{ ...btnStyles[variant], padding:'.5rem 1rem', borderRadius:'.5rem', cursor:'pointer', fontFamily:'var(--font)', fontSize:'.8125rem', fontWeight:500 }}>{children}</button>
}
