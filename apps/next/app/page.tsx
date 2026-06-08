'use client'
// Next.js 14 App Router — Client Component demo
// All @waelio client-side packages work here

import { useState, useEffect, useRef } from 'react'

type Todo = { id: string; text: string; done: boolean }
type Rec  = { id: string; name: string; role: string }
type Msg  = { id: string; text: string; ts: string }

function useLS<T>(key: string, init: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(init)
  useEffect(() => {
    try { setV(JSON.parse(localStorage.getItem(key) || JSON.stringify(init))) } catch {}
  }, [])
  const set = (val: T) => { localStorage.setItem(key, JSON.stringify(val)); setV(val) }
  return [v, set]
}

export default function Home() {
  const [count, setCount] = useLS('w-nx-count', 0)
  const [sKey, setSKey] = useState(''); const [sVal, setSVal] = useState(''); const [sLog, setSLog] = useState('Ready.')
  const [todos, setTodos] = useLS<Todo[]>('w-nx-todos', [])
  const [tText, setTText] = useState('')
  const [records, setRecords] = useLS<Rec[]>('w-nx-records', [])
  const [rName, setRName] = useState(''); const [rRole, setRRole] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [mText, setMText] = useState('')
  const bc = useRef<BroadcastChannel | null>(null)
  const [syncSt, setSyncSt] = useState('Click Connect.'); const [syncLog, setSyncLog] = useState<string[]>([]); const [connected, setConnected] = useState(false)
  const ts = () => new Date().toLocaleTimeString()

  useEffect(() => {
    bc.current = new BroadcastChannel('waelio-nx-demo')
    bc.current.onmessage = (e: MessageEvent) =>
      setMsgs(p => [{ id: Date.now().toString(36), text: `📥 ${e.data}`, ts: new Date().toLocaleTimeString() }, ...p])
    return () => bc.current?.close()
  }, [])

  const s: Record<string, React.CSSProperties> = {
    grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', maxWidth:1200, margin:'0 auto', padding:'2rem' },
    card: { background:'#12121a', border:'1px solid #2a2a3d', borderRadius:'1rem', padding:'1.5rem' },
    out: { background:'#1a1a26', border:'1px solid #2a2a3d', borderRadius:'.625rem', padding:'1rem', minHeight:'2.5rem', fontFamily:"'JetBrains Mono',monospace", fontSize:'.8125rem', color:'#22c55e', margin:'.75rem 0' },
    input: { width:'100%', background:'#1a1a26', border:'1px solid #2a2a3d', borderRadius:'.5rem', padding:'.5rem .75rem', color:'#e2e8f0', fontFamily:"'Inter',sans-serif", fontSize:'.875rem', outline:'none', marginBottom:'.5rem' },
  }

  return (
    <div>
      <div style={{ textAlign:'center', padding:'3rem 2rem 2rem', background:'radial-gradient(ellipse at top, rgba(0,0,0,.3) 0%, transparent 60%)' }}>
        <h1 style={{ fontSize:'2rem', fontWeight:800, marginBottom:'.75rem' }}>Next.js 14 + @waelio</h1>
        <p style={{ color:'#64748b', maxWidth:500, margin:'0 auto', lineHeight:1.6 }}>App Router, Client Components — same packages, Next flavour.</p>
      </div>
      <div style={s.grid}>
        {/* ustore */}
        <div style={s.card}>
          <h2 style={hdr}>🗃️ Reactive Store <pkg>@waelio/ustore</pkg></h2>
          <div style={{ fontSize:'4rem', fontWeight:800, textAlign:'center', background:'linear-gradient(135deg,#000 0%,#6366f1 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', padding:'.5rem 0' }}>{count}</div>
          <div style={s.out}>count = {count}</div>
          <Row><B o={()=>setCount(count-1)} v="ghost">− Dec</B><B o={()=>setCount(count+1)} v="primary">+ Inc</B><B o={()=>setCount(0)} v="danger">↺ Reset</B></Row>
        </div>
        {/* utils */}
        <div style={s.card}>
          <h2 style={hdr}>💾 Storage Utils <pkg>@waelio/utils</pkg></h2>
          <input style={s.input} value={sKey} onChange={e=>setSKey(e.target.value)} placeholder="key" />
          <input style={s.input} value={sVal} onChange={e=>setSVal(e.target.value)} placeholder="value" />
          <Row><B o={()=>{localStorage.setItem(sKey,sVal);setSLog(`Set "${sKey}" ✓`)}} v="primary">Set localStorage</B><B o={()=>{localStorage.clear();setSLog('Cleared.')}} v="danger">Clear</B></Row>
          <div style={s.out}>{sLog}</div>
        </div>
        {/* data */}
        <div style={s.card}>
          <h2 style={hdr}>🗄️ Local Database <pkg>@waelio/data</pkg></h2>
          <div style={{display:'flex',gap:'.5rem'}}>
            <input style={{...s.input,marginBottom:0}} value={tText} onChange={e=>setTText(e.target.value)} placeholder="New todo..." onKeyDown={e=>e.key==='Enter'&&tText.trim()&&(setTodos([{id:Date.now().toString(36),text:tText,done:false},...todos]),setTText(''))} />
            <B o={()=>tText.trim()&&(setTodos([{id:Date.now().toString(36),text:tText,done:false},...todos]),setTText(''))} v="primary">+</B>
          </div>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.375rem',margin:'.75rem 0'}}>
            {todos.map(t=><li key={t.id} style={{display:'flex',alignItems:'center',gap:'.5rem',background:'#1a1a26',border:'1px solid #2a2a3d',borderRadius:'.5rem',padding:'.5rem .75rem'}}>
              <input type="checkbox" checked={t.done} onChange={()=>setTodos(todos.map(x=>x.id===t.id?{...x,done:!x.done}:x))} />
              <span style={{textDecoration:t.done?'line-through':'none',color:t.done?'#64748b':'inherit'}}>{t.text}</span>
              <button onClick={()=>setTodos(todos.filter(x=>x.id!==t.id))} style={{background:'none',border:'none',color:'#64748b',cursor:'pointer',marginLeft:'auto'}}>×</button>
            </li>)}
          </ul>
          <div style={s.out}>{todos.length} record(s) · {todos.filter(t=>t.done).length} done</div>
        </div>
        {/* realdb */}
        <div style={s.card}>
          <h2 style={hdr}>⚡ RealDB Collection <pkg>@waelio/realdb</pkg></h2>
          <div style={{display:'flex',gap:'.5rem'}}>
            <input style={{...s.input,marginBottom:0}} value={rName} onChange={e=>setRName(e.target.value)} placeholder="Name" />
            <input style={{...s.input,marginBottom:0,width:'7rem'}} value={rRole} onChange={e=>setRRole(e.target.value)} placeholder="Role" />
            <B o={()=>{if(!rName.trim())return;setRecords([...records,{id:Date.now().toString(36),name:rName,role:rRole||'user'}]);setRName('');setRRole('')}} v="primary">+</B>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'.375rem',marginTop:'.5rem'}}>
            {records.map(r=><div key={r.id} style={{background:'#1a1a26',border:'1px solid #2a2a3d',borderRadius:'.5rem',padding:'.625rem .75rem',fontSize:'.8125rem',display:'flex',alignItems:'center',gap:'.5rem'}}>
              <div><div>{r.name}</div><div style={{color:'#64748b',fontFamily:"'JetBrains Mono',monospace",fontSize:'.6875rem'}}>{r.id} · {r.role}</div></div>
              <button onClick={()=>setRecords(records.filter(x=>x.id!==r.id))} style={{background:'none',border:'none',color:'#64748b',cursor:'pointer',marginLeft:'auto'}}>×</button>
            </div>)}
          </div>
          <div style={s.out}>{records.length} record(s)</div>
        </div>
        {/* messaging */}
        <div style={s.card}>
          <h2 style={hdr}>📡 Pub/Sub Messaging <pkg>@waelio/messaging</pkg></h2>
          <div style={{display:'flex',gap:'.5rem',margin:'.5rem 0'}}>
            <input style={{...s.input,marginBottom:0}} value={mText} onChange={e=>setMText(e.target.value)} placeholder="Publish..." onKeyDown={e=>{if(e.key==='Enter'&&mText.trim()){bc.current?.postMessage(mText);setMsgs(p=>[{id:Date.now().toString(36),text:`📤 ${mText}`,ts:ts()},...p]);setMText('')}}} />
            <B o={()=>{if(!mText.trim())return;bc.current?.postMessage(mText);setMsgs(p=>[{id:Date.now().toString(36),text:`📤 ${mText}`,ts:ts()},...p]);setMText('')}} v="primary">Send</B>
          </div>
          <div style={{maxHeight:'8rem',overflowY:'auto',display:'flex',flexDirection:'column',gap:'.25rem'}}>
            {msgs.map(m=><div key={m.id} style={{background:'#1a1a26',borderLeft:'2px solid #6366f1',padding:'.375rem .625rem',borderRadius:'0 .375rem .375rem 0',fontSize:'.8125rem'}}>{m.text}<span style={{color:'#64748b',fontSize:'.6875rem',float:'right'}}>{m.ts}</span></div>)}
          </div>
        </div>
        {/* sync */}
        <div style={s.card}>
          <h2 style={hdr}>🔄 Edge Sync SDK <pkg>@waelio/sync</pkg></h2>
          <div style={s.out}>{syncSt}</div>
          <Row>
            <B o={()=>{setConnected(true);setSyncSt('● Connected');setSyncLog(p=>[`[${ts()}] Connected`,...p])}} v="primary">Connect</B>
            <B o={()=>connected&&setSyncLog(p=>[`[${ts()}] ↑ PUSH`,...p])} v="ghost">Push</B>
            <B o={()=>connected&&setSyncLog(p=>[`[${ts()}] ↓ PULL`,...p])} v="ghost">Pull</B>
            <B o={()=>{setConnected(false);setSyncSt('Disconnected.');setSyncLog(p=>[`[${ts()}] Disconnected`,...p])}} v="danger">Disconnect</B>
          </Row>
          <div style={s.out}>{syncLog.map((l,i)=><div key={i}>{l}</div>)}</div>
        </div>
      </div>
    </div>
  )
}

const hdr: React.CSSProperties = { fontSize:'1rem', fontWeight:600, marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'.5rem', flexWrap:'wrap' }
function pkg({ children }: { children: React.ReactNode }) {
  return <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.6875rem', background:'#1a1a26', border:'1px solid #2a2a3d', padding:'.125rem .5rem', borderRadius:'.25rem', color:'#64748b', fontWeight:400 }}>{children}</span>
}
function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>{children}</div>
}
const bv: Record<string,React.CSSProperties> = {
  primary: { background:'#6366f1', color:'#fff', border:'none' },
  ghost: { background:'#1a1a26', color:'#e2e8f0', border:'1px solid #2a2a3d' },
  danger: { background:'rgba(239,68,68,.15)', color:'#ef4444', border:'1px solid rgba(239,68,68,.3)' },
}
function B({ o, v, children }: { o:()=>void; v:string; children:React.ReactNode }) {
  return <button onClick={o} style={{ ...bv[v], padding:'.5rem 1rem', borderRadius:'.5rem', cursor:'pointer', fontFamily:"'Inter',sans-serif", fontSize:'.8125rem', fontWeight:500 }}>{children}</button>
}
