import { R, Txt } from './primitives';

export default function ProfilePanel({ open, onClose, navigate, theme, setTheme, userProfile }) {
  if (!open) return null;
  const up = userProfile || {};
  const isDark = theme === 'dark';
  const sections = [
    { title:'CONTROL', items:[
      { ic:'👤', lb:'Edit Profile',       page:'account', sub:'Name, photo, contact' },
      { ic:'🛡️', lb:'Security',           page:'account', sub:'Password, 2FA, biometric' },
      { ic:'✅', lb:'KYC & Verification', page:'account', sub:'Identity docs & limits' },
      { ic:'🔔', lb:'Notifications',      page:'account', sub:'Push, email, SMS' },
      { ic:'⚙️', lb:'Preferences',        page:'account', sub:'Theme, currency, language' },
    ]},
    { title:'FINANCIAL', items:[
      { ic:'🏦', lb:'Linked Accounts',  page:'bank',    sub:'Bank & cards connected' },
      { ic:'💳', lb:'Payment Methods', page:'bank',    sub:'UPI, cards, wallets' },
      { ic:'📊', lb:'Limits & Tier',   page:'account', sub:'Daily limits, upgrade' },
    ]},
    { title:'SYSTEM', items:[
      { ic:'📄', lb:'Documents & Taxes', page:'account', sub:'Reports, statements' },
      { ic:'💬', lb:'Customer Support',  page:'support', sub:'24/7 help center' },
    ]},
  ];
  return (
    <div onClick={e => { if (e.target===e.currentTarget) onClose(); }} style={{ position:'fixed', inset:0, zIndex:510, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)' }}>
      <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'78%', maxWidth:340, background:'var(--panel)', borderLeft:'1px solid var(--bb)', display:'flex', flexDirection:'column', animation:'slideL .28s cubic-bezier(.16,1,.3,1)', boxShadow:'-8px 0 40px rgba(0,0,0,.4)' }}>
        <div style={{ padding:'28px 20px 18px', borderBottom:'1px solid var(--b)', background:'linear-gradient(160deg,rgba(0,255,65,.06) 0%,transparent 60%)', position:'relative' }}>
          <div onClick={onClose} style={{ position:'absolute', top:14, right:14, width:28, height:28, borderRadius:8, background:'rgba(255,255,255,.06)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:13, color:'var(--td)' }}>✕</div>
          <div style={{ width:58, height:58, borderRadius:'50%', overflow:'hidden', border:'2.5px solid var(--g)', background:'var(--bg3)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, boxShadow:'0 0 0 4px rgba(0,255,65,.1)' }}>
            {up.avatar ? <img src={up.avatar} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{ fontSize:30, lineHeight:1 }}>🦝</span>}
          </div>
          <div style={{ fontSize:17, fontWeight:700, color:'var(--text)', marginBottom:2 }}>{up.name||'User'}</div>
          <div style={{ fontSize:11, color:'var(--td)', fontFamily:'var(--mono)', marginBottom:10 }}>{up.email||''}</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
            {up.kyc==='verified' && <span style={{ fontSize:9, background:'rgba(0,255,65,.12)', color:'var(--g)', borderRadius:20, padding:'3px 9px', fontFamily:'var(--mono)', fontWeight:700, border:'1px solid rgba(0,255,65,.25)' }}>✓ KYC</span>}
            <span style={{ fontSize:9, background:'rgba(255,215,0,.12)', color:'var(--gold)', borderRadius:20, padding:'3px 9px', fontFamily:'var(--mono)', fontWeight:700, border:'1px solid rgba(255,215,0,.25)' }}>Level {up.kycLevel||1}</span>
            <span style={{ fontSize:9, background:'rgba(0,229,255,.12)', color:'var(--cyan)', borderRadius:20, padding:'3px 9px', fontFamily:'var(--mono)', fontWeight:700, border:'1px solid rgba(0,229,255,.25)' }}>🌐 {up.country||'IN'}</span>
          </div>
          <div style={{ background:'rgba(0,255,65,.06)', border:'1px solid rgba(0,255,65,.15)', borderRadius:10, padding:'10px 12px', marginBottom:8 }}>
            <div style={{ fontSize:9, color:'var(--td)', fontFamily:'var(--mono)', letterSpacing:2, marginBottom:4 }}>TOTAL BALANCE</div>
            <div style={{ fontSize:20, fontWeight:800, color:'var(--g)', fontFamily:'var(--mono)' }}>$0.00</div>
            <div style={{ fontSize:9, color:'var(--td)', fontFamily:'var(--mono)', marginTop:2 }}>Deposit funds to get started</div>
          </div>
          <div style={{ marginBottom:4 }}>
            <R justify="space-between" style={{ marginBottom:4 }}>
              <Txt size={9} color="var(--td)" mono={true}>XP Progress</Txt>
              <Txt size={9} color="var(--gold)" mono={true}>Lv {up.kycLevel||1} → {(up.kycLevel||1)+1}</Txt>
            </R>
            <div style={{ height:4, background:'var(--bg3)', borderRadius:2 }}>
              <div style={{ width:'35%', height:'100%', background:'linear-gradient(90deg,var(--g2),var(--g))', borderRadius:2, boxShadow:'0 0 6px var(--g)' }} />
            </div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 20px', borderBottom:'1px solid var(--b)' }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontSize:18 }}>{isDark?'🌙':'☀️'}</span>
            <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{isDark?'Dark Mode':'Light Mode'}</span>
          </div>
          <div onClick={() => setTheme(t => t==='dark'?'light':'dark')} style={{ width:44, height:24, borderRadius:12, background:isDark?'var(--g)':'var(--b)', position:'relative', cursor:'pointer', transition:'background .3s', border:'1px solid var(--bb)', flexShrink:0 }}>
            <div style={{ position:'absolute', top:3, left:isDark?20:3, width:16, height:16, borderRadius:'50%', background:isDark?'#000':'var(--td)', transition:'left .3s' }} />
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {sections.map((sec, si) => (
            <div key={si}>
              <div style={{ fontSize:8, fontWeight:800, color:'var(--td)', fontFamily:'var(--mono)', letterSpacing:2.5, padding:'10px 20px 4px' }}>{sec.title}</div>
              {sec.items.map((it, i) => (
                <div key={i} onClick={() => { navigate(it.page); onClose(); }}
                  style={{ display:'flex', alignItems:'center', gap:13, padding:'10px 20px', cursor:'pointer', borderBottom:'1px solid var(--b)', transition:'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(0,255,65,.04)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <span style={{ fontSize:18, width:24, textAlign:'center', flexShrink:0 }}>{it.ic}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'var(--text)', lineHeight:1.3 }}>{it.lb}</div>
                    <div style={{ fontSize:9, color:'var(--td)', marginTop:1 }}>{it.sub}</div>
                  </div>
                  <span style={{ fontSize:14, color:'var(--td)', flexShrink:0 }}>›</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding:'12px 20px 32px', borderTop:'1px solid var(--b)' }}>
          <div onClick={onClose} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderRadius:12, background:'rgba(255,59,92,.06)', border:'1px solid rgba(255,59,92,.15)', cursor:'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,59,92,.12)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,59,92,.06)'}>
            <span style={{ fontSize:18 }}>🚪</span>
            <span style={{ fontSize:13, fontWeight:600, color:'var(--red)' }}>Sign Out</span>
          </div>
        </div>
      </div>
    </div>
  );
}
