export default function Drawer({ open, onClose, navigate }) {
  if (!open) return null;
  const sections = [
    { title:'TRADE & MARKETS', color:'#ffd700', items:[
      { icon:'📊', label:'Markets',      page:'market',     sub:'100+ live coins' },
      { icon:'📈', label:'Trade',        page:'trade',      sub:'Spot buy & sell' },
      { icon:'🔮', label:'Up / Down',    page:'updown',     sub:'Quick predictions' },
      { icon:'🏆', label:'Tournaments',  page:'tournaments', sub:'Compete to win' },
    ]},
    { title:'PAY & ACCOUNTS', color:'#00e5ff', items:[
      { icon:'💳', label:'CUTPay',       page:'cutpay',     sub:'Payments OS' },
      { icon:'🏦', label:'Accounts',     page:'bank',       sub:'Bank & savings' },
      { icon:'📱', label:'CUTBAR UPI',   page:'cutbarupi',  sub:'Instant UPI' },
    ]},
    { title:'YIELD', color:'#00ff41', items:[
      { icon:'💰', label:'Earn',         page:'earn',             sub:'Up to 18.66% APR' },
      { icon:'🌾', label:'Staking',      page:'stake_tournament', sub:'Stake to earn' },
    ]},
    { title:'WEB3', color:'#9945ff', items:[
      { icon:'🐑', label:'CUTBAR Token', page:'token', sub:'Pre-launch · BSC' },
      { icon:'🤝', label:'P2P',          page:'p2p',   sub:'Peer-to-peer trading' },
    ]},
    { title:'ARENA', color:'#ff7a00', items:[
      { icon:'🎮', label:'cutPlay',       page:'cutplay',   sub:'Casual battles' },
      { icon:'⚔️', label:'Last Standing', page:'laststand', sub:'Last player wins' },
    ]},
    { title:'DISCOVER', color:'#00cc88', items:[
      { icon:'📰', label:'News',        page:'news',  sub:'Crypto headlines' },
      { icon:'🤖', label:'CUTBAR AI',   page:'chat',  sub:'Ask anything' },
      { icon:'❓', label:'About / FAQ', page:'about', sub:'Docs & info' },
    ]},
  ];
  return (
    <div onClick={e => { if (e.target===e.currentTarget) onClose(); }} style={{ position:'fixed', inset:0, zIndex:500, background:'rgba(0,0,0,.7)', backdropFilter:'blur(8px)' }}>
      <div className="sl" style={{ position:'absolute', top:0, right:0, bottom:0, width:265, background:'var(--panel)', borderLeft:'1px solid var(--bb)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <div style={{ padding:'16px 16px 12px', borderBottom:'1px solid var(--b)', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background:'var(--panel)', zIndex:1 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:900, color:'var(--g)', letterSpacing:.5, fontFamily:'var(--display)' }}>CUTBAR</div>
            <div style={{ fontSize:8, color:'var(--td)', fontFamily:'var(--mono)', letterSpacing:2, marginTop:1 }}>WEB3 ECOSYSTEM</div>
          </div>
          <div onClick={onClose} style={{ width:30, height:30, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', background:'rgba(255,255,255,.05)', fontSize:14, color:'var(--td)' }}>✕</div>
        </div>
        <div style={{ flex:1, padding:'6px 0 12px' }}>
          {sections.map((sec, si) => (
            <div key={si} style={{ marginBottom:2 }}>
              <div style={{ fontSize:8, fontWeight:800, color:sec.color||'var(--td)', fontFamily:'var(--mono)', letterSpacing:2.5, padding:'10px 16px 5px', textTransform:'uppercase', display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ height:1, width:6, background:sec.color||'var(--td)', borderRadius:1, opacity:.6 }} />
                {sec.title}
              </div>
              {sec.items.map((item, i) => (
                <div key={i} onClick={() => { navigate(item.page); onClose(); }}
                  style={{ display:'flex', alignItems:'center', gap:11, padding:'8px 16px', cursor:'pointer', transition:'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(0,255,65,.05)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <span style={{ fontSize:14, width:22, textAlign:'center', flexShrink:0 }}>{item.icon}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'var(--text)', lineHeight:1.2 }}>{item.label}</div>
                    {item.sub && <div style={{ fontSize:9, color:'var(--td)', fontFamily:'var(--mono)', marginTop:1 }}>{item.sub}</div>}
                  </div>
                  <span style={{ fontSize:12, color:'var(--td)' }}>›</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding:'12px 16px 24px', borderTop:'1px solid var(--b)' }}>
          <div style={{ display:'flex', gap:10, marginBottom:8 }}>
            {[['✈️','https://t.me/cutbar'],['🐦','https://x.com/cutbar'],['🌐','https://cutbar.in'],['📄','https://cutbar.in/whitepaper']].map(([ic, url]) => (
              <div key={url} onClick={() => window.open(url,'_blank')} style={{ width:32, height:32, borderRadius:8, background:'rgba(0,255,65,.06)', border:'1px solid var(--b)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:13 }}>{ic}</div>
            ))}
          </div>
          <div style={{ fontSize:9, color:'var(--td)', fontFamily:'var(--mono)', letterSpacing:1 }}>CUTBAR v4.2 · BSC · BEP-20</div>
        </div>
      </div>
    </div>
  );
}
