/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { BackBar, Bx, Btn } from '../components/primitives';
import { PnlBar, LowCardOutGame, DiceCricketGame, PenaltyShootoutGame, BotKabaddiGame, BlindArcherGame, CutbarJungGame, KokarFightGame, TaekwondoGame } from '../components/GameEngines';
import { EightBallGame } from '../components/EightBallGame';
import LowCardRoomPage from '../components/LowCardRoomPage';
import { tNow, drawRandCard, AVATARS_G } from '../features/games/gameHelpers';
import { GIFTS, GiftMarketplace } from '../features/games/gifts';

// ═══════════════════════════════════════════════════════════
// CUTPLAY PAGE
// ═══════════════════════════════════════════════════════════
export function CutPlayPage({toast,onBack}){
  const [screen,setScreen]=useState('lobby');
  const [selectedRoom,setSelectedRoom]=useState(null);
  const [bet,setBet]=useState(50);
  const [balance,setBalance]=useState(5000);
  const [pnl,setPnl]=useState(0);
  const [showBet,setShowBet]=useState(false);

  const rooms=[
    {id:'lowcard',  icon:'🃏',name:'LowCardOut',       desc:'Lowest card each round is eliminated',   players:12,minBet:25, color:'#ff7a00',tag:'LIVE',    win:32,risk:68, tip:'Aces HIGH. Last player standing wins pot minus 4% fee.'},
    {id:'laststand',icon:'⚔️',name:'Last Standing',    desc:'Text-command chatroom battle royale',    players:8, minBet:5,  color:'#9945ff',tag:'CHATROOM',win:22,risk:78, tip:'!start · !j · !d — Lowest card out each round. 4% fee.'},
    {id:'dice',     icon:'🎲',name:'T10 Dice Cricket', desc:'Roll dice · 5=wicket · 6=six',            players:8, minBet:50, color:'#00e5ff',tag:'LIVE',    win:38,risk:62, tip:'You bat first — bot chases. 5=wicket, 6=six!'},
    {id:'8ball',    icon:'🎱',name:'8Ball Cricket',     desc:'Predict every ball of the over',          players:6, minBet:25, color:'#b44fff',tag:'HOT 🔥', win:28,risk:72, tip:'5+ correct = profit. 7+ = big win. 8/8 = ×50!'},
    {id:'penalty',  icon:'🥅',name:'Penalty Shootout', desc:'Pick Left / Centre / Right — 5 kicks',   players:18,minBet:25, color:'#ffd700',tag:'JACKPOT', win:35,risk:65, tip:'5 rounds · Sudden death on tie · 5/5 = ×5 JACKPOT!'},
    {id:'kabaddi',  icon:'🤸',name:'Bot Kabaddi',       desc:'Raid, tag, escape — reverse kabaddi',    players:14,minBet:25, color:'#00cc88',tag:'BETA',    win:30,risk:70, tip:'Win 5 raids = ×3 JACKPOT! Every move has risk.'},
    {id:'archer',   icon:'🏹',name:'Blind Archer',      desc:'Feel the wind — angle + power = score',  players:10,minBet:50, color:'#ffd700',tag:'SKILL',   win:26,risk:74, tip:'Score ≥300 for ×2 · ≥400 = ×4 · Wind shifts ±15°.'},
    {id:'jung',     icon:'🐑',name:'Cutbar Jung',       desc:'Your 🐑 vs Bot 🐑 — Horn Battle',        players:11,minBet:25, color:'#ff7a00',tag:'FIGHT',   win:40,risk:60, tip:'Reduce bot HP to 0 first. Win=×2. Draw=refund.'},
    {id:'kokar',    icon:'🐓',name:'Kokar Fight',       desc:'Cockfight — CLAW > PECK > DODGE > CLAW', players:9, minBet:25, color:'#ff3b5c',tag:'BRUTAL',  win:33,risk:67, tip:'First to 5 rounds wins ×2.5! Pure instinct game.'},
    {id:'taekwondo',icon:'🥋',name:'Taekwondo',         desc:'Kung Fu + Martial Arts · 3 round match',  players:7, minBet:50, color:'#9945ff',tag:'LIVE',    win:25,risk:75, tip:'Win 2 rounds · Perfect 3/3 = ×4! Manage stamina.'},
  ];

  const handlePnl=(delta)=>{setPnl(p=>p+delta);setBalance(b=>b+delta);};

  const [filter,setFilter]=useState('all');
  const [instantJoin,setInstantJoin]=useState(false);
  const FILTERS=[['all','All'],['popular','🔥 Popular'],['highwin','💰 High Win'],['highrisk','⚠️ High Risk'],['new','🆕 New']];
  const filteredRooms=useMemo(()=>{
    let r=[...rooms];
    if(filter==='popular') r=r.sort((a,b)=>b.players-a.players);
    else if(filter==='highwin') r=r.sort((a,b)=>b.win-a.win);
    else if(filter==='highrisk') r=r.sort((a,b)=>b.risk-a.risk);
    else if(filter==='new') r=r.filter(x=>['kabaddi','archer','kokar','taekwondo'].includes(x.id));
    return r;
  },[filter]);
  const featured=rooms[0]; // LowCardOut is always featured

  // LOBBY
  if(screen==='lobby') return(
    <div className="fu" style={{paddingBottom:80}}>
      <BackBar title="cutPlay 🎮" onBack={onBack} right={<span style={{fontSize:9,color:'var(--gold)',fontFamily:'var(--mono)',fontWeight:700,whiteSpace:'nowrap'}}>🐑 {balance.toLocaleString()}</span>}/>
      {pnl!==0&&<PnlBar pnl={pnl}/>}

      {/* ── FEATURED GAME ── */}
      <div onClick={()=>{setBet(Math.max(bet,featured.minBet));setSelectedRoom(featured);setScreen('pregame');}}
        style={{margin:'8px 14px 10px',padding:'14px',background:`linear-gradient(135deg,${featured.color}18,${featured.color}06)`,border:`2px solid ${featured.color}60`,borderRadius:16,cursor:'pointer',position:'relative',overflow:'hidden',boxShadow:`0 0 24px ${featured.color}20`}}>
        <div style={{position:'absolute',right:8,top:8,fontSize:8,fontFamily:'var(--mono)',fontWeight:800,color:featured.color,background:featured.color+'20',border:`1px solid ${featured.color}40`,borderRadius:20,padding:'2px 8px',letterSpacing:1}}>🔥 FEATURED BATTLE</div>
        <div style={{position:'absolute',right:-10,bottom:-10,fontSize:60,opacity:.08,pointerEvents:'none'}}>{featured.icon}</div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:54,height:54,borderRadius:14,background:featured.color+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,border:`2px solid ${featured.color}50`,flexShrink:0,boxShadow:`0 0 14px ${featured.color}40`}}>{featured.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:800,color:'var(--text)',marginBottom:3}}>{featured.name}</div>
            <div style={{fontSize:10,color:'var(--td)',marginBottom:6}}>{featured.desc}</div>
            <div style={{display:'flex',gap:6,alignItems:'center'}}>
              <div style={{width:5,height:5,borderRadius:'50%',background:featured.color,animation:'pulse 1s infinite'}}/>
              <span style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>{featured.players} online · min 🐑 {featured.minBet}</span>
            </div>
          </div>
          <div style={{padding:'10px 14px',borderRadius:10,background:`linear-gradient(135deg,${featured.color},${featured.color}aa)`,color:'#000',fontSize:11,fontWeight:900,flexShrink:0,fontFamily:'var(--mono)',boxShadow:`0 4px 12px ${featured.color}40`}}>PLAY NOW</div>
        </div>
        {/* Visual risk bars */}
        <div style={{marginTop:10,display:'flex',flexDirection:'column',gap:4}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:8,color:'var(--g)',fontFamily:'var(--mono)',width:24,flexShrink:0}}>WIN</span>
            <div style={{flex:1,height:5,background:'var(--bg3)',borderRadius:3}}><div style={{width:featured.win+'%',height:'100%',background:'linear-gradient(90deg,var(--g2),var(--g))',borderRadius:3,boxShadow:'0 0 4px rgba(0,255,65,.4)'}}/></div>
            <span style={{fontSize:8,color:'var(--g)',fontFamily:'var(--mono)',width:26,textAlign:'right',flexShrink:0}}>{featured.win}%</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:8,color:'var(--red)',fontFamily:'var(--mono)',width:24,flexShrink:0}}>RISK</span>
            <div style={{flex:1,height:5,background:'var(--bg3)',borderRadius:3}}><div style={{width:featured.risk+'%',height:'100%',background:'linear-gradient(90deg,#aa0022,var(--red))',borderRadius:3}}/></div>
            <span style={{fontSize:8,color:'var(--red)',fontFamily:'var(--mono)',width:26,textAlign:'right',flexShrink:0}}>{featured.risk}%</span>
          </div>
        </div>
      </div>

      {/* ── FILTERS + INSTANT JOIN ── */}
      <div style={{padding:'0 14px 8px'}}>
        <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:4,marginBottom:8}}>
          {FILTERS.map(([k,l])=>(
            <div key={k} onClick={()=>setFilter(k)}
              style={{flexShrink:0,padding:'5px 11px',borderRadius:20,border:`1px solid ${filter===k?'var(--bb)':'var(--b)'}`,background:filter===k?'rgba(0,255,65,.1)':'var(--panel)',fontSize:10,color:filter===k?'var(--g)':'var(--td)',cursor:'pointer',fontFamily:'var(--mono)',fontWeight:700,whiteSpace:'nowrap'}}>{l}</div>
          ))}
        </div>
        {/* Instant Join toggle */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 12px',background:'var(--panel)',border:`1px solid ${instantJoin?'var(--bb)':'var(--b)'}`,borderRadius:10,transition:'border-color .2s'}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:instantJoin?'var(--g)':'var(--text)'}}>⚡ Instant Join</div>
            <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>Auto-join next available round</div>
          </div>
          <div onClick={()=>setInstantJoin(v=>!v)}
            style={{width:46,height:24,borderRadius:12,background:instantJoin?'var(--g)':'var(--b)',position:'relative',cursor:'pointer',transition:'background .3s',border:'1px solid var(--bb)',flexShrink:0}}>
            <div style={{position:'absolute',top:3,left:instantJoin?22:3,width:16,height:16,borderRadius:'50%',background:instantJoin?'#000':'var(--td)',transition:'left .3s'}}/>
          </div>
        </div>
      </div>

      {/* ── GAME CARDS ── */}
      <div style={{display:'flex',flexDirection:'column',gap:8,padding:'0 14px 14px'}}>
        {filteredRooms.map(r=>(
          <div key={r.id} onClick={()=>{setBet(Math.max(bet,r.minBet));setSelectedRoom(r);setScreen('pregame');}}
            style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'13px 14px',cursor:'pointer',position:'relative',overflow:'hidden',transition:'all .2s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=r.color+'66';e.currentTarget.style.transform='translateY(-1px)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--b)';e.currentTarget.style.transform='none';}}>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 0% 50%,'+r.color+'0e,transparent 55%)',pointerEvents:'none'}}/>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
              <div style={{width:44,height:44,borderRadius:12,background:r.color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,border:'1px solid '+r.color+'30',flexShrink:0}}>{r.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginBottom:2}}>
                  <span style={{fontSize:13,fontWeight:800,color:'var(--text)',lineHeight:1.2}}>{r.name}</span>
                  <span style={{padding:'2px 6px',borderRadius:10,fontSize:8,fontWeight:700,fontFamily:'var(--mono)',background:r.color+'18',color:r.color,border:'1px solid '+r.color+'30',whiteSpace:'nowrap'}}>{r.tag}</span>
                </div>
                <div style={{fontSize:10,color:'var(--td)',lineHeight:1.4}}>{r.desc}</div>
              </div>
              <div style={{padding:'8px 12px',borderRadius:9,background:r.color+'22',border:'1px solid '+r.color+'44',fontSize:10,fontWeight:900,color:r.color,flexShrink:0,fontFamily:'var(--mono)',whiteSpace:'nowrap'}}>PLAY →</div>
            </div>
            {/* Visual risk bars */}
            <div style={{paddingLeft:56,display:'flex',flexDirection:'column',gap:3,marginBottom:6}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:7,color:'var(--g)',fontFamily:'var(--mono)',width:20,flexShrink:0}}>WIN</span>
                <div style={{flex:1,height:4,background:'var(--bg3)',borderRadius:2}}><div style={{width:r.win+'%',height:'100%',background:'linear-gradient(90deg,var(--g2),var(--g))',borderRadius:2}}/></div>
                <span style={{fontSize:7,color:'var(--g)',fontFamily:'var(--mono)',width:22,textAlign:'right',flexShrink:0}}>{r.win}%</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:7,color:'var(--red)',fontFamily:'var(--mono)',width:20,flexShrink:0}}>RISK</span>
                <div style={{flex:1,height:4,background:'var(--bg3)',borderRadius:2}}><div style={{width:r.risk+'%',height:'100%',background:'linear-gradient(90deg,#aa0022,var(--red))',borderRadius:2}}/></div>
                <span style={{fontSize:7,color:'var(--red)',fontFamily:'var(--mono)',width:22,textAlign:'right',flexShrink:0}}>{r.risk}%</span>
              </div>
            </div>
            <div style={{paddingLeft:56,display:'flex',alignItems:'center',gap:5}}>
              <div style={{width:5,height:5,borderRadius:'50%',background:'var(--g)',animation:'pulse 1.5s infinite'}}/>
              <span style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>{r.players} online</span>
              <Bx color="gold" style={{fontSize:7,marginLeft:4}}>min 🐑 {r.minBet}</Bx>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // PRE-GAME
  if(screen==='pregame'&&selectedRoom) return(
    <div className="fu">
      <BackBar title={selectedRoom.icon+' '+selectedRoom.name} onBack={()=>setScreen('lobby')} right={<Bx style={{fontSize:8,background:selectedRoom.color+'15',color:selectedRoom.color,borderColor:selectedRoom.color+'30'}}>{selectedRoom.tag}</Bx>}/>
      {/* Hero */}
      <div style={{margin:'8px 14px 0',padding:'10px 14px',background:'linear-gradient(135deg,'+selectedRoom.color+'10,transparent)',border:'1px solid '+selectedRoom.color+'25',borderRadius:12,display:'flex',alignItems:'center',gap:10}}>
        <span style={{fontSize:32,flexShrink:0}}>{selectedRoom.icon}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:12,color:'var(--td)',marginBottom:3}}>{selectedRoom.desc}</div>
          <div style={{fontSize:11,color:selectedRoom.color,fontFamily:'var(--mono)',opacity:.9,marginBottom:6}}>💡 {selectedRoom.tip}</div>
          <div style={{display:'flex',gap:6}}>
            <span style={{padding:'3px 9px',borderRadius:8,background:'rgba(0,255,65,.12)',border:'1px solid rgba(0,255,65,.3)',fontSize:9,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:800}}>✅ WIN {selectedRoom.win}%</span>
            <span style={{padding:'3px 9px',borderRadius:8,background:'rgba(255,59,92,.1)',border:'1px solid rgba(255,59,92,.28)',fontSize:9,color:'var(--red)',fontFamily:'var(--mono)',fontWeight:800}}>⚠️ RISK {selectedRoom.risk}%</span>
          </div>
        </div>
      </div>

      {/* Game rules */}
      <div style={{margin:'10px 14px 0',padding:14,background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14}}>
        <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:8}}>GAME RULES</div>
        {selectedRoom.id==='lowcard'&&<div style={{fontSize:11,color:'var(--text)',lineHeight:1.9}}>
          🃏 Each player picks 1 card per round<br/>
          💀 Player with the <span style={{color:'var(--red)',fontWeight:700}}>lowest card</span> is eliminated<br/>
          👑 Aces are HIGH · Suits never matter<br/>
          🏆 Last player standing wins the full pot<br/>
          💰 4% platform fee deducted from winnings
        </div>}
        {selectedRoom.id==='dice'&&<div style={{fontSize:11,color:'var(--text)',lineHeight:1.9}}>
          🏏 Predict each ball outcome before it happens<br/>
          📊 1-2 correct = Loss · 3 = Refund · 4 = ×2<br/>
          🔥 5 = ×5 · 6 = ×10 · 7 = ×25 · 8 = ×50<br/>
          🎲 Outcomes: DOT · 1 · 2 · 4 · 6 · WICKET<br/>
          💡 Commentary reveals after each prediction
        </div>}
        {selectedRoom.id==='8ball'&&<div style={{fontSize:11,color:'var(--text)',lineHeight:1.9}}>
          🎱 Predict ALL 8 balls of the over in advance<br/>
          📊 3 correct = Refund · 4 = ×2 · 5 = ×5<br/>
          🔥 6 correct = ×10 · 7 = ×25 · 8 = ×50<br/>
          💀 Below 3 correct = lose your bet<br/>
          📢 5+ correct broadcasts your win to the room
        </div>}
        {selectedRoom.id==='laststand'&&<div style={{fontSize:11,color:'var(--text)',lineHeight:1.9}}>
          ⚔️ Type <span style={{color:'var(--cyan)',fontWeight:700}}>!start 0.05</span> to begin a game<br/>
          👋 Type <span style={{color:'var(--g)',fontWeight:700}}>!j</span> or <span style={{color:'var(--g)',fontWeight:700}}>!join</span> to enter a running game<br/>
          🃏 Type <span style={{color:'var(--gold)',fontWeight:700}}>!d</span> or <span style={{color:'var(--gold)',fontWeight:700}}>!draw</span> to draw your card<br/>
          💀 Player with the <span style={{color:'var(--red)',fontWeight:700}}>lowest card</span> is knocked out each round<br/>
          🏆 Last player standing wins the pot minus 4% fee
        </div>}
        {selectedRoom.id==='penalty'&&<div style={{fontSize:11,color:'var(--text)',lineHeight:1.9}}>
          🥅 You are the <span style={{color:'var(--gold)',fontWeight:700}}>striker</span> — pick Left, Centre or Right each round<br/>
          🧤 Keeper dives randomly — score if they go the wrong way<br/>
          📊 2/5=Refund · 3/5=×1.5 · 4/5=×2 · 5/5=<span style={{color:'var(--gold)',fontWeight:700}}>×5 JACKPOT!</span><br/>
          ⚡ Tie after 5 rounds → Sudden Death!
        </div>}
        {selectedRoom.id==='kabaddi'&&<div style={{fontSize:11,color:'var(--text)',lineHeight:1.9}}>
          🤸 You are the <span style={{color:'#00cc88',fontWeight:700}}>Raider</span> — pick a move each of 7 raids<br/>
          ⚡ Rush · 🎭 Feint · 🤸 Dive · 🔗 Chain Touch · 👻 Stealth<br/>
          📊 Win 5 raids=×3 · Win more=×1.5 · Caught 3×=-bet<br/>
          💡 Each move has unique risk, tag count and escape chance
        </div>}
        {selectedRoom.id==='archer'&&<div style={{fontSize:11,color:'var(--text)',lineHeight:1.9}}>
          🏹 You are <span style={{color:'var(--gold)',fontWeight:700}}>blindfolded</span> — set Angle and Power for each arrow<br/>
          🌬️ Wind secretly shifts your shot ±15° — feel it, predict it<br/>
          📊 Score ≥400=×4 · ≥300=×2 · ≥200=×1.2 · {'<'}200=-bet<br/>
          💡 5 arrows · Bullseye (90+ pts) = crowd goes wild
        </div>}
        {selectedRoom.id==='jung'&&<div style={{fontSize:11,color:'var(--text)',lineHeight:1.9}}>
          🐑 Your sheep vs Bot sheep — <span style={{color:'#ff7a00',fontWeight:700}}>Horn Battle</span><br/>
          ⚔️ Both sheep start with 100 HP · Pick attack every turn<br/>
          📊 Win (bot HP=0)=×2 · Draw=Refund · Lose=-bet<br/>
          💡 Headbutt · Horn Jab · Charge · Sidestep · Dodge+Block
        </div>}
        {selectedRoom.id==='kokar'&&<div style={{fontSize:11,color:'var(--text)',lineHeight:1.9}}>
          🐓 Your rooster vs Bot rooster — <span style={{color:'#ff3b5c',fontWeight:700}}>Best of 9</span><br/>
          ⚔️ CLAW beats PECK · DODGE beats CLAW · PECK beats DODGE<br/>
          📊 First to 5 round wins=×2.5 · Draw=Refund · Lose=-bet<br/>
          💡 Pure instinct and prediction — no stamina limit
        </div>}
        {selectedRoom.id==='taekwondo'&&<div style={{fontSize:11,color:'var(--text)',lineHeight:1.9}}>
          🥋 3 rounds · 5 exchanges each — <span style={{color:'#9945ff',fontWeight:700}}>Martial Arts Fusion</span><br/>
          ⚔️ KICK{'>'+'PUNCH>BLOCK>KICK'} · Stamina limits heavy moves<br/>
          📊 Win 2 rounds=×2 · Win all 3=<span style={{color:'var(--gold)',fontWeight:700}}>PERFECT ×4!</span><br/>
          💡 Chain combos multiply damage · Manage stamina wisely
        </div>}
      </div>

      {/* CTA — Join the Thrill */}
      <div style={{padding:'10px 14px 6px'}}>
        <button onClick={()=>setScreen('game')} style={{width:'100%',padding:'16px',borderRadius:14,background:'linear-gradient(135deg,'+selectedRoom.color+'dd,'+selectedRoom.color+')',border:'none',color:'#000',fontFamily:'var(--display)',fontSize:18,letterSpacing:1,cursor:'pointer',position:'relative',overflow:'hidden',boxShadow:'0 8px 28px '+selectedRoom.color+'55',fontWeight:700}}>
          <span style={{position:'relative',zIndex:1}}>🔥 Join the Thrill</span>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(255,255,255,.18),transparent)',pointerEvents:'none'}}/>
        </button>
      </div>

      {/* Platform T&C */}
      <div style={{margin:'4px 14px 14px',padding:'10px 14px',background:'rgba(0,0,0,.2)',border:'1px solid var(--b)',borderRadius:10}}>
        <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:6}}>CHATROOM RULES & PLATFORM T&C</div>
        <div style={{fontSize:10,color:'var(--td)',lineHeight:1.8}}>
          🚫 Message flooding is not permitted<br/>
          🔇 Abusive language is strictly prohibited<br/>
          ⚖️ No hate speech, political, religious, personal, caste, race or gender attacks<br/>
          🎁 Global commands: /tip 50 @User · /rain 500 · /gift rose @User<br/>
          💸 Rain splits equally among all room members<br/>
          🛡️ Violations = mute, kick, ban or platform ban<br/>
          <span style={{color:'var(--g)',fontWeight:700}}>💚 Use of hacks didn't work. But luck did.</span>
        </div>
      </div>
    </div>
  );

  // LowCardOut goes directly to the full room (own engine, own chat)
  if(screen==='game'&&selectedRoom&&selectedRoom.id==='lowcard')
    return <LowCardRoomPage onBack={()=>setScreen('lobby')}/>;

  // Last Standing goes to its own chatroom page
  if(screen==='game'&&selectedRoom&&selectedRoom.id==='laststand')
    return <LastStandingPage toast={toast} onBack={()=>setScreen('lobby')}/>;

  // IN-GAME — no bottom nav, full screen for other games
  if(screen==='game'&&selectedRoom) return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'var(--bg)',maxWidth:480,margin:'0 auto'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',padding:'8px 14px',borderBottom:'1px solid var(--bb)',background:'var(--header)',flexShrink:0,gap:10}}>
        <div onClick={()=>setScreen('lobby')} style={{width:32,height:32,borderRadius:9,background:'rgba(0,0,0,.18)',border:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:800,color:'var(--text)'}}>{selectedRoom.icon} {selectedRoom.name}</div>
          <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>🐑 {bet} CUTBAR · {pnl!==0&&<span style={{color:pnl>0?'var(--g)':'var(--red)'}}>{pnl>0?'+':''}{pnl}</span>}</div>
        </div>
        <Bx color="gold" style={{fontSize:8}}>🐑 {bet}</Bx>
      </div>
      {/* ── START NEW ROUND panel — always at top ── */}
      {(()=>{
        const c=selectedRoom.color;
        return(
          <div style={{padding:'7px 12px',borderBottom:'1px solid var(--b)',flexShrink:0,background:'var(--bg)'}}>
            {!showBet?(
              <button onClick={()=>setShowBet(true)} style={{width:'100%',padding:'8px',borderRadius:9,background:`rgba(${c==='#00e5ff'?'0,229,255':c==='#b44fff'?'180,79,255':'255,122,0'},.08)`,border:`1px solid ${c}44`,color:c,fontFamily:'var(--display)',fontSize:12,letterSpacing:.3,cursor:'pointer'}}>
                + START NEW ROUND · 🐑 {bet}
              </button>
            ):(
              <div>
                <div style={{display:'flex',gap:7,alignItems:'center',marginBottom:6}}>
                  <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',flexShrink:0}}>BET</span>
                  <input type="number" min="1" max="100000" value={bet} onChange={e=>setBet(parseInt(e.target.value)||bet)}
                    style={{flex:1,background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:13,borderRadius:8,padding:'6px 10px',outline:'none'}}/>
                  <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',flexShrink:0}}>CUTBAR</span>
                  <button onClick={()=>setShowBet(false)} style={{padding:'6px 12px',borderRadius:8,background:`linear-gradient(135deg,${c}99,${c})`,border:'none',color:'#000',fontFamily:'var(--display)',fontSize:11,cursor:'pointer',flexShrink:0,fontWeight:700}}>SET</button>
                  <button onClick={()=>setShowBet(false)} style={{padding:'6px 9px',borderRadius:8,background:'transparent',border:'1px solid var(--b)',color:'var(--td)',fontSize:11,cursor:'pointer',flexShrink:0}}>✕</button>
                </div>
                <div style={{display:'flex',gap:4}}>
                  {[25,50,100,250,500,1000,2500,5000].map(b=>(
                    <div key={b} onClick={()=>{setBet(b);setShowBet(false);}} style={{flex:1,padding:'4px 1px',textAlign:'center',borderRadius:6,background:bet===b?c+'22':'var(--bg3)',border:'1px solid '+(bet===b?c+'66':'var(--b)'),color:bet===b?c:'var(--td)',fontSize:8,fontFamily:'var(--mono)',cursor:'pointer',fontWeight:700}}>{b>=1000?b/1000+'K':b}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}
      {/* Game */}
      <div style={{flex:1,minHeight:0,overflow:'hidden',display:'flex',flexDirection:'column'}}>
        {selectedRoom.id==='dice'     &&<DiceCricketGame    toast={toast} bet={bet} onPnl={handlePnl}/>}
        {selectedRoom.id==='8ball'    &&<EightBallGame      toast={toast} bet={bet} onPnl={handlePnl}/>}
        {selectedRoom.id==='penalty'  &&<PenaltyShootoutGame toast={toast} bet={bet} onPnl={handlePnl}/>}
        {selectedRoom.id==='kabaddi'  &&<BotKabaddiGame     toast={toast} bet={bet} onPnl={handlePnl}/>}
        {selectedRoom.id==='archer'   &&<BlindArcherGame    toast={toast} bet={bet} onPnl={handlePnl}/>}
        {selectedRoom.id==='jung'     &&<CutbarJungGame     toast={toast} bet={bet} onPnl={handlePnl}/>}
        {selectedRoom.id==='kokar'    &&<KokarFightGame     toast={toast} bet={bet} onPnl={handlePnl}/>}
        {selectedRoom.id==='taekwondo'&&<TaekwondoGame      toast={toast} bet={bet} onPnl={handlePnl}/>}
      </div>
    </div>
  );

  return null;
}

// ═══════════════════════════════════════════════════════════════════════
// LAST STANDING PAGE — exact copy from original App.js
// ═══════════════════════════════════════════════════════════════════════
export function LastStandingPage({toast,onBack}){
  const PLATFORM_FEE=0.04;
  const DEFAULT_BET=0.05;
  const JOIN_SECS=60;
  const DRAW_SECS=20;
  const MY='You';
  const BOTS=['VeerBhat_Pro','Khachi','SatoshiAlpha','CryptoKhan','MoonBet99'];

  const [msgs,setMsgs]=useState([
    {type:'sys',text:'⚔️ Welcome to Last Standing Wins! Use the START button above to begin.',color:'var(--cyan)'},
    {type:'sys',text:'💡 Aces HIGH · Lowest card OUT · Winner takes pot minus 4% fee · /tip /rain 🎁',color:'var(--td)'},
  ]);
  const [input,setInput]=useState('');
  const [bal,setBal]=useState(100.00);
  const [game,setGame]=useState(null);
  const [showStart,setShowStart]=useState(false);
  const [betInput,setBetInput]=useState('50');
  const [showGiftMarket,setShowGiftMarket]=useState(false);
  const chatRef=useRef(null);
  const joinTRef=useRef(null);
  const drawTRef=useRef(null);
  const idleRef=useRef(null);
  const gameRef=useRef(null);
  gameRef.current=game;

  useEffect(()=>{
    if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight;
  },[msgs]);

  useEffect(()=>{
    startIdle();
    return()=>{clearTimeout(joinTRef.current);clearTimeout(drawTRef.current);clearTimeout(idleRef.current);};
  },[]);

  const addM=(m)=>setMsgs(p=>[...p,{...m,t:tNow()}]);
  const addSys=(text,color='var(--td)')=>addM({type:'sys',text,color});
  const addPriv=(text,color='var(--red)')=>addM({type:'priv',text,color});
  const addUser=(user,text)=>addM({type:'user',user,text});

  const startIdle=()=>{
    clearTimeout(idleRef.current);
    idleRef.current=setTimeout(()=>{
      const g=gameRef.current;
      if(!g||g.phase==='done') addSys('💤 Room is quiet. Type !start 0.05 to kick off a new game!','var(--cyan)');
    },10*60*1000);
  };

  const resolveRound=(players,bet,pot,round)=>{
    const active=players.filter(p=>!p.elim);
    const minR=Math.min(...active.map(p=>p.card.r));
    const losers=active.filter(p=>p.card.r===minR);

    if(losers.length>1){
      addSys('⚡ TIE between '+losers.map(p=>p.name).join(' & ')+'! They draw again. Others wait...','var(--gold)');
      const rp=players.map(p=>losers.find(l=>l.name===p.name)?{...p,card:null}:{...p});
      setGame(g=>g?{...g,players:rp,phase:'tiebreak'}:g);
      losers.filter(p=>p.isBot).forEach((p,i)=>{
        setTimeout(()=>{
          const c=drawRandCard();
          addSys('🃏 '+p.name+' drew: '+c.v+c.s,'var(--text)');
          setGame(g=>{
            if(!g)return g;
            const np=g.players.map(pl=>pl.name===p.name?{...pl,card:c}:pl);
            const all=np.filter(x=>!x.elim).every(x=>x.card);
            if(all) setTimeout(()=>resolveRound(np,bet,pot,round),400);
            return{...g,players:np};
          });
        },i*1000+500+Math.random()*800);
      });
      return;
    }

    const loser=losers[0];
    addSys('💀 '+loser.name+' drew '+loser.card.v+loser.card.s+' — KNOCKED OUT!','var(--red)');
    const np=players.map(p=>p.name===loser.name?{...p,elim:true}:{...p,card:null});
    const stillIn=np.filter(p=>!p.elim);

    if(stillIn.length<=1){
      const winner=stillIn[0];
      if(!winner){addSys('🤷 No winner?','var(--td)');setGame(g=>g?{...g,phase:'done'}:g);return;}
      const fee=+(pot*PLATFORM_FEE).toFixed(2);
      const win=+(pot-fee).toFixed(2);
      addSys('🏆 '+winner.name+' is LAST STANDING! Pot $'+pot.toFixed(2)+' · Fee $'+fee+' (4%) · Winner gets $'+win,'var(--gold)');
      if(winner.name===MY){setBal(b=>+(b+win).toFixed(2));toast('🏆 YOU WIN! +$'+win);}
      else toast('😔 '+winner.name+' won $'+win);
      setGame(g=>g?{...g,players:np,phase:'done'}:g);
      return;
    }

    addSys('🔄 Round '+(round+1)+'! '+stillIn.length+' players remain. Type !d or draw within '+DRAW_SECS+'s!','var(--cyan)');
    setGame(g=>g?{...g,players:np,round:round+1,phase:'drawing'}:g);

    stillIn.filter(p=>p.isBot).forEach((p,i)=>{
      setTimeout(()=>{
        const c=drawRandCard();
        addSys('🃏 '+p.name+' drew: '+c.v+c.s,'var(--text)');
        setGame(g=>{
          if(!g)return g;
          const up=g.players.map(pl=>pl.name===p.name?{...pl,card:c}:pl);
          const all=up.filter(x=>!x.elim).every(x=>x.card);
          if(all){clearTimeout(drawTRef.current);setTimeout(()=>resolveRound(up,bet,pot,round+1),400);}
          return{...g,players:up};
        });
      },i*1200+600+Math.random()*1500);
    });

    clearTimeout(drawTRef.current);
    drawTRef.current=setTimeout(()=>{
      setGame(g=>{
        if(!g||g.phase==='done')return g;
        const need=g.players.filter(p=>!p.elim&&!p.card);
        let upd={...g,players:[...g.players]};
        need.forEach(p=>{
          const c=drawRandCard();
          upd={...upd,players:upd.players.map(pl=>pl.name===p.name?{...pl,card:c}:pl)};
          addSys((p.name===MY?'⚡ Auto-drew for you':'🤖 Bot drew for '+p.name)+': '+c.v+c.s,'var(--td)');
        });
        const all=upd.players.filter(x=>!x.elim).every(x=>x.card);
        if(all) setTimeout(()=>resolveRound(upd.players,g.betAmt||DEFAULT_BET,g.pot,round+1),400);
        return upd;
      });
    },DRAW_SECS*1000);
  };

  const startGame=(betAmt)=>{
    clearTimeout(joinTRef.current);clearTimeout(drawTRef.current);
    setBal(b=>+(b-betAmt).toFixed(2));
    const players=[{name:MY,card:null,elim:false,isBot:false}];
    const g={phase:'joining',betAmt,pot:betAmt,round:1,players};
    setGame(g);
    addSys('🃏 '+MY+' has started a $'+betAmt.toFixed(2)+' game! Type !j or !join within '+JOIN_SECS+' seconds to enter.','var(--g)');

    const delays=[5000,11000,19000,28000,41000];
    delays.forEach((delay,bi)=>{
      if(Math.random()>0.3){
        setTimeout(()=>{
          setGame(prev=>{
            if(!prev||prev.phase!=='joining')return prev;
            const name=BOTS[bi];
            addSys('🃏 '+name+' joined the game!','var(--g)');
            return{...prev,pot:+(prev.pot+betAmt).toFixed(2),players:[...prev.players,{name,card:null,elim:false,isBot:true}]};
          });
        },delay);
      }
    });

    setTimeout(()=>{
      setGame(prev=>{
        if(!prev||prev.phase!=='joining')return prev;
        addSys('⏰ 30 seconds left to join! Type !j now.','var(--g)');
        return prev;
      });
    },30000);

    joinTRef.current=setTimeout(()=>{
      setGame(prev=>{
        if(!prev||prev.phase!=='joining')return prev;
        if(prev.players.length<2){
          addSys('❌ Not enough players (min 2). Game cancelled. Full refund issued.','var(--red)');
          setBal(b=>+(b+betAmt).toFixed(2));
          return{...prev,phase:'done'};
        }
        addSys('🚀 GAME STARTED! '+prev.players.length+' players · Pot: $'+prev.pot.toFixed(2)+' · Type !d or !draw within '+DRAW_SECS+'s!','var(--gold)');
        const np={...prev,phase:'drawing'};

        np.players.filter(p=>p.isBot).forEach((p,i)=>{
          setTimeout(()=>{
            const c=drawRandCard();
            addSys('🃏 '+p.name+' drew: '+c.v+c.s,'var(--text)');
            setGame(g=>{
              if(!g)return g;
              const upd=g.players.map(pl=>pl.name===p.name?{...pl,card:c}:pl);
              const all=upd.filter(x=>!x.elim).every(x=>x.card);
              if(all){clearTimeout(drawTRef.current);setTimeout(()=>resolveRound(upd,betAmt,np.pot,1),400);}
              return{...g,players:upd};
            });
          },i*1300+900+Math.random()*1200);
        });

        clearTimeout(drawTRef.current);
        drawTRef.current=setTimeout(()=>{
          setGame(g=>{
            if(!g||g.phase==='done')return g;
            const need=g.players.filter(p=>!p.elim&&!p.card);
            let upd={...g,players:[...g.players]};
            need.forEach(p=>{
              const c=drawRandCard();
              upd={...upd,players:upd.players.map(pl=>pl.name===p.name?{...pl,card:c}:pl)};
              addSys((p.name===MY?'⚡ Auto-drew for you':'🤖 Bot drew for '+p.name)+': '+c.v+c.s,'var(--td)');
            });
            const all=upd.players.filter(x=>!x.elim).every(x=>x.card);
            if(all) setTimeout(()=>resolveRound(upd.players,betAmt,np.pot,1),400);
            return upd;
          });
        },DRAW_SECS*1000);

        return np;
      });
    },JOIN_SECS*1000);
  };

  const sendCmd=(raw)=>{
    const cmd=raw.trim();
    if(!cmd)return;
    startIdle();
    addUser(MY,cmd);
    setInput('');
    const lower=cmd.toLowerCase();

    if(lower==='!s'||lower.startsWith('!s ')||lower==='!start'||lower.startsWith('!start ')){
      const g=gameRef.current;
      if(g&&g.phase!=='done'){addPriv('⚠️ A game is already running. Wait for it to end.');return;}
      const parts=cmd.split(/\s+/);
      let betAmt=DEFAULT_BET;
      if(parts[1]){betAmt=parseFloat(parts[1]);if(isNaN(betAmt)||betAmt<=0){addPriv('⚠️ Invalid amount. Example: !start 0.10');return;}}
      if(bal<betAmt){addPriv('⚠️ Insufficient funds. Balance: $'+bal.toFixed(2)+' · Need: $'+betAmt.toFixed(2));return;}
      startGame(betAmt);
      return;
    }

    if(lower==='!j'||lower==='!join'){
      const g=gameRef.current;
      if(!g||g.phase==='done'){addPriv('⚠️ No active game. Type !start to begin one.');return;}
      if(g.phase!=='joining'){addPriv('⚠️ Game is running. Please wait for the next game to start.');return;}
      if(g.players.find(p=>p.name===MY)){addPriv("⚠️ You're already in the game!");return;}
      if(bal<g.betAmt){addPriv('⚠️ Insufficient funds. Balance: $'+bal.toFixed(2));return;}
      setBal(b=>+(b-g.betAmt).toFixed(2));
      setGame(prev=>prev?{...prev,pot:+(prev.pot+prev.betAmt).toFixed(2),players:[...prev.players,{name:MY,card:null,elim:false,isBot:false}]}:prev);
      addSys('✅ You joined! Pot: $'+((game?.pot||0)+(game?.betAmt||0)).toFixed(2),'var(--g)');
      return;
    }

    if(lower==='!d'||lower==='!draw'){
      const g=gameRef.current;
      if(!g||(g.phase!=='drawing'&&g.phase!=='tiebreak')){addPriv('⚠️ No draw phase active right now.');return;}
      const me=g.players.find(p=>p.name===MY);
      if(!me||me.elim){addPriv("⚠️ You're out of this game.");return;}
      if(me.card){addPriv('⚠️ Already drew your card this round.');return;}
      const c=drawRandCard();
      const isRed=c.s==='♥'||c.s==='♦';
      addSys('🃏 You drew: '+c.v+c.s+(isRed?' ♥':''),'var(--g)');
      setGame(g=>{
        if(!g)return g;
        const up=g.players.map(p=>p.name===MY?{...p,card:c}:p);
        const all=up.filter(x=>!x.elim).every(x=>x.card);
        if(all){clearTimeout(drawTRef.current);setTimeout(()=>resolveRound(up,g.betAmt||DEFAULT_BET,g.pot,g.round),400);}
        return{...g,players:up};
      });
      return;
    }

    if(lower.startsWith('/tip ')){
      const parts=cmd.split(/\s+/);
      const amt=parseFloat(parts[1]);
      const target=(parts[2]||'').replace('@','');
      if(!target||isNaN(amt)||amt<=0){addPriv('⚠️ Usage: /tip 0.5 @User');return;}
      if(bal<amt){addPriv('⚠️ Insufficient balance.');return;}
      setBal(b=>+(b-amt).toFixed(2));
      addSys('💸 You tipped '+target+' $'+amt.toFixed(2)+'!','var(--g)');
      return;
    }

    if(lower.startsWith('/rain ')){
      const amt=parseFloat(cmd.split(/\s+/)[1]);
      if(isNaN(amt)||amt<=0){addPriv('⚠️ Usage: /rain 5');return;}
      if(bal<amt){addPriv('⚠️ Insufficient balance.');return;}
      setBal(b=>+(b-amt).toFixed(2));
      addSys('🌧 '+MY+' rained $'+amt.toFixed(2)+' — split equally among 5 players!','var(--g)');
      return;
    }
  };

  const me=game?.players?.find(p=>p.name===MY);

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'var(--bg)',maxWidth:480,margin:'0 auto'}}>
      <GiftMarketplace open={showGiftMarket} onClose={()=>setShowGiftMarket(false)} onSend={sendCmd} balance={bal*1000}/>
      <div style={{display:'flex',alignItems:'center',padding:'8px 14px',borderBottom:'1px solid var(--bb)',background:'var(--header)',flexShrink:0,gap:10}}>
        <div onClick={onBack} style={{width:32,height:32,borderRadius:9,background:'rgba(0,0,0,.18)',border:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:800}}>⚔️ Last Standing Wins</div>
          <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>Balance: ${bal.toFixed(2)}</div>
        </div>
        {game&&game.phase!=='done'&&<Bx color="green" style={{fontSize:8}}>{game.players.length}P · ${game.pot.toFixed(2)}</Bx>}
      </div>

      {/* Player strip */}
      {game&&game.phase!=='done'&&(
        <div style={{overflowX:'auto',padding:'6px 12px',background:'var(--panel)',borderBottom:'1px solid var(--b)',display:'flex',gap:8,flexShrink:0}}>
          {game.players.map(p=>(
            <div key={p.name} style={{flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',gap:2,opacity:p.elim?.3:1}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:p.elim?'rgba(255,59,92,.1)':p.card?'rgba(0,255,65,.15)':'rgba(0,255,65,.06)',border:'2px solid '+(p.elim?'var(--red)':p.card?'var(--g)':'var(--b)'),display:'flex',alignItems:'center',justifyContent:'center',fontSize:13}}>
                {AVATARS_G[p.name]||'👤'}
              </div>
              <span style={{fontSize:8,color:p.elim?'var(--red)':p.name===MY?'var(--g)':'var(--td)',fontFamily:'var(--mono)',fontWeight:700}}>{p.name===MY?'YOU':p.name.split('_')[0]}</span>
              {p.card&&!p.elim&&<span style={{fontSize:8,fontFamily:'var(--mono)',color:p.card.s==='♥'||p.card.s==='♦'?'#ff9999':'var(--text)',fontWeight:700}}>{p.card.v}{p.card.s}</span>}
              {p.elim&&<span style={{fontSize:7,color:'var(--red)'}}>💀</span>}
            </div>
          ))}
        </div>
      )}

      {/* Draw button */}
      {game&&(game.phase==='drawing'||game.phase==='tiebreak')&&me&&!me.elim&&!me.card&&(
        <div style={{padding:'6px 12px',background:'rgba(255,215,0,.04)',borderBottom:'1px solid rgba(255,215,0,.2)',flexShrink:0}}>
          <button onClick={()=>sendCmd('!d')} style={{width:'100%',padding:'10px',borderRadius:10,background:'linear-gradient(135deg,#aa8800,var(--gold))',border:'none',color:'#000',fontFamily:'var(--display)',fontSize:14,fontWeight:800,cursor:'pointer',letterSpacing:.5}}>🃏 DRAW YOUR CARD</button>
        </div>
      )}

      {/* START NEW ROUND PANEL */}
      {(!game||game.phase==='done')&&(
        <div style={{padding:'8px 12px',borderBottom:'1px solid var(--b)',flexShrink:0}}>
          {!showStart?(
            <button onClick={()=>setShowStart(true)} style={{width:'100%',padding:'9px',borderRadius:10,background:'rgba(153,69,255,.1)',border:'1px solid rgba(153,69,255,.3)',color:'#b57aff',fontFamily:'var(--display)',fontSize:13,letterSpacing:.5,cursor:'pointer'}}>⚔️ START NEW ROUND</button>
          ):(
            <div>
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
                <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',flexShrink:0}}>BET</span>
                <input type="number" min="1" max="10000" value={betInput} onChange={e=>setBetInput(e.target.value)}
                  style={{flex:1,background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:13,borderRadius:9,padding:'7px 10px',outline:'none'}}/>
                <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',flexShrink:0}}>CUTBAR</span>
                <button onClick={()=>{
                  const amt=(parseInt(betInput)||50)/1000;
                  if(bal<amt){addPriv('⚠️ Insufficient balance');return;}
                  setShowStart(false);
                  startGame(amt);
                }} style={{padding:'7px 14px',borderRadius:9,background:'linear-gradient(135deg,#6611aa,#9945ff)',border:'none',color:'#fff',fontFamily:'var(--display)',fontSize:12,cursor:'pointer',flexShrink:0}}>GO</button>
                <button onClick={()=>setShowStart(false)} style={{padding:'7px 10px',borderRadius:9,background:'transparent',border:'1px solid var(--b)',color:'var(--td)',fontSize:11,cursor:'pointer',flexShrink:0}}>✕</button>
              </div>
              <div style={{display:'flex',gap:5}}>
                {[10,25,50,100,250,500,1000,2500].map(b=>(
                  <div key={b} onClick={()=>setBetInput(String(b))} style={{flex:1,padding:'5px 2px',textAlign:'center',borderRadius:7,background:betInput===String(b)?'rgba(153,69,255,.2)':'var(--bg3)',border:'1px solid '+(betInput===String(b)?'rgba(153,69,255,.5)':'var(--b)'),color:betInput===String(b)?'#b57aff':'var(--td)',fontSize:9,fontFamily:'var(--mono)',cursor:'pointer',fontWeight:700}}>{b}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick chat chips */}
      <div style={{display:'flex',gap:5,padding:'4px 12px 3px',overflowX:'auto',flexShrink:0,borderTop:'1px solid var(--b)'}}>
        {game&&game.phase==='joining'&&!game.players.find(p=>p.name===MY)&&(
          <div onClick={()=>sendCmd('!j')} style={{flexShrink:0,padding:'4px 14px',borderRadius:12,border:'1px solid var(--bb)',background:'rgba(0,255,65,.12)',color:'var(--g)',fontSize:10,cursor:'pointer',fontFamily:'var(--mono)',fontWeight:800}}>⚔️ !join</div>
        )}
        {game&&(game.phase==='drawing'||game.phase==='tiebreak')&&me&&!me.elim&&!me.card&&(
          <div onClick={()=>sendCmd('!d')} style={{flexShrink:0,padding:'4px 14px',borderRadius:12,border:'1px solid var(--gold)',background:'rgba(255,215,0,.1)',color:'var(--gold)',fontSize:10,cursor:'pointer',fontFamily:'var(--mono)',fontWeight:800}}>🃏 !draw</div>
        )}
        {['GG! 🃏','Lucky 😎','LFG 🔥','Rip 💀','gg wp'].map(q=>(
          <div key={q} onClick={()=>sendCmd(q)} style={{flexShrink:0,padding:'4px 10px',borderRadius:12,border:'1px solid var(--b)',background:'var(--panel)',color:'var(--td)',fontSize:9,cursor:'pointer',fontFamily:'var(--body)',fontWeight:700,whiteSpace:'nowrap'}}>{q}</div>
        ))}
      </div>

      {/* Global command strap */}
      <div style={{display:'flex',gap:5,padding:'3px 12px 3px',overflowX:'auto',flexShrink:0}}>
        {['/rain 100','/tip 50 @User'].map(c=>(
          <div key={c} onClick={()=>setInput(c)} style={{flexShrink:0,padding:'3px 8px',borderRadius:12,border:'1px solid var(--bb)',background:'rgba(0,255,65,.04)',color:'var(--td)',fontSize:9,cursor:'pointer',fontFamily:'var(--mono)',whiteSpace:'nowrap'}}>{c}</div>
        ))}
        <div onClick={()=>setShowGiftMarket(true)} style={{flexShrink:0,padding:'3px 10px',borderRadius:12,border:'1px solid rgba(255,215,0,.3)',background:'rgba(255,215,0,.08)',color:'var(--gold)',fontSize:9,cursor:'pointer',fontFamily:'var(--mono)',fontWeight:700}}>🎁 Gifts</div>
      </div>

      {/* Chat messages */}
      <div ref={chatRef} style={{flex:1,overflowY:'auto',padding:'10px 12px',display:'flex',flexDirection:'column',gap:5}}>
        {msgs.map((m,i)=>{
          if(m.type==='sys') return(
            <div key={i} style={{padding:'5px 10px',borderRadius:8,background:m.color==='var(--red)'?'rgba(255,59,92,.06)':m.color==='var(--gold)'?'rgba(255,215,0,.06)':m.color==='var(--g)'?'rgba(0,255,65,.06)':'rgba(0,229,255,.04)',border:'1px solid '+(m.color==='var(--red)'?'rgba(255,59,92,.15)':m.color==='var(--gold)'?'rgba(255,215,0,.12)':m.color==='var(--g)'?'rgba(0,255,65,.12)':'rgba(0,229,255,.08)'),alignSelf:'center',maxWidth:'96%',textAlign:'center'}}>
              <span style={{fontSize:10,color:m.color||'var(--td)',fontFamily:'var(--mono)'}}>{m.text}</span>
              {m.t&&<span style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',opacity:.6,marginLeft:6}}>{m.t}</span>}
            </div>
          );
          if(m.type==='priv') return(
            <div key={i} style={{alignSelf:'flex-end',padding:'5px 10px',background:'rgba(255,59,92,.08)',border:'1px solid rgba(255,59,92,.2)',borderRadius:8,maxWidth:'90%'}}>
              <span style={{fontSize:10,color:m.color||'var(--red)',fontFamily:'var(--mono)'}}>🔒 {m.text}</span>
            </div>
          );
          if(m.type==='user') return(
            <div key={i} style={{alignSelf:m.user===MY?'flex-end':'flex-start',maxWidth:'80%'}}>
              {m.user!==MY&&<span style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',display:'block',marginBottom:2}}>{m.user}</span>}
              <div style={{padding:'6px 10px',borderRadius:m.user===MY?'10px 3px 10px 10px':'3px 10px 10px 10px',background:m.user===MY?'rgba(0,255,65,.1)':'var(--panel2)',border:'1px solid '+(m.user===MY?'rgba(0,255,65,.2)':'var(--b)'),color:m.user===MY?'var(--g)':'var(--text)',fontSize:11,fontFamily:'var(--mono)',display:'flex',flexWrap:'wrap',gap:5,alignItems:'flex-end'}}>
                <span style={{flex:1}}>{m.text}</span>
                {m.t&&<span style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',opacity:.6,flexShrink:0,lineHeight:1.8}}>{m.t}</span>}
              </div>
            </div>
          );
          return null;
        })}
      </div>

      {/* Input — pinned to bottom */}
      <div style={{display:'flex',gap:7,padding:'7px 12px 10px',flexShrink:0,background:'var(--bg)',borderTop:'1px solid var(--b)'}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendCmd(input)}
          placeholder="!start 0.05 · !j · !d · or just chat..."
          style={{flex:1,background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:12,borderRadius:20,padding:'9px 14px',outline:'none'}}/>
        <button onClick={()=>sendCmd(input)} style={{width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg,var(--g2),var(--g))',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8L13 2L9 8M13 2L9 14L9 8" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}
