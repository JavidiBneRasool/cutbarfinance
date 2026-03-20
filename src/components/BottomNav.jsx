import { NAV_LEFT, NAV_RIGHT } from '../constants';

function NavBtn({ n, isAct, onClick }) {
  return (
    <button onClick={onClick} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'7px 2px 5px', cursor:'pointer', gap:2, fontFamily:'var(--body)', fontSize:8, fontWeight:700, color:isAct?'var(--g)':'var(--td)', border:'none', background:'none', transition:'color .2s', letterSpacing:.3, WebkitTapHighlightColor:'transparent' }}>
      <span style={{ fontSize:17, transform:isAct?'scale(1.18)':'none', filter:isAct?'drop-shadow(0 0 6px var(--g))':'none', transition:'all .2s' }}>{n.icon}</span>
      {n.label}
      {isAct && <div style={{ width:12, height:2, background:'var(--g)', borderRadius:1, boxShadow:'0 0 6px var(--g)' }} />}
    </button>
  );
}

export default function BottomNav({ activeTab, navToTab, onPulse }) {
  return (
    <nav style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:480, display:'flex', alignItems:'flex-end', zIndex:100, background:'var(--nav)', borderTop:'1px solid var(--bb)', backdropFilter:'blur(24px)', padding:'0 0 2px' }}>
      {NAV_LEFT.map(n => <NavBtn key={n.id} n={n} isAct={activeTab===n.id} onClick={() => navToTab(n.id)} />)}
      <div onClick={onPulse} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', paddingBottom:5, cursor:'pointer', position:'relative', WebkitTapHighlightColor:'transparent', minWidth:56 }}>
        <div style={{ position:'absolute', bottom:28, width:58, height:58, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,255,65,.15),transparent 70%)', animation:'pulseBreathe 2.5s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ width:50, height:50, borderRadius:'50%', background:'linear-gradient(135deg,#00cc33,#00ff41)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 22px rgba(0,255,65,.55),0 4px 12px rgba(0,255,65,.3)', marginBottom:3, transform:'translateY(-10px)', border:'3px solid var(--nav)', transition:'all .2s cubic-bezier(.16,1,.3,1)', position:'relative', zIndex:1, fontSize:22 }}
          onMouseEnter={e => e.currentTarget.style.transform='translateY(-13px) scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform='translateY(-10px)'}>
          ◎
        </div>
        <span style={{ fontSize:8, fontWeight:800, color:'var(--g)', fontFamily:'var(--mono)', letterSpacing:1 }}>PULSE</span>
      </div>
      {NAV_RIGHT.map(n => <NavBtn key={n.id} n={n} isAct={activeTab===n.id} onClick={() => navToTab(n.id)} />)}
    </nav>
  );
}
