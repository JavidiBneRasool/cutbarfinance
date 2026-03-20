/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, useCallback } from 'react';
import { lcDeal5, lcNow, AVATARS_G } from '../features/games/gameHelpers';
import { GIFTS } from '../features/games/gifts';
import { GiftMarketplace } from '../features/games/gifts';
import { Bx } from './primitives';

const BANNED_USERS = new Set();
const KICKED_USERS = new Map();

// ── useLowCardEngine ────────────────────────────────────────
function useLowCardEngine(myName) {
  const [roomUsers,   setRoomUsers]   = useState([{name:myName,isMod:false},{name:'VeerBhat_Pro',isMod:false},{name:'Khachi',isMod:true},{name:'SatoshiAlpha',isMod:false},{name:'CryptoKhan',isMod:false}]);
  const [muted,       setMuted]       = useState(new Set());
  const [myBalance,   setMyBalance]   = useState(5000);
  const [chatMsgs,    setChatMsgs]    = useState([
    {id:1,type:'sys',text:'Welcome to LowCardOut 🃏 Lowest card each round is OUT. Last standing wins.',t:lcNow()},
    {id:2,type:'sys',text:'Khachi joined the chat',t:lcNow()},
    {id:3,type:'pub',user:'Khachi',text:'who wants to play? 👀',t:lcNow()},
    {id:4,type:'sys',text:'VeerBhat_Pro joined the chat',t:lcNow()},
    {id:5,type:'pub',user:'VeerBhat_Pro',text:'im in 🔥',t:lcNow()},
  ]);
  const msgId = useRef(10);
  const addMsg = useCallback(m=>{msgId.current++;setChatMsgs(p=>[...p,{...m,id:msgId.current,t:lcNow()}]);},[]);
  const addSys  = useCallback((text,style='normal')=>addMsg({type:'sys',text,style}),[addMsg]);
  const addPub  = useCallback((user,text)=>addMsg({type:'pub',user,text}),[addMsg]);
  const addPriv = useCallback((text,style='warn')=>addMsg({type:'priv',text,style}),[addMsg]);
  const addGame = useCallback((text,style='game')=>addMsg({type:'game',text,style}),[addMsg]);

  const [round,         setRound]         = useState(null);
  const [joinCountdown, setJoinCountdown] = useState(0);
  const [pickCountdown, setPickCountdown] = useState(0);
  const joinTimerRef=useRef(null);const pickTimerRef=useRef(null);
  const roundRef=useRef(null);const jcRef=useRef(null);const pcRef=useRef(null);
  roundRef.current=round;

  const startJoinCountdown=(secs,onDone)=>{
    setJoinCountdown(secs);clearInterval(jcRef.current);let rem=secs;
    jcRef.current=setInterval(()=>{rem--;setJoinCountdown(rem);if(rem<=0){clearInterval(jcRef.current);onDone();}},1000);
  };
  const startPickCountdown=(secs,onDone)=>{
    setPickCountdown(secs);clearInterval(pcRef.current);let rem=secs;
    pcRef.current=setInterval(()=>{rem--;setPickCountdown(rem);if(rem<=0){clearInterval(pcRef.current);onDone();}},1000);
  };

  const resolveReveal=(r)=>{
    const active=r.players.filter(p=>!p.elim);
    active.forEach(p=>{if(p.picked)addGame(`🎴 ${p.name} drew ${p.picked.v}${p.picked.s}`,'draw');});
    const minRank=Math.min(...active.map(p=>p.picked?p.picked.r:99));
    const losers=active.filter(p=>p.picked&&p.picked.r===minRank);
    if(losers.length>1){
      const names=losers.map(p=>p.name).join(' & ');addGame(`⚔️ Tie breaker round for ${names}`,'tie');
      const reset=r.players.map(p=>losers.find(l=>l.name===p.name)?{...p,hand:lcDeal5(),picked:null}:p);
      const tied={...r,phase:'tiebreak',tieGroup:losers.map(l=>l.name),players:reset};
      setTimeout(()=>{
        setRound(tied);
        startPickCountdown(5,()=>{setRound(prev=>{if(!prev)return prev;const up=prev.players.map(p=>{if(!prev.tieGroup.includes(p.name)||p.picked)return p;const card=p.hand[Math.floor(Math.random()*5)];addGame(`⚡ Auto-pick for ${p.name}: ${card.v}${card.s}`,'sys');return{...p,picked:card};});return resolveReveal({...prev,players:up,phase:'picking'});});});
        losers.filter(p=>p.name!==myName).forEach((p,i)=>{setTimeout(()=>{setRound(prev=>{if(!prev||!prev.tieGroup)return prev;const me=prev.players.find(x=>x.name===p.name&&!x.elim&&!x.picked);if(!me)return prev;const card=me.hand[Math.floor(Math.random()*5)];addGame(`🎴 ${p.name} drew ${card.v}${card.s}`,'draw');const up=prev.players.map(x=>x.name===p.name?{...x,picked:card}:x);const allDone=up.filter(x=>!x.elim&&prev.tieGroup.includes(x.name)).every(x=>x.picked);if(allDone){clearInterval(pcRef.current);setPickCountdown(0);return resolveReveal({...prev,players:up,phase:'picking'});}return{...prev,players:up};});},800+i*1000+Math.random()*700);});
      },600);
      return tied;
    }
    const loser=losers[0];
    addGame(`${loser.name===myName?'💀 You drew the lowest card':'🎴 '+loser.name+' drew the lowest card'} — ${loser.picked.v}${loser.picked.s} ☠️ OUT!`,'out');
    if(loser.name===myName)addPriv(`You are out with low card ${loser.picked.v}${loser.picked.s}`,'out');
    const newPlayers=r.players.map(p=>p.name===loser.name?{...p,elim:true}:{...p,hand:lcDeal5(),picked:null});
    const stillIn=newPlayers.filter(p=>!p.elim);
    if(stillIn.length<=1){
      const winner=stillIn[0];const fee=Math.floor(r.pot*0.04);const prize=r.pot-fee;
      addGame(`🏆 HURRRR ${winner.name} won ${prize} CUTBAR 🎉`,'win');
      if(winner.name===myName){setMyBalance(b=>b+prize);addPriv(`You won ${prize} CUTBAR 🏆`,'win');}
      return{...r,players:newPlayers,phase:'done',winner:winner.name};
    }
    const next={...r,players:newPlayers,phase:'dealing',tieGroup:[]};
    addGame(`🔁 ${stillIn.length} players remain: ${stillIn.map(p=>p.name).join(', ')}`,'sys');
    setTimeout(()=>{setRound(prev=>{if(!prev||prev.phase==='done')return prev;const dealt={...next,phase:'dealing',players:stillIn.map(p=>({...p,hand:lcDeal5(),picked:null})).concat(newPlayers.filter(p=>p.elim))};addGame(`🃏 New cards dealt! Pick your card — 5 seconds!`,'deal');setTimeout(()=>beginPicking(dealt),600);return dealt;});},1500);
    return next;
  };

  const beginDealing=(r)=>{const dealt={...r,phase:'dealing',players:r.players.map(p=>({...p,hand:lcDeal5(),picked:null}))};addGame(`🃏 Cards dealt! Pick your card — 5 seconds!`,'deal');setTimeout(()=>beginPicking(dealt),800);return dealt;};

  const beginPicking=(r)=>{
    setRound({...r,phase:'picking'});
    startPickCountdown(5,()=>{setRound(prev=>{if(!prev||prev.phase!=='picking')return prev;const updated=prev.players.map(p=>{if(p.elim||p.picked)return p;const card=p.hand[Math.floor(Math.random()*5)];addGame(`⚡ Auto-pick for ${p.name}: ${card.v}${card.s}`,'sys');return{...p,picked:card};});return resolveReveal({...prev,players:updated});});});
  };

  const startRound=useCallback((bet,starterName)=>{
    if(roundRef.current&&roundRef.current.phase!=='idle'&&roundRef.current.phase!=='done')return;
    if(bet<1||bet>1000){addPriv('Bet must be between 1 and 1000 CUTBAR');return;}
    if(myBalance<bet){addPriv('You do not have sufficient CUTBAR');return;}
    setMyBalance(b=>b-bet);
    const newRound={phase:'joining',bet,pot:bet,startedBy:starterName,players:[{name:starterName,hand:null,picked:null,elim:false}],tieGroup:[],winner:null};
    setRound(newRound);addGame(`🔥 ${starterName} started a new round of ${bet} CUTBAR — tap JOIN to play`,'start');addPriv(`You Started the round of ${bet} CUTBAR`,'ok');
    const botNames=roomUsers.filter(u=>u.name!==starterName&&u.name!==myName).map(u=>u.name);
    botNames.forEach((name,i)=>{if(Math.random()>0.3){setTimeout(()=>{setRound(prev=>{if(!prev||prev.phase!=='joining')return prev;addGame(`✅ ${name} joined the round`,'join');return{...prev,pot:prev.pot+bet,players:[...prev.players,{name,hand:null,picked:null,elim:false}]};});},3000+i*2500+Math.random()*2000);}});
    startJoinCountdown(30,()=>{setRound(prev=>{if(!prev||prev.phase!=='joining')return prev;if(prev.players.length<2){addGame('❌ Not enough players. Round cancelled. Refunds issued.','warn');setMyBalance(b=>b+bet);return{...prev,phase:'done'};}return beginDealing(prev);});});
  },[myBalance,roomUsers,addGame,addPriv]);

  const joinRound=useCallback(()=>{
    const r=roundRef.current;if(!r||r.phase!=='joining'){addPriv('No active join phase');return;}
    if(r.players.find(p=>p.name===myName)){addPriv("You're already in the round");return;}
    if(myBalance<r.bet){addPriv('You do not have sufficient CUTBAR');return;}
    setMyBalance(b=>b-r.bet);setRound(prev=>prev?{...prev,pot:prev.pot+prev.bet,players:[...prev.players,{name:myName,hand:null,picked:null,elim:false}]}:prev);
    addGame(`✅ ${myName} joined the round`,'join');addPriv(`You joined the round`,'ok');
  },[myName,myBalance,addGame,addPriv]);

  const pickCard=useCallback((cardKey)=>{
    setRound(prev=>{
      if(!prev||prev.phase!=='picking')return prev;const me=prev.players.find(p=>p.name===myName&&!p.elim);if(!me||me.picked)return prev;
      const card=me.hand.find(c=>c.key===cardKey);if(!card)return prev;
      addGame(`🎴 ${myName} drew ${card.v}${card.s}`,'draw');
      const updated=prev.players.map(p=>p.name===myName?{...p,picked:card}:p);
      const active=updated.filter(p=>!p.elim);const allDone=active.every(p=>p.picked);
      if(allDone){clearInterval(pcRef.current);setPickCountdown(0);return resolveReveal({...prev,players:updated});}
      return{...prev,players:updated};
    });
  },[myName,addGame]);

  const sendChat=useCallback((raw)=>{
    const text=raw.trim().slice(0,600);if(!text)return;
    if(BANNED_USERS.has(myName)){addPriv("You cannot join — you are banned",'ban');return;}
    if(muted.has(myName)){addPriv('You have been muted','warn');return;}
    const kick=KICKED_USERS.get(myName);if(kick&&Date.now()<kick){const rem=Math.ceil((kick-Date.now())/1000);addPriv(`Kicked. Rejoin in: ${Math.floor(rem/60)}m ${rem%60}s`,'kick');return;}
    if(/(https?:\/\/|www\.|\.jpg|\.png|\.gif|\.mp4)/i.test(text)){addPriv('Attachments not allowed. Text & emoji only.','warn');return;}
    const lower=text.toLowerCase();
    if(lower.startsWith('/tip ')){const parts=text.split(/\s+/);const amt=parseInt(parts[1]);const target=(parts[2]||'').replace('@','');if(!target||isNaN(amt)||amt<=0){addPriv("Usage: /tip 50 @User123",'warn');return;}if(myBalance<amt){addPriv('Insufficient CUTBAR','warn');return;}setMyBalance(b=>b-amt);addGame(`💸 ${myName} tipped ${amt} CUTBAR to ${target}`,'tip');addPriv(`You tipped ${amt} CUTBAR to ${target}`,'ok');return;}
    if(lower.startsWith('/rain ')){const amt=parseInt(text.split(/\s+/)[1]);if(isNaN(amt)||amt<=0){addPriv("Usage: /rain 500",'warn');return;}if(myBalance<amt){addPriv('Insufficient CUTBAR','warn');return;}setMyBalance(b=>b-amt);const count=roomUsers.length;const share=Math.floor(amt/count);addGame(`🌧 ${myName} poured a rain of ${amt} CUTBAR — ${share} each for ${count} users!`,'rain');addPriv(`You made it rain! 🌧`,'ok');return;}
    if(lower.startsWith('/gift ')){const parts=text.split(/\s+/);const gk=(parts[1]||'').toUpperCase();const target=(parts[2]||'').replace('@','');const gift=GIFTS[gk];if(!gift||!target){addPriv(`Usage: /gift rose @User`,'warn');return;}if(myBalance<gift.cost){addPriv(`Need ${gift.cost.toLocaleString()} CUTBAR for ${gift.name}`,'warn');return;}setMyBalance(b=>b-gift.cost);addGame(`${gift.emoji} ${myName} gifted ${target} a ${gift.name} worth ${gift.cost.toLocaleString()} CUTBAR ❤️`,'gift');addPriv(gift.msg(myName),'gift');return;}
    addPub(myName,text);
  },[myName,myBalance,muted,roomUsers,addGame,addPriv,addPub]);

  return {myName,myBalance,roomUsers,muted,chatMsgs,round,joinCountdown,pickCountdown,startRound,joinRound,pickCard,sendChat};
}

