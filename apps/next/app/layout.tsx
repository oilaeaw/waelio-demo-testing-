import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '@waelio packages — Next.js 14 Demo',
  description: 'Cross-framework demo of all @waelio npm packages',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif", background: '#0a0a0f', color: '#e2e8f0', minHeight: '100vh', margin: 0 }}>
        <header style={{ background:'#12121a', borderBottom:'1px solid #2a2a3d', padding:'1.25rem 2rem', display:'flex', alignItems:'center', gap:'1rem' }}>
          <div style={{ background:'#000', color:'#fff', fontWeight:800, padding:'.25rem .6rem', borderRadius:'.375rem', fontSize:'.75rem' }}>W</div>
          <h1 style={{ fontSize:'1.125rem', fontWeight:600 }}>@waelio packages</h1>
          <span style={{ marginLeft:'auto', background:'rgba(0,0,0,.3)', color:'#e2e8f0', border:'1px solid rgba(255,255,255,.15)', padding:'.25rem .75rem', borderRadius:'999px', fontSize:'.75rem' }}>▲ Next.js 14</span>
        </header>
        {children}
      </body>
    </html>
  )
}
