import { useState, useRef, useEffect } from 'react';
import { GiftMarketplace, GIFTS } from '../features/games/gifts';
import { Bx } from './primitives';

// ── GameChat — exact from original App.js ───────────────────
// CHAT FIRST layout, game UI is compact top widget
// Timestamp inline after message, not on separate line
// History/Commentary/Users as floating overlay drawer
export default function GameChat({chat,onSend,quick=[],roomName,navHistory=[],navCommentary=[],navUsers=[],balance=5000,bet=100,onBetChange,roomColor='var(--g)'}){
  const [msg,setMsg]=useState('');
  const [showMarketplace,setShowMarketplace]=useState(false);
  const [navPanel,setNavPanel]=useState(null); // null|'history'|'commentary'|'users'
  const [showBetSelector,setShowBetSelector]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'});},[chat]);
  const send=()=>{if(!msg.trim())return;onSend(msg);setMsg('');};

  // parse /gift commands to show gift inline after username
  const parseGiftDisplay=(text)=>{
    // "/gift rose @User" → show gift emoji inline in chat
    const m=text.match(/^\/gift\s+(\w+)\s+@(\w+)/i);
    if(m){
      const key=m[1].toUpperCase();
      const g=GIFTS[key];
      if(g) return `${g.emoji} Gifted ${g.name} to @${m[2]} (${g.cost>=1000000?'1M':g.cost>=1000?g.cost/1000+'K':g.cost} 🐑)`;
    }
    return text;
  };

  return(
    <div style={{display:'flex',flexDirection:'column',flex:1,minHeight:0,position:'relative'}}>

      {/* ── Floating History/Commentary/Users overlay ── */}
      {navPanel&&(
        <div style={{position:'absolute',top:0,left:0,right:0,zIndex:50,background:'rgba(0,0,0,.88)',backdropFilter:'blur(16px)',borderBottom:'1px solid var(--bb)',maxHeight:'55%',display:'flex',flexDirection:'column'}}>
          {/* Tabs */}
          <div style={{display:'flex',borderBottom:'1px solid var(--b)',flexShrink:0}}>
            {[['history','📋','History'],['commentary','🎙','Commentary'],['users','👥','Users']].map(([id,ic,lb])=>(
              <button key={id} onClick={()=>setNavPanel(p=>p===id?null:id)}
                style={{flex:1,padding:'8px 4px',background:navPanel===id?'rgba(0,255,65,.1)':'transparent',border:'none',borderBottom:`2px solid ${navPanel===id?'var(--g)':'transparent'}`,color:navPanel===id?'var(--g)':'var(--td)',fontSize:9,fontFamily:'var(--body)',fontWeight:700,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                <span style={{fontSize:13}}>{ic}</span><span>{lb}</span>
              </button>
            ))}
            <button onClick={()=>setNavPanel(null)} style={{padding:'8px 12px',background:'transparent',border:'none',color:'var(--td)',fontSize:16,cursor:'pointer'}}>✕</button>
          </div>
          <div style={{flex:1,overflowY:'auto',padding:'10px 14px'}}>
            {navPanel==='history'&&(
              <div>
                <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:8}}>WIN / LOSS HISTORY</div>
                {navHistory.length===0
                  ?<div style={{fontSize:10,color:'var(--td)',textAlign:'center',padding:'16px 0'}}>No rounds played yet.</div>
                  :navHistory.map((h,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:i<navHistory.length-1?'1px solid var(--b)':'none'}}>
                      <div style={{display:'flex',gap:8,alignItems:'center'}}>
                        <span style={{fontSize:13}}>{h.won?'🏆':'💀'}</span>
                        <div><div style={{fontSize:11,fontWeight:700,color:h.won?'var(--g)':'var(--red)'}}>{h.label}</div><div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>{h.t}</div></div>
                      </div>
                      <span style={{fontSize:11,color:h.won?'var(--g)':'var(--red)',fontFamily:'var(--mono)',fontWeight:700,alignSelf:'center'}}>{h.won?'+':''}{h.delta}</span>
                    </div>
                  ))}
              </div>
            )}
            {navPanel==='commentary'&&(
              <div>
                <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:8}}>COMMENTARY</div>
                {navCommentary.length===0
                  ?<div style={{fontSize:10,color:'var(--td)',textAlign:'center',padding:'16px 0'}}>No commentary yet.</div>
                  :navCommentary.map((c,i)=>(
                    <div key={i} style={{padding:'6px 0',borderBottom:i<navCommentary.length-1?'1px solid var(--b)':'none'}}>
                      <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:2}}>{c.round}</div>
                      <div style={{fontSize:10,color:'var(--text)',lineHeight:1.6}}>{c.text}</div>
                    </div>
                  ))}
              </div>
            )}
            {navPanel==='users'&&(
              <div>
                <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:8}}>{(navUsers||[]).length} IN ROOM</div>
                {(navUsers||[]).map((u,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 0',borderBottom:i<(navUsers||[]).length-1?'1px solid var(--b)':'none'}}>
                    <div style={{width:26,height:26,borderRadius:'50%',background:'rgba(0,255,65,.1)',border:'1px solid var(--bb)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0}}>{u.avatar||'👤'}</div>
                    <div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,color:u.isMe?'var(--g)':'var(--text)'}}>{u.name}{u.isMe?' (You)':''}</div><div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>{u.status||'online'}</div></div>
                    {u.isMod&&<Bx color="cyan" style={{fontSize:7}}>MOD</Bx>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Bet selector dropdown ── */}
      {showBetSelector&&onBetChange&&(
        <div style={{position:'absolute',top:0,left:0,right:0,zIndex:49,background:'rgba(0,0,0,.85)',backdropFilter:'blur(12px)',borderBottom:'1px solid var(--bb)',padding:'12px 14px'}}>
          <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:8}}>SELECT BET AMOUNT</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
            {[25,50,100,250,500,1000,2500,5000].map(b=>(
              <div key={b} onClick={()=>{onBetChange(b);setShowBetSelector(false);}}
                style={{padding:'6px 12px',borderRadius:8,border:`1px solid ${bet===b?'var(--g)':'var(--b)'}`,background:bet===b?'rgba(0,255,65,.15)':'var(--bg3)',color:bet===b?'var(--g)':'var(--td)',fontSize:10,fontFamily:'var(--mono)',fontWeight:700,cursor:'pointer'}}>
                🐑 {b}
              </div>
            ))}
          </div>
          <button onClick={()=>setShowBetSelector(false)} style={{padding:'5px 14px',borderRadius:8,background:'transparent',border:'1px solid var(--b)',color:'var(--td)',fontSize:10,cursor:'pointer'}}>Close</button>
        </div>
      )}

      {/* Gift Marketplace Modal */}
      <GiftMarketplace open={showMarketplace} onClose={()=>setShowMarketplace(false)} onSend={(cmd)=>onSend(cmd)} balance={balance}/>

      {/* ── CHAT MESSAGES — fills all space ── */}
      <div style={{flex:1,overflowY:'auto',padding:'8px 12px',display:'flex',flexDirection:'column',gap:4}}>
        {chat.map((c,i)=>{
          if(c.sys) return(
            <div key={i} style={{alignSelf:'center',maxWidth:'92%',padding:'4px 11px',borderRadius:16,background:'rgba(0,255,65,.05)',border:'1px solid rgba(0,255,65,.1)',textAlign:'center',margin:'1px 0'}}>
              <span style={{fontSize:10,color:'var(--tm)',fontFamily:'var(--mono)',lineHeight:1.4}}>{parseGiftDisplay(c.m)}</span>
            </div>
          );
          // priv/lock messages (from /tip /rain /gift responses)
          if(c.u==='🔒') return(
            <div key={i} style={{alignSelf:'flex-end',maxWidth:'88%',padding:'4px 10px',borderRadius:'13px 3px 13px 13px',background:'rgba(0,255,65,.06)',border:'1px solid rgba(0,255,65,.15)',display:'flex',gap:5,alignItems:'center'}}>
              <span style={{fontSize:10,color:'var(--g)',fontFamily:'var(--mono)',flex:1}}>{c.m}</span>
              <span style={{fontSize:8,color:'var(--td)',opacity:.6,flexShrink:0}}>{c.t}</span>
            </div>
          );
          const isMe=c.u==='You';
          return(
            <div key={i} style={{alignSelf:isMe?'flex-end':'flex-start',maxWidth:'80%',display:'flex',flexDirection:'column',gap:1}}>
              {!isMe&&<span style={{fontSize:9,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700,paddingLeft:4}}>{c.u}</span>}
              <div style={{padding:'6px 10px',borderRadius:isMe?'13px 3px 13px 13px':'3px 13px 13px 13px',background:isMe?'rgba(0,255,65,.12)':'var(--panel2)',border:'1px solid '+(isMe?'rgba(0,255,65,.2)':'var(--b)'),color:isMe?'var(--g)':'var(--text)',fontSize:11,wordBreak:'break-word',display:'flex',flexWrap:'wrap',gap:6,alignItems:'flex-end'}}>
                <span style={{flex:1}}>{parseGiftDisplay(c.m)}</span>
                <span style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',opacity:.7,flexShrink:0,lineHeight:1.8}}>{c.t}</span>
              </div>
            </div>
          );
        })}
        <div ref={endRef}/>
      </div>

      {/* ── Bottom strap: nav tabs + quick replies + rain/tip/gifts ── */}
      <div style={{display:'flex',gap:4,padding:'4px 10px 2px',overflowX:'auto',borderTop:'1px solid var(--b)',flexShrink:0,alignItems:'center'}}>
        {/* Compact nav icons */}
        {[['history','📋'],['commentary','🎙'],['users','👥']].map(([id,ic])=>(
          <div key={id} onClick={()=>setNavPanel(p=>p===id?null:id)}
            style={{flexShrink:0,width:26,height:26,borderRadius:8,border:`1px solid ${navPanel===id?'var(--g)':'var(--b)'}`,background:navPanel===id?'rgba(0,255,65,.1)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,cursor:'pointer'}}>
            {ic}
          </div>
        ))}
        <div style={{width:1,background:'var(--b)',height:16,flexShrink:0,margin:'0 2px'}}/>
        {/* Bet selector */}
        {onBetChange&&(
          <div onClick={()=>setShowBetSelector(s=>!s)}
            style={{flexShrink:0,padding:'3px 8px',borderRadius:10,border:`1px solid ${showBetSelector?'var(--g)':'var(--bb)'}`,background:'rgba(0,255,65,.05)',color:'var(--g)',fontSize:9,cursor:'pointer',fontFamily:'var(--mono)',fontWeight:700,whiteSpace:'nowrap'}}>
            🐑 {bet}
          </div>
        )}
        <div style={{width:1,background:'var(--b)',height:16,flexShrink:0,margin:'0 2px'}}/>
        {/* Quick replies */}
        {quick.map((q,i)=>(
          <div key={i} onClick={()=>onSend(q)} style={{flexShrink:0,padding:'3px 8px',borderRadius:12,border:'1px solid var(--b)',background:'var(--panel)',color:'var(--td)',fontSize:9,cursor:'pointer',fontWeight:700,whiteSpace:'nowrap'}}>{q}</div>
        ))}
        <div style={{width:1,background:'var(--b)',height:16,flexShrink:0,margin:'0 2px'}}/>
        {/* /rain /tip */}
        {['/rain 100','/tip 50 @User'].map(c=>(
          <div key={c} onClick={()=>setMsg(c)} style={{flexShrink:0,padding:'3px 7px',borderRadius:10,border:'1px solid var(--bb)',background:'rgba(0,255,65,.04)',color:'var(--td)',fontSize:8,cursor:'pointer',fontFamily:'var(--mono)',whiteSpace:'nowrap'}}>{c}</div>
        ))}
        {/* Gifts */}
        <div onClick={()=>setShowMarketplace(true)} style={{flexShrink:0,padding:'3px 9px',borderRadius:10,border:'1px solid rgba(255,215,0,.3)',background:'rgba(255,215,0,.07)',color:'var(--gold)',fontSize:9,cursor:'pointer',fontFamily:'var(--mono)',fontWeight:700}}>🎁</div>
      </div>

      {/* ── Input ── */}
      <div style={{display:'flex',gap:8,padding:'6px 10px 10px',flexShrink:0,background:'var(--bg)',borderTop:'1px solid var(--b)'}}>
        <input value={msg} onChange={e=>setMsg(e.target.value.slice(0,600))} onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder="Message..."
          style={{flex:1,background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--body)',fontSize:12,borderRadius:22,padding:'8px 14px',outline:'none'}}/>
        <button onClick={send} style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,var(--g2),var(--g))',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M1 8L13 2L9 8M13 2L9 14L9 8" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}
