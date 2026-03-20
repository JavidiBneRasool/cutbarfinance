import { useState, useEffect } from 'react';
import { BackBar, Bx } from '../components/primitives';

function ArenaLiveStrip() {
  const [tick,setTick]=useState(0);
  const events=[{dot:'#ff3b5c',text:'12 players battling in LowCardOut'},{dot:'#ffd700',text:'Tournament ending in 2m 14s'},{dot:'#ff7a00',text:'Last Standing room filling fast — 7/8'},{dot:'#00ff41',text:'New game: Kokar Fight just opened'},{dot:'#9945ff',text:'VeerBhat_Pro won 🐑 4,200 in 8Ball'}];
  useEffect(()=>{const t=setInterval(()=>setTick(i=>i+1),3000);return()=>clearInterval(t);},[]);
  const e=events[tick%events.length];
  return(
    <div style={{margin:'0 14px 10px',padding:'8px 12px',background:'rgba(255,59,92,.05)',border:'1px solid rgba(255,59,92,.18)',borderRadius:10,display:'flex',alignItems:'center',gap:8,animation:'fadeUp .3s ease both'}}>
      <div style={{width:7,height:7,borderRadius:'50%',background:e.dot,animation:'pulse 1s infinite',flexShrink:0}}/>
      <span style={{fontSize:10,color:'var(--text)',fontFamily:'var(--mono)',fontWeight:600,flex:1}}>{e.text}</span>
      <span style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',flexShrink:0}}>LIVE</span>
    </div>
  );
}

export default function FunPage({ navigate, toast, onBack }) {
  const games=[
    {icon:'🔮',n:'Up / Down',       sub:'BTC Price Prediction',       d:'Predict Bitcoin direction in 10 seconds. Win CUTBAR instantly.',  page:'updown',          c:'#00e5ff',b:'LIVE',    urgency:'HIGH',  players:34, countdown:null},
    {icon:'🏆',n:'Tournaments',     sub:'Weekly Trading Competition',  d:'Top profit % wins the CUTBAR prize pool. Next reset: Monday.',    page:'tournaments',     c:'#ffd700',b:'WEEKLY', urgency:'MEDIUM',players:89, countdown:'2d 4h'},
    {icon:'🎮',n:'cutPlay',         sub:'10 Arena Games',              d:'LowCardOut · Dice Cricket · 8Ball · Penalty · Kokar — bet & win', page:'cutplay',         c:'#ff7a00',b:'10 GAMES',urgency:'HIGH', players:127,countdown:null},
    {icon:'🌾',n:'Staking Rewards', sub:'Lock CUTBAR · Earn APY',      d:'Stake tokens for weekly pools. Bonus APY for tournament winners.',page:'stake_tournament', c:'#00cc88',b:'ONGOING',urgency:'LOW',  players:null,countdown:null},
  ];
  return(
    <div className="fu" style={{paddingBottom:80}}>
      <BackBar title="Arena" onBack={onBack} right={<div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:7,height:7,borderRadius:'50%',background:'#ff3b5c',animation:'pulse 1s infinite'}}/><span style={{fontSize:9,color:'#ff3b5c',fontFamily:'var(--mono)',fontWeight:700}}>WAR ZONE</span></div>}/>
      <ArenaLiveStrip/>
      <div style={{margin:'0 14px 14px',background:'linear-gradient(135deg,rgba(255,59,92,.1),rgba(255,122,0,.06),rgba(153,69,255,.06))',border:'1px solid rgba(255,59,92,.25)',borderRadius:16,padding:'14px 16px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',right:-10,top:-10,fontSize:80,opacity:.06,pointerEvents:'none',lineHeight:1}}>⚔️</div>
        <div style={{fontSize:9,color:'#ff3b5c',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:4}}>ENTER THE ARENA</div>
        <div style={{fontSize:16,fontWeight:800,color:'var(--text)',marginBottom:8,lineHeight:1.3}}>Bet CUTBAR. Dominate. Win.</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <Bx color="red" style={{fontSize:8}}>● 127 PLAYERS LIVE</Bx>
          <Bx color="gold" style={{fontSize:8}}>🏆 PRIZE POOL ACTIVE</Bx>
          <Bx color="orange" style={{fontSize:8}}>⚡ INSTANT PAYOUTS</Bx>
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:10,padding:'0 14px 14px'}}>
        {games.map((g,i)=>{
          const isFeatured=i===0;
          return(
            <div key={i} onClick={()=>navigate(g.page)}
              style={{background:isFeatured?`linear-gradient(135deg,${g.c}12,${g.c}04)`:'var(--panel)',border:`1px solid ${isFeatured?g.c+'50':'var(--b)'}`,borderRadius:16,padding:14,cursor:'pointer',position:'relative',overflow:'hidden',boxShadow:isFeatured?`0 0 20px ${g.c}18`:'none',transition:'all .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=g.c+'66';e.currentTarget.style.transform='translateY(-1px)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=isFeatured?g.c+'50':'var(--b)';e.currentTarget.style.transform='none';}}>
              <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 0% 50%,${g.c}0e,transparent 55%)`,pointerEvents:'none'}}/>
              {isFeatured&&<div style={{position:'absolute',top:10,right:12,fontSize:8,fontFamily:'var(--mono)',fontWeight:800,color:g.c,background:g.c+'18',border:`1px solid ${g.c}40`,borderRadius:20,padding:'2px 8px',letterSpacing:1}}>⚡ FAST DOPAMINE</div>}
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:52,height:52,borderRadius:14,background:`${g.c}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,border:`1px solid ${g.c}30`,flexShrink:0,boxShadow:isFeatured?`0 0 12px ${g.c}30`:'none'}}>{g.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3,flexWrap:'wrap'}}>
                    <span style={{fontSize:14,fontWeight:800,color:'var(--text)',lineHeight:1.2}}>{g.n}</span>
                    <span style={{padding:'2px 7px',borderRadius:20,fontSize:8,fontFamily:'var(--mono)',fontWeight:800,background:g.c+'18',color:g.c,border:`1px solid ${g.c}30`}}>{g.b}</span>
                    {g.countdown&&<span style={{padding:'2px 7px',borderRadius:20,fontSize:8,fontFamily:'var(--mono)',fontWeight:700,background:'rgba(255,215,0,.1)',color:'var(--gold)',border:'1px solid rgba(255,215,0,.3)'}}>⏰ {g.countdown}</span>}
                  </div>
                  <div style={{fontSize:10,color:'var(--td)',marginBottom:4}}>{g.sub}</div>
                  <div style={{fontSize:11,color:'var(--tm)',lineHeight:1.5}}>{g.d}</div>
                  {g.players&&<div style={{marginTop:6,display:'flex',alignItems:'center',gap:4}}><div style={{width:5,height:5,borderRadius:'50%',background:g.c,animation:'pulse 1.5s infinite'}}/><span style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>{g.players} players online</span></div>}
                </div>
                <div style={{padding:'9px 14px',borderRadius:10,background:`linear-gradient(135deg,${g.c}30,${g.c}18)`,border:`1px solid ${g.c}50`,fontSize:10,fontWeight:800,color:g.c,flexShrink:0,whiteSpace:'nowrap',fontFamily:'var(--mono)',boxShadow:isFeatured?`0 0 10px ${g.c}30`:'none'}}>
                  {g.urgency==='HIGH'?'PLAY NOW →':g.urgency==='MEDIUM'?'ENTER →':'JOIN →'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