// ── ChatroomNavBar ──────────────────────────────────────────
function ChatroomNavBar({history=[],commentary=[],users=[]}) {
  const [panel,setPanel]=useState(null);
  const toggle=p=>setPanel(prev=>prev===p?null:p);
  return(
    <div style={{flexShrink:0}}>
      <div style={{display:'flex',background:'rgba(0,0,0,.35)',backdropFilter:'blur(12px)',borderBottom:'1px solid var(--b)'}}>
        {[['history','📋','History'],['commentary','🎙','Commentary'],['users','👥','Users']].map(([id,ic,lb])=>(
          <button key={id} onClick={()=>toggle(id)} style={{flex:1,padding:'7px 4px',background:panel===id?'rgba(0,255,65,.12)':'transparent',border:'none',borderBottom:panel===id?'2px solid var(--g)':'2px solid transparent',color:panel===id?'var(--g)':'var(--td)',fontSize:10,fontFamily:'var(--body)',fontWeight:700,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
            <span style={{fontSize:14}}>{ic}</span><span>{lb}</span>
          </button>
        ))}
      </div>
      {panel&&(
        <div style={{background:'var(--panel)',borderBottom:'1px solid var(--bb)',maxHeight:220,overflowY:'auto',padding:'10px 14px'}}>
          {panel==='history'&&(<div>
            <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:8}}>WIN / LOSS HISTORY</div>
            {history.length===0&&<div style={{fontSize:11,color:'var(--td)',textAlign:'center',padding:'10px 0'}}>No rounds played yet.</div>}
            {history.map((h,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:i<history.length-1?'1px solid var(--b)':'none'}}>
                <div style={{display:'flex',gap:8,alignItems:'center'}}><span style={{fontSize:14}}>{h.won?'🏆':'💀'}</span><div><div style={{fontSize:11,fontWeight:700,color:h.won?'var(--g)':'var(--red)'}}>{h.label}</div><div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>{h.t}</div></div></div>
                <span style={{fontSize:12,color:h.won?'var(--g)':'var(--red)',fontFamily:'var(--mono)',fontWeight:700,alignSelf:'center'}}>{h.won?'+':''}{h.delta} CUTBAR</span>
              </div>
            ))}
          </div>)}
          {panel==='commentary'&&(<div>
            <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:8}}>ROUND COMMENTARY</div>
            {commentary.length===0&&<div style={{fontSize:11,color:'var(--td)',textAlign:'center',padding:'10px 0'}}>No commentary yet.</div>}
            {commentary.map((c,i)=>(
              <div key={i} style={{padding:'6px 0',borderBottom:i<commentary.length-1?'1px solid var(--b)':'none'}}>
                <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:2}}>{c.round}</div>
                <div style={{fontSize:11,color:'var(--text)',lineHeight:1.6}}>{c.text}</div>
              </div>
            ))}
          </div>)}
          {panel==='users'&&(<div>
            <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:8}}>{users.length} USERS IN ROOM</div>
            {users.map((u,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 0',borderBottom:i<users.length-1?'1px solid var(--b)':'none'}}>
                <div style={{width:28,height:28,borderRadius:'50%',background:'rgba(0,255,65,.1)',border:'1px solid var(--bb)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>{u.avatar||'👤'}</div>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:u.isMe?'var(--g)':'var(--text)'}}>{u.name}{u.isMe?' (You)':''}</div><div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>{u.status||'online'}</div></div>
                {u.isMod&&<Bx color="cyan" style={{fontSize:7}}>MOD</Bx>}
                {u.isPlayer&&<Bx color="orange" style={{fontSize:7}}>PLAYER</Bx>}
              </div>
            ))}
          </div>)}
        </div>
      )}
    </div>
  );
}

