export default function AppHeader({ userProfile, onAvatarClick, onMenuClick }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px 8px', borderBottom:'1px solid var(--bb)', background:'var(--header)', position:'sticky', top:0, zIndex:100, backdropFilter:'blur(24px)' }}>
      <div onClick={onAvatarClick} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
        <div style={{ width:34, height:34, borderRadius:'50%', overflow:'hidden', flexShrink:0, boxShadow:'0 0 0 2px var(--bg),0 0 0 3px rgba(0,255,65,.35)', background:'var(--panel)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {userProfile?.avatar
            ? <img src={userProfile.avatar} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            : <span style={{ fontSize:19, lineHeight:1 }}>🦝</span>
          }
        </div>
        <div>
          <div style={{ fontFamily:'var(--display)', fontSize:20, fontWeight:900, color:'var(--g)', letterSpacing:.5, lineHeight:1 }}>CUTBAR</div>
          <span style={{ fontSize:8, color:'var(--td)', fontFamily:'var(--mono)', letterSpacing:2 }}>BSC · cutbar.in</span>
        </div>
      </div>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <div style={{ display:'flex', gap:5, alignItems:'center', background:'rgba(0,255,65,.05)', border:'1px solid var(--bb)', borderRadius:7, padding:'4px 9px' }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--g)', animation:'pulse 1.5s infinite' }} />
          <span style={{ fontSize:9, color:'var(--g)', fontFamily:'var(--mono)' }}>LIVE</span>
        </div>
        <div onClick={onMenuClick} style={{ width:34, height:34, borderRadius:9, border:'1px solid rgba(255,255,255,.06)', background:'transparent', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', gap:4 }}>
          {[0,1,2].map(i => <div key={i} style={{ width:16, height:1.5, background:'var(--tm)', borderRadius:1 }} />)}
        </div>
      </div>
    </div>
  );
}