// ── RoomChat ────────────────────────────────────────────────
function RoomChat({msgs,myName,onSend,inputDisabled,myBalance=5000,navHistory=[],navCommentary=[],navUsers=[],bet=50,onBetChange}){
  const [input,setInput]=useState('');const [showMarketplace,setShowMarketplace]=useState(false);
  const [navPanel,setNavPanel]=useState(null);const [showBetSelector,setShowBetSelector]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'});},[msgs]);
  const send=()=>{if(!input.trim())return;onSend(input);setInput('');};
  const MSG_STYLE={
    normal:{bg:'rgba(0,229,255,.06)',border:'rgba(0,229,255,.15)',color:'var(--cyan)'},
    game:  {bg:'rgba(0,255,65,.06)', border:'rgba(0,255,65,.15)', color:'var(--g)'},
    warn:  {bg:'rgba(255,59,92,.07)',border:'rgba(255,59,92,.2)', color:'var(--red)'},
    ok:    {bg:'rgba(0,255,65,.1)',  border:'rgba(0,255,65,.25)', color:'var(--g)'},
    start: {bg:'rgba(255,122,0,.1)', border:'rgba(255,122,0,.3)', color:'var(--orange)'},
    join:  {bg:'rgba(0,255,65,.07)', border:'rgba(0,255,65,.2)',  color:'var(--g)'},
    deal:  {bg:'rgba(153,69,255,.1)',border:'rgba(153,69,255,.3)',color:'#b57aff'},
    draw:  {bg:'rgba(255,215,0,.07)',border:'rgba(255,215,0,.2)', color:'var(--gold)'},
    out:   {bg:'rgba(255,59,92,.1)', border:'rgba(255,59,92,.3)', color:'var(--red)'},
    win:   {bg:'rgba(255,215,0,.15)',border:'rgba(255,215,0,.4)', color:'var(--gold)'},
    tie:   {bg:'rgba(255,122,0,.1)', border:'rgba(255,122,0,.3)', color:'var(--orange)'},
    tip:   {bg:'rgba(0,229,255,.08)',border:'rgba(0,229,255,.2)', color:'var(--cyan)'},
    rain:  {bg:'rgba(0,229,255,.1)', border:'rgba(0,229,255,.3)', color:'var(--cyan)'},
    gift:  {bg:'rgba(255,215,0,.12)',border:'rgba(255,215,0,.35)',color:'var(--gold)'},
    ban:   {bg:'rgba(255,59,92,.12)',border:'rgba(255,59,92,.35)',color:'var(--red)'},
    kick:  {bg:'rgba(255,59,92,.08)',border:'rgba(255,59,92,.25)',color:'var(--red)'},
  };
  return(
    <div style={{display:'flex',flexDirection:'column',flex:1,minHeight:0,position:'relative'}}>
      {navPanel&&(
        <div style={{position:'absolute',top:0,left:0,right:0,zIndex:50,background:'rgba(0,0,0,.88)',backdropFilter:'blur(16px)',borderBottom:'1px solid var(--bb)',maxHeight:'55%',display:'flex',flexDirection:'column'}}>
          <div style={{display:'flex',borderBottom:'1px solid var(--b)',flexShrink:0}}>
            {[['history','📋','History'],['commentary','🎙','Commentary'],['users','👥','Users']].map(([id,ic,lb])=>(
              <button key={id} onClick={()=>setNavPanel(p=>p===id?null:id)} style={{flex:1,padding:'8px 4px',background:navPanel===id?'rgba(0,255,65,.1)':'transparent',border:'none',borderBottom:`2px solid ${navPanel===id?'var(--g)':'transparent'}`,color:navPanel===id?'var(--g)':'var(--td)',fontSize:9,fontFamily:'var(--body)',fontWeight:700,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                <span style={{fontSize:13}}>{ic}</span><span>{lb}</span>
              </button>
            ))}
            <button onClick={()=>setNavPanel(null)} style={{padding:'8px 12px',background:'transparent',border:'none',color:'var(--td)',fontSize:16,cursor:'pointer'}}>✕</button>
          </div>
          <div style={{flex:1,overflowY:'auto',padding:'10px 14px'}}>
            {navPanel==='history'&&(navHistory.length===0?<div style={{fontSize:10,color:'var(--td)',textAlign:'center',padding:'16px 0'}}>No rounds played yet.</div>:navHistory.map((h,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid var(--b)'}}><div style={{fontSize:11,color:h.won?'var(--g)':'var(--red)'}}>{h.won?'🏆':'💀'} {h.label}</div><span style={{fontSize:11,color:h.won?'var(--g)':'var(--red)',fontFamily:'var(--mono)'}}>{h.won?'+':''}{h.delta}</span></div>))}
            {navPanel==='users'&&((navUsers||[]).length===0?<div style={{fontSize:10,color:'var(--td)',textAlign:'center',padding:'16px 0'}}>No users.</div>:(navUsers||[]).map((u,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 0',borderBottom:'1px solid var(--b)'}}><div style={{width:26,height:26,borderRadius:'50%',background:'rgba(0,255,65,.1)',border:'1px solid var(--bb)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13}}>{u.avatar||'👤'}</div><div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,color:u.isMe?'var(--g)':'var(--text)'}}>{u.name}{u.isMe?' (You)':''}</div></div>{u.isMod&&<Bx color="cyan" style={{fontSize:7}}>MOD</Bx>}</div>))}
          </div>
        </div>
      )}
      {showBetSelector&&onBetChange&&(
        <div style={{position:'absolute',top:0,left:0,right:0,zIndex:49,background:'rgba(0,0,0,.85)',backdropFilter:'blur(12px)',borderBottom:'1px solid var(--bb)',padding:'12px 14px'}}>
          <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:8}}>SELECT BET AMOUNT</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
            {[25,50,100,250,500,1000].map(b=>(
              <div key={b} onClick={()=>{onBetChange(b);setShowBetSelector(false);}} style={{padding:'6px 12px',borderRadius:8,border:`1px solid ${bet===b?'var(--g)':'var(--b)'}`,background:bet===b?'rgba(0,255,65,.15)':'var(--bg3)',color:bet===b?'var(--g)':'var(--td)',fontSize:10,fontFamily:'var(--mono)',fontWeight:700,cursor:'pointer'}}>🐑 {b}</div>
            ))}
          </div>
          <button onClick={()=>setShowBetSelector(false)} style={{padding:'5px 14px',borderRadius:8,background:'transparent',border:'1px solid var(--b)',color:'var(--td)',fontSize:10,cursor:'pointer'}}>Close</button>
        </div>
      )}
      <GiftMarketplace open={showMarketplace} onClose={()=>setShowMarketplace(false)} onSend={cmd=>onSend(cmd)} balance={myBalance}/>
      <div style={{flex:1,overflowY:'auto',padding:'8px 12px',display:'flex',flexDirection:'column',gap:4}}>
        {msgs.map((m,i)=>{
          if(m.type==='sys'||m.type==='game'){
            const s=MSG_STYLE[m.style||'normal']||MSG_STYLE.normal;
            return(<div key={m.id||i} style={{alignSelf:'center',maxWidth:'95%',padding:'4px 11px',borderRadius:12,background:s.bg,border:`1px solid ${s.border}`,textAlign:'center',margin:'1px 0'}}>
              <span style={{fontSize:10,color:s.color,fontFamily:'var(--mono)',lineHeight:1.4}}>{m.text}</span>
              {m.t&&<span style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',opacity:.6,marginLeft:6}}>{m.t}</span>}
            </div>);
          }
          if(m.type==='priv'){
            const s=MSG_STYLE[m.style||'warn']||MSG_STYLE.warn;
            return(<div key={m.id||i} style={{alignSelf:'flex-end',maxWidth:'88%',padding:'5px 10px',borderRadius:'13px 3px 13px 13px',background:s.bg,border:`1px solid ${s.border}`}}>
              <span style={{fontSize:10,color:s.color,fontFamily:'var(--mono)'}}>🔒 {m.text}</span>
            </div>);
          }
          if(m.type==='pub'){const isMe=m.user===myName;return(
            <div key={m.id||i} style={{alignSelf:isMe?'flex-end':'flex-start',maxWidth:'80%',display:'flex',flexDirection:'column',gap:1}}>
              {!isMe&&<span style={{fontSize:9,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700,paddingLeft:4}}>{m.user}</span>}
              <div style={{padding:'6px 10px',borderRadius:isMe?'13px 3px 13px 13px':'3px 13px 13px 13px',background:isMe?'rgba(0,255,65,.12)':'var(--panel2)',border:'1px solid '+(isMe?'rgba(0,255,65,.2)':'var(--b)'),color:isMe?'var(--g)':'var(--text)',fontSize:11,display:'flex',flexWrap:'wrap',gap:6,alignItems:'flex-end'}}>
                <span style={{flex:1}}>{m.text}</span>
                {m.t&&<span style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',opacity:.7,flexShrink:0,lineHeight:1.8}}>{m.t}</span>}
              </div>
            </div>
          );}
          return null;
        })}
        <div ref={endRef}/>
      </div>
      <div style={{display:'flex',gap:4,padding:'4px 10px 2px',overflowX:'auto',borderTop:'1px solid var(--b)',flexShrink:0,alignItems:'center'}}>
        {[['history','📋'],['commentary','🎙'],['users','👥']].map(([id,ic])=>(
          <div key={id} onClick={()=>setNavPanel(p=>p===id?null:id)} style={{flexShrink:0,width:26,height:26,borderRadius:8,border:`1px solid ${navPanel===id?'var(--g)':'var(--b)'}`,background:navPanel===id?'rgba(0,255,65,.1)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,cursor:'pointer'}}>{ic}</div>
        ))}
        <div style={{width:1,background:'var(--b)',height:16,flexShrink:0,margin:'0 2px'}}/>
        {onBetChange&&<div onClick={()=>setShowBetSelector(s=>!s)} style={{flexShrink:0,padding:'3px 8px',borderRadius:10,border:`1px solid ${showBetSelector?'var(--g)':'var(--bb)'}`,background:'rgba(0,255,65,.05)',color:'var(--g)',fontSize:9,cursor:'pointer',fontFamily:'var(--mono)',fontWeight:700,whiteSpace:'nowrap'}}>🐑 {bet}</div>}
        <div style={{width:1,background:'var(--b)',height:16,flexShrink:0,margin:'0 2px'}}/>
        {['/rain 100','/tip 50 @User'].map(c=><div key={c} onClick={()=>setInput(c)} style={{flexShrink:0,padding:'3px 7px',borderRadius:10,border:'1px solid var(--bb)',background:'rgba(0,255,65,.04)',color:'var(--td)',fontSize:8,cursor:'pointer',fontFamily:'var(--mono)',whiteSpace:'nowrap'}}>{c}</div>)}
        <div onClick={()=>setShowMarketplace(true)} style={{flexShrink:0,padding:'3px 9px',borderRadius:10,border:'1px solid rgba(255,215,0,.3)',background:'rgba(255,215,0,.07)',color:'var(--gold)',fontSize:9,cursor:'pointer',fontFamily:'var(--mono)',fontWeight:700}}>🎁</div>
      </div>
      <div style={{display:'flex',gap:8,padding:'6px 10px 10px',background:'var(--bg)',borderTop:'1px solid var(--b)',flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value.slice(0,600))} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()} disabled={inputDisabled}
          placeholder={inputDisabled?'You are muted':'Message...'}
          style={{flex:1,background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--body)',fontSize:12,borderRadius:22,padding:'8px 14px',outline:'none',opacity:inputDisabled?.5:1}}/>
        <button onClick={send} disabled={inputDisabled} style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,var(--g2),var(--g))',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,opacity:inputDisabled?.4:1}}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M1 8L13 2L9 8M13 2L9 14L9 8" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

// ── GameBoard ────────────────────────────────────────────────
function GameBoard({round,myName,onPick,pickCountdown}){
  if(!round||['idle','done','joining'].includes(round.phase)) return null;
  const me=round.players.find(p=>p.name===myName);
  const active=round.players.filter(p=>!p.elim);
  const isPlayer=!!me&&!me.elim;
  return(
    <div style={{background:'var(--panel)',borderBottom:'1px solid var(--b)',flexShrink:0}}>
      <div style={{display:'flex',gap:0,overflowX:'auto',borderBottom:'1px solid var(--b)'}}>
        {round.players.map(p=>{
          const isOut=p.elim;const hasPicked=!!p.picked;
          return(
            <div key={p.name} style={{flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',gap:2,padding:'6px 10px',borderRight:'1px solid var(--b)',opacity:isOut?.35:1,minWidth:64}}>
              <div style={{fontSize:20,filter:isOut?'grayscale(1)':'none'}}>{isOut?'💀':'🎴'}</div>
              <span style={{fontSize:9,color:p.name===myName?'var(--g)':'var(--td)',fontFamily:'var(--mono)',fontWeight:700,maxWidth:56,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name===myName?'YOU':p.name.split('_')[0]}</span>
              {!isOut&&<div style={{width:8,height:8,borderRadius:'50%',background:hasPicked?'var(--g)':'var(--b)',transition:'background .3s',boxShadow:hasPicked?'0 0 6px var(--g)':'none'}}/>}
              {p.picked&&<span style={{fontSize:11,fontFamily:'var(--mono)',color:p.picked.s==='♥'||p.picked.s==='♦'?'#ff8888':'var(--text)',fontWeight:800}}>{p.picked.v}{p.picked.s}</span>}
            </div>
          );
        })}
      </div>
      {isPlayer&&me.hand&&!me.picked&&(round.phase==='picking'||round.phase==='tiebreak')&&(
        <div style={{padding:'10px 12px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2}}>PICK YOUR CARD</span>
            <span style={{fontSize:12,color:pickCountdown<=2?'var(--red)':'var(--gold)',fontFamily:'var(--mono)',fontWeight:800}}>{pickCountdown}s</span>
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'center'}}>
            {me.hand.map((card,i)=>(
              <div key={card.key} onClick={()=>onPick(card.key)}
                style={{width:46,height:68,borderRadius:10,background:'linear-gradient(135deg,#0a2010,#071209)',border:'2px solid var(--bb)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0,transition:'all .2s',boxShadow:'0 4px 12px rgba(0,0,0,.4)',position:'relative',overflow:'hidden'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-8px)';e.currentTarget.style.borderColor='var(--g)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='var(--bb)';}}>
                <div style={{position:'absolute',inset:3,borderRadius:7,background:'repeating-linear-gradient(45deg,rgba(0,255,65,.04) 0px,rgba(0,255,65,.04) 2px,transparent 2px,transparent 8px)',border:'1px solid rgba(0,255,65,.08)'}}/>
                <span style={{fontSize:22,position:'relative',zIndex:1}}>🃏</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {isPlayer&&me.picked&&(
        <div style={{padding:'10px 14px',display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:46,height:68,borderRadius:10,background:'rgba(0,255,65,.1)',border:'2px solid var(--g)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <span style={{fontSize:16,fontWeight:800,color:me.picked.s==='♥'||me.picked.s==='♦'?'#ff8888':'var(--text)',fontFamily:'var(--mono)'}}>{me.picked.v}</span>
            <span style={{fontSize:20,color:me.picked.s==='♥'||me.picked.s==='♦'?'#ff8888':'var(--text)'}}>{me.picked.s}</span>
          </div>
          <span style={{fontSize:12,color:'var(--td)',fontFamily:'var(--mono)'}}>Waiting for others...</span>
        </div>
      )}
      {!isPlayer&&<div style={{padding:'8px 14px',textAlign:'center'}}><span style={{fontSize:11,color:'var(--td)',fontFamily:'var(--mono)'}}>👁 Watching · {active.length} players remaining</span></div>}
    </div>
  );
}

// ── LowCardRoomPage ──────────────────────────────────────────
export default function LowCardRoomPage({onBack}){
  const MY_NAME='You';
  const eng=useLowCardEngine(MY_NAME);
  const [betInput,setBetInput]=useState('50');
  const [showStart,setShowStart]=useState(false);
  const [roundHistory,setRoundHistory]=useState([]);
  const [roundCommentary,setRoundCommentary]=useState([]);

  useEffect(()=>{
    const last=eng.chatMsgs[eng.chatMsgs.length-1];if(!last)return;
    if(last.style==='win'&&last.text?.includes('won'))setRoundHistory(h=>[{won:true,label:'You won the round',delta:0,t:last.t},...h.slice(0,19)]);
    if(last.style==='out'&&last.text?.includes('You'))setRoundHistory(h=>[{won:false,label:'Eliminated this round',delta:0,t:last.t},...h.slice(0,19)]);
    if(last.type==='game'&&(last.style==='draw'||last.style==='out'||last.style==='win'))setRoundCommentary(c=>[{round:'Round '+((eng.round?.round)||1),text:last.text,t:last.t},...c.slice(0,49)]);
  },[eng.chatMsgs]);

  const canStart=!eng.round||(eng.round.phase==='done'||eng.round.phase==='idle');
  const inJoinPhase=eng.round&&eng.round.phase==='joining';
  const alreadyIn=inJoinPhase&&eng.round.players.find(p=>p.name===MY_NAME);
  const roomUsers=eng.roomUsers.map(u=>({name:u.name,isMe:u.name===MY_NAME,isMod:u.isMod,avatar:AVATARS_G[u.name]||'👤',isPlayer:eng.round&&eng.round.players.some(p=>p.name===u.name&&!p.elim),status:eng.muted.has(u.name)?'muted':'online'}));

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'var(--bg)',maxWidth:480,margin:'0 auto',position:'relative'}}>
      <div style={{display:'flex',alignItems:'center',padding:'8px 12px',borderBottom:'1px solid var(--bb)',background:'var(--header)',flexShrink:0,gap:10}}>
        <div onClick={onBack} style={{width:32,height:32,borderRadius:9,background:'rgba(0,0,0,.18)',border:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,color:'var(--text)'}}>🃏 LowCardOut</div><div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>{eng.roomUsers.length} in room · Lowest card OUT</div></div>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <span style={{fontSize:9,color:'var(--gold)',fontFamily:'var(--mono)',fontWeight:700}}>🐑 {eng.myBalance.toLocaleString()}</span>
          {inJoinPhase&&<div style={{padding:'3px 8px',borderRadius:10,background:'rgba(255,122,0,.15)',border:'1px solid rgba(255,122,0,.3)'}}><span style={{fontSize:10,color:'var(--orange)',fontFamily:'var(--mono)',fontWeight:700}}>JOIN {eng.joinCountdown}s</span></div>}
          {eng.round&&eng.round.phase==='picking'&&<div style={{padding:'3px 8px',borderRadius:10,background:'rgba(255,59,92,.15)',border:'1px solid rgba(255,59,92,.3)'}}><span style={{fontSize:10,color:'var(--red)',fontFamily:'var(--mono)',fontWeight:700}}>PICK {eng.pickCountdown}s</span></div>}
        </div>
      </div>

      <GameBoard round={eng.round} myName={MY_NAME} onPick={eng.pickCard} pickCountdown={eng.pickCountdown}/>

      {inJoinPhase&&!alreadyIn&&(
        <div style={{position:'absolute',inset:0,zIndex:50,background:'rgba(0,0,0,.8)',backdropFilter:'blur(8px)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}}>
          <div style={{width:'100%',maxWidth:340,background:'var(--panel)',borderRadius:20,border:'1px solid rgba(255,122,0,.4)',overflow:'hidden',boxShadow:'0 20px 60px rgba(255,122,0,.2)'}}>
            <div style={{background:'linear-gradient(135deg,rgba(255,122,0,.2),rgba(255,122,0,.05))',padding:'28px 24px 20px',textAlign:'center',borderBottom:'1px solid rgba(255,122,0,.2)'}}>
              <div style={{fontSize:52,marginBottom:8,animation:'float 3s ease-in-out infinite'}}>🃏</div>
              <div style={{fontSize:22,fontWeight:800,color:'#ff7a00',marginBottom:4}}>Join the Thrill!</div>
              <div style={{fontSize:13,color:'var(--td)',lineHeight:1.6}}>A new round has begun.<br/>Lowest card gets knocked out each round.</div>
            </div>
            <div style={{padding:'16px 20px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <div style={{textAlign:'center',flex:1}}><div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:3}}>STARTED BY</div><div style={{fontSize:13,fontWeight:700}}>{eng.round.startedBy}</div></div>
                <div style={{textAlign:'center',flex:1}}><div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:3}}>BET</div><div style={{fontSize:13,fontWeight:700,color:'var(--g)'}}>🐑 {eng.round.bet}</div></div>
                <div style={{textAlign:'center',flex:1}}><div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:3}}>TIME LEFT</div><div style={{fontSize:13,fontWeight:800,color:eng.joinCountdown<=10?'var(--red)':'var(--orange)'}}>{eng.joinCountdown}s</div></div>
              </div>
              <button onClick={eng.joinRound} style={{width:'100%',padding:'14px',borderRadius:12,background:'linear-gradient(135deg,#cc5500,#ff7a00)',border:'none',color:'#000',fontSize:15,fontWeight:800,cursor:'pointer',boxShadow:'0 6px 20px rgba(255,122,0,.4)',letterSpacing:.5}}>
                🔥 JOIN NOW — 🐑 {eng.round.bet} CUTBAR
              </button>
            </div>
          </div>
        </div>
      )}

      {canStart&&(
        <div style={{padding:'8px 12px',borderBottom:'1px solid var(--b)',flexShrink:0}}>
          {!showStart?(
            <button onClick={()=>setShowStart(true)} style={{width:'100%',padding:'9px',borderRadius:10,background:'rgba(0,255,65,.08)',border:'1px solid var(--bb)',color:'var(--g)',fontFamily:'var(--display)',fontSize:13,letterSpacing:.5,cursor:'pointer'}}>+ START NEW ROUND</button>
          ):(
            <div>
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
                <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',flexShrink:0}}>BET</span>
                <input type="number" min="1" max="1000" value={betInput} onChange={e=>setBetInput(e.target.value)} style={{flex:1,background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:13,borderRadius:9,padding:'7px 10px',outline:'none'}}/>
                <button onClick={()=>{eng.startRound(parseInt(betInput)||50,MY_NAME);setShowStart(false);}} style={{padding:'7px 14px',borderRadius:9,background:'linear-gradient(135deg,var(--g2),var(--g))',border:'none',color:'#000',fontFamily:'var(--display)',fontSize:12,cursor:'pointer',flexShrink:0}}>GO</button>
                <button onClick={()=>setShowStart(false)} style={{padding:'7px 10px',borderRadius:9,background:'transparent',border:'1px solid var(--b)',color:'var(--td)',fontSize:11,cursor:'pointer',flexShrink:0}}>✕</button>
              </div>
              <div style={{display:'flex',gap:5}}>
                {[1,10,50,100,250,500,1000].map(b=>(
                  <div key={b} onClick={()=>setBetInput(String(b))} style={{flex:1,padding:'5px 2px',textAlign:'center',borderRadius:7,background:betInput===String(b)?'rgba(0,255,65,.15)':'var(--bg3)',border:'1px solid '+(betInput===String(b)?'var(--bb)':'var(--b)'),color:betInput===String(b)?'var(--g)':'var(--td)',fontSize:9,fontFamily:'var(--mono)',cursor:'pointer',fontWeight:700}}>{b}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <RoomChat
        msgs={eng.chatMsgs} myName={MY_NAME} onSend={eng.sendChat}
        inputDisabled={eng.muted.has(MY_NAME)} myBalance={eng.myBalance}
        navHistory={roundHistory} navCommentary={roundCommentary} navUsers={roomUsers}
        bet={betInput?parseInt(betInput)||50:50} onBetChange={b=>setBetInput(String(b))}
      />
    </div>
  );
}
