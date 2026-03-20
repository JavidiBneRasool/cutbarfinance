/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { useGameChat } from '../features/games/useGameChat';
import { drawRandCard, mkShuffledDeck, tNow, AVATARS_G } from '../features/games/gameHelpers';
import GameChat from './GameChat';
import { Btn } from './primitives';

// ── PnlBar ──────────────────────────────────────────────────
export function PnlBar({pnl}){
  return(
    <div style={{padding:'5px 14px',background:pnl>=0?'rgba(0,255,65,.06)':'rgba(255,59,92,.06)',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
      <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>Session P&L:</span>
      <span style={{fontSize:12,color:pnl>=0?'var(--g)':'var(--red)',fontFamily:'var(--mono)',fontWeight:800}}>{pnl>=0?'+':''}{pnl} CUTBAR</span>
      <span style={{fontSize:11}}>{pnl>=0?'🔥':'💀'}</span>
    </div>
  );
}

// ── LowCardOutGame ───────────────────────────────────────────
export function LowCardOutGame({toast,bet,onPnl}){
  const PLAYERS=['You','VeerBhat_Pro','Khachi','SatoshiAlpha'];
  const makeHands=()=>{
    const d=mkShuffledDeck();
    return Object.fromEntries(PLAYERS.map((p,i)=>[p,d.slice(i*5,i*5+5)]));
  };
  const [hands,setHands]=useState(makeHands);
  const [phase,setPhase]=useState('pick');
  const [chosen,setChosen]=useState(null);
  const [roundDraws,setRoundDraws]=useState(null);
  const [eliminated,setEliminated]=useState([]);
  const [round,setRound]=useState(1);
  const [chat,setChat]=useState([
    {u:'VeerBhat_Pro',m:'Lowest card each round = OUT 🃏 Pick wisely!',t:tNow()},
    {u:'Khachi',m:"Aces are HIGH. Suits don't matter 😈",t:tNow()},
  ]);
  const addChat=(u,m)=>setChat(c=>[...c,{u,m,t:tNow()}]);
  const active=PLAYERS.filter(p=>!eliminated.includes(p));

  const pickCard=(card)=>{
    if(phase!=='pick'||chosen)return;
    setChosen(card);
    const draws={You:card};
    active.filter(p=>p!=='You').forEach(p=>{
      const h=hands[p]||[];
      if(h.length>0) draws[p]=h[Math.floor(Math.random()*h.length)];
    });
    setRoundDraws(draws);
    setPhase('reveal');
    setTimeout(()=>{
      const minR=Math.min(...Object.values(draws).map(c=>c.r));
      const losers=Object.entries(draws).filter(([,c])=>c.r===minR).map(([p])=>p);
      const newElim=[...eliminated,...losers];
      losers.forEach(p=>addChat('🎯',p+' drew '+draws[p].v+draws[p].s+' — OUT! 💀'));
      setEliminated(newElim);
      setTimeout(()=>{
        const stillIn=PLAYERS.filter(p=>!newElim.includes(p));
        if(stillIn.length<=1||round>=4){
          const won=!newElim.includes('You');
          const delta=won?Math.floor(bet*(active.length-1)):-bet;
          onPnl(delta);
          toast(won?'🃏 YOU WIN! +'+delta+' CUTBAR':'💀 -'+bet+' CUTBAR');
          addChat('🏆',won?'You win! +'+delta+' CUTBAR 🎉':'Better luck next time!');
          setPhase('done');
        } else {
          const nh={};
          PLAYERS.forEach(p=>{if(!newElim.includes(p)) nh[p]=(hands[p]||[]).filter(c=>c!==draws[p]);});
          setHands(nh);
          setChosen(null);setRoundDraws(null);
          setRound(r=>r+1);setPhase('pick');
          addChat('🎲','Round '+(round+1)+'! '+stillIn.length+' players remain. Pick your card!');
        }
      },1600);
    },1000);
  };

  const reset=()=>{setHands(makeHands());setPhase('pick');setChosen(null);setRoundDraws(null);setEliminated([]);setRound(1);addChat('🎯','New game! Pick your card 🃏');};
  const myHand=hands['You']||[];

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      {/* Players */}
      <div style={{padding:'10px 14px',background:'var(--panel)',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:7}}>ROUND {round} · POT: 🐑 {bet*active.length} CUTBAR</div>
        <div style={{display:'flex',gap:8,justifyContent:'space-between'}}>
          {PLAYERS.map(p=>{
            const isElim=eliminated.includes(p);
            const draw=roundDraws&&roundDraws[p];
            const isRed=draw&&(draw.s==='♥'||draw.s==='♦');
            return(
              <div key={p} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,opacity:isElim?.3:1}}>
                <div style={{width:34,height:34,borderRadius:'50%',background:isElim?'rgba(255,59,92,.1)':p==='You'?'rgba(0,255,65,.15)':'rgba(0,255,65,.06)',border:'2px solid '+(isElim?'var(--red)':p==='You'?'var(--g)':'var(--b)'),display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>
                  {AVATARS_G[p]||'👤'}
                </div>
                <span style={{fontSize:8,color:isElim?'var(--red)':p==='You'?'var(--g)':'var(--td)',fontFamily:'var(--mono)',fontWeight:700,textAlign:'center'}}>{p==='You'?'YOU':p.split('_')[0]}</span>
                {draw&&<div style={{padding:'2px 6px',borderRadius:5,background:'rgba(0,255,65,.1)',border:'1px solid var(--bb)',fontFamily:'var(--mono)',fontSize:11,color:isRed?'#ff8888':'var(--text)',fontWeight:800}}>{draw.v}{draw.s}</div>}
                {isElim&&<span style={{fontSize:8,color:'var(--red)'}}>💀 OUT</span>}
              </div>
            );
          })}
        </div>
      </div>
      {/* Hand */}
      <div style={{padding:'10px 14px',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:7}}>{phase==='pick'?'YOUR HAND — TAP A CARD TO PLAY':'WAITING FOR RESULT...'}</div>
        <div style={{display:'flex',gap:7,justifyContent:'center'}}>
          {myHand.map((card,i)=>{
            const isRed=card.s==='♥'||card.s==='♦';
            const isPicked=chosen===card;
            return(
              <div key={i} onClick={()=>phase==='pick'&&pickCard(card)} style={{width:44,height:64,borderRadius:9,background:isPicked?'rgba(0,255,65,.18)':'var(--panel2)',border:'2px solid '+(isPicked?'var(--g)':'var(--b)'),display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:phase==='pick'?'pointer':'default',transform:isPicked?'translateY(-8px)':'none',transition:'all .2s',boxShadow:isPicked?'0 8px 20px rgba(0,255,65,.25)':'none',flexShrink:0}}>
                <span style={{fontSize:14,fontWeight:800,color:isRed?'#ff8888':'var(--text)',fontFamily:'var(--mono)'}}>{card.v}</span>
                <span style={{fontSize:16,color:isRed?'#ff8888':'var(--text)'}}>{card.s}</span>
              </div>
            );
          })}
          {eliminated.includes('You')&&<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:12}}><span style={{fontSize:28}}>💀</span><span style={{fontSize:12,color:'var(--red)',fontWeight:700}}>OUT</span></div>}
        </div>
      </div>
      {phase==='done'&&<div style={{padding:'10px 14px',borderBottom:'1px solid var(--b)',flexShrink:0}}><Btn v="outline" onClick={reset}>🔄 Play Again</Btn></div>}
      {/* Chat - fills remaining space */}
      <GameChat chat={chat} onSend={m=>addChat('You',m)} quick={['GG! 🃏','Lucky 😅','LFG 🔥','gg wp']} roomName="LowCardOut"/>
    </div>
  );
}

// ── DiceCricketGame ──────────────────────────────────────────
export function DiceCricketGame({toast,bet,onPnl}){
  const DM={1:'1 run',2:'2 runs',3:'3 runs',4:'FOUR! ✨',5:'WICKET! 💀',6:'SIX! 🔥'};
  const DR={1:1,2:2,3:3,4:4,5:null,6:6};
  const DF=['','⚀','⚁','⚂','⚃','⚄','⚅'];
  const [s1,setS1]=useState(0);
  const [s2,setS2]=useState(0);
  const [wk,setWk]=useState(0);
  const [balls,setBalls]=useState(0);
  const [die,setDie]=useState(null);
  const [inn,setInn]=useState(1);
  const [phase,setPhase]=useState('batting');
  const [rolling,setRolling]=useState(false);
  const {chat,addChat,handleSend,balance:chatBalance}=useGameChat([
    {u:'🏏',m:'T10 Dice Cricket! Roll the dice — 5=WICKET, 6=SIX. 10 balls / 2 wickets per innings.',t:tNow(),sys:true},
    {u:'Khachi',m:'You bat first. Bot will chase your total 🎲',t:tNow()},
  ],5000);
  const MAX_W=2,MAX_B=10;

  const roll=()=>{
    if(phase!=='batting'||rolling)return;
    setRolling(true);
    // Brief animation feel
    const spinInterval=setInterval(()=>setDie(Math.floor(Math.random()*6)+1),80);
    setTimeout(()=>{
      clearInterval(spinInterval);
      const d=Math.floor(Math.random()*6)+1;
      setDie(d);
      setRolling(false);
      const nb=balls+1; setBalls(nb);
      const runs=DR[d];
      let ns1=s1,nwk=wk;
      if(runs===null){nwk=wk+1;setWk(nwk);addChat('💀',`Ball ${nb}: ${DM[d]}`,true);}
      else{ns1=s1+runs;setS1(ns1);addChat('🎲',`Ball ${nb}: ${DM[d]}`,true);}
      if(nwk>=MAX_W||nb>=MAX_B){
        setTimeout(()=>{addChat('🏏',`Innings over! You scored ${ns1}. Bot bats now...`,true);runBotInning(ns1);},900);
      }
    },450);
  };

  const runBotInning=(target)=>{
    setInn(2);setWk(0);setBalls(0);
    let bs=0,bw=0,bb=0;
    const iv=setInterval(()=>{
      const d=Math.floor(Math.random()*6)+1;
      // Bot slightly better than random (house edge)
      const botD=d===5&&Math.random()<0.55?Math.floor(Math.random()*4)+1:d;
      const r=DR[botD]; bb++;
      if(r===null) bw++; else bs+=r;
      setS2(bs);setBalls(bb);setWk(bw);
      addChat('🤖',`Bot ball ${bb}: ${DM[botD]}`,true);
      if(bs>target||bw>=MAX_W||bb>=MAX_B){
        clearInterval(iv);
        const won=bs<=target;
        const delta=won?Math.floor(bet*1.5):-bet;
        onPnl(delta);
        toast(won?`🏏 YOU WIN! +${delta} CUTBAR`:`😤 Bot wins! -${bet}`);
        addChat('🏆',won?`You win! ${target} vs ${bs}. +${delta} CUTBAR 🎉`:`Bot wins ${bs} chasing ${target}. -${bet} CUTBAR`,true);
        setPhase('done');
      }
    },700);
  };

  const reset=()=>{
    setS1(0);setS2(0);setWk(0);setBalls(0);setDie(null);
    setPhase('batting');setInn(1);setRolling(false);
    addChat('🏏','New match! You bat first. Roll the dice 🎲',true);
  };

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      {/* Compact scoreboard + action */}
      <div style={{padding:'8px 14px',background:'var(--panel)',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:1,marginBottom:1}}>{inn===1?'🏏 YOU':'YOUR SCORE'}</div>
            <div style={{fontSize:26,color:'var(--g)',fontFamily:'var(--display)',fontWeight:800,lineHeight:1}}>{s1}</div>
          </div>
          <div style={{textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
            <div style={{fontSize:22,filter:rolling?'blur(1px)':'none',transition:'filter .1s'}}>{die?DF[die]:'🎲'}</div>
            {die&&<div style={{fontSize:9,color:die===5?'var(--red)':die===6?'var(--g)':'var(--text)',fontFamily:'var(--mono)',fontWeight:700}}>{DM[die]}</div>}
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:1,marginBottom:1}}>BOT 🤖</div>
            <div style={{fontSize:26,color:inn===2?'var(--red)':'var(--td)',fontFamily:'var(--display)',fontWeight:800,lineHeight:1}}>{s2}</div>
          </div>
        </div>
        <div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',textAlign:'center',marginBottom:6}}>Over {Math.floor(balls/6)}.{balls%6} · {wk}/{MAX_W} wkts{inn===2?` · Need ${s1+1}`:''}</div>
        {phase==='batting'&&inn===1&&(
          <button onClick={roll} disabled={rolling} style={{width:'100%',padding:'9px',borderRadius:10,background:rolling?'var(--bg3)':'linear-gradient(135deg,var(--g2),var(--g))',border:'none',color:rolling?'var(--td)':'#000',fontFamily:'var(--display)',fontSize:13,letterSpacing:1,cursor:rolling?'wait':'pointer'}}>
            {rolling?'ROLLING...':'🎲 ROLL DICE'}
          </button>
        )}
        {inn===2&&phase==='batting'&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'6px'}}><div style={{width:10,height:10,border:'2px solid var(--b)',borderTop:'2px solid var(--g)',borderRadius:'50%',animation:'spin .7s linear infinite'}}/><span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>Bot batting...</span></div>}
        {phase==='done'&&<button onClick={reset} style={{width:'100%',padding:'8px',borderRadius:9,background:'rgba(0,255,65,.08)',border:'1px solid var(--bb)',color:'var(--g)',fontFamily:'var(--display)',fontSize:12,cursor:'pointer'}}>🔄 NEW MATCH</button>}
      </div>
      <GameChat chat={chat} onSend={handleSend} quick={['Six! 🔥','No wicket 🙏','GG','Roll!']} roomName="T10 Dice Cricket" bet={bet} onBetChange={null} balance={chatBalance}/>
    </div>
  );
}

// ── PenaltyShootoutGame ──────────────────────────────────────
export function PenaltyShootoutGame({toast,bet,onPnl}){
  // Payouts: 5/5=×5 | 4/5=×2 | 3/5=×1.5 | 2/5=refund | 1-0/5=-bet
  const DIRS=['⬅️ Left','⬆️ Centre','➡️ Right'];
  const DIR_SHORT={0:'L',1:'C',2:'R'};
  const KEEPER_MSGS={
    save:['🧤 Keeper dives the right way!','🧤 What a save! Keeper reads it!','🧤 Denied! Keeper guesses correctly!','🧤 Incredible stop! Keeper goes left!'],
    goal:['🥅 GOAL! Keeper goes the wrong way!','🥅 Back of the net! Unstoppable!','🥅 SCORED! Keeper has no chance!','🥅 BRILLIANT finish! Top corner!'],
  };
  const pickMsg=(arr)=>arr[Math.floor(Math.random()*arr.length)];

  const [round,setRound]=useState(1);
  const [myGoals,setMyGoals]=useState(0);
  const [botGoals,setBotGoals]=useState(0);
  const [phase,setPhase]=useState('pick');
  const [picked,setPicked]=useState(null);
  const [lastResult,setLastResult]=useState(null);
  const [history,setHistory]=useState([]);
  const [suddenDeath,setSuddenDeath]=useState(false);
  const {chat,addChat,handleSend,balance:chatBalance}=useGameChat([
    {u:'🥅',m:'Penalty Shootout! You are the striker. Pick your direction — Left, Centre or Right. 5 rounds.',t:tNow(),sys:true},
    {u:'Khachi',m:'Pick a corner and score! Keeper dives randomly 🧤',t:tNow()},
  ],5000);

  const shoot=(dir)=>{
    if(phase!=='pick')return;
    setPicked(dir);
    setPhase('saving');

    setTimeout(()=>{
      // Keeper picks a random direction (bias toward centre)
      const weights=[38,24,38]; // L=38%, C=24%, R=38% — keeper reads better
      let r=Math.random()*100, keeperDir=0;
      if(r>weights[0]+weights[1]) keeperDir=2;
      else if(r>weights[0]) keeperDir=1;

      const scored = dir !== keeperDir;
      const resultMsg = pickMsg(scored?KEEPER_MSGS.goal:KEEPER_MSGS.save);

      const newMyGoals = myGoals + (scored?1:0);
      setMyGoals(newMyGoals);
      setLastResult({scored,dir,keeperDir,msg:resultMsg});
      setPhase('result');

      addChat(scored?'🥅':'🧤', `Round ${round}: You shoot ${DIR_SHORT[dir]} — ${resultMsg}`, true);

      // After 1.8s — bot takes its shot
      setTimeout(()=>{
        const botDir = Math.floor(Math.random()*3);
        const botKeeperDir = Math.floor(Math.random()*3);
        const botScored = botDir !== botKeeperDir;
        const newBotGoals = botGoals + (botScored?1:0);
        setBotGoals(newBotGoals);
        addChat(botScored?'🤖':'🛡️', `Bot shoots ${DIR_SHORT[botDir]} — ${botScored?'⚽ BOT SCORES!':'🧤 Your keeper saves it!'}`, true);
        setHistory(h=>[...h,{r:round,myGoal:scored,botGoal:botScored}]);
        setPhase('botshot');

        // After 1.2s — check if game ends
        setTimeout(()=>{
          const maxRounds = suddenDeath ? round : 5;
          const remainingRounds = maxRounds - round;
          const isMathDone =
            (newMyGoals > newBotGoals + remainingRounds) || (newBotGoals > newMyGoals + remainingRounds);

          if(round >= maxRounds || isMathDone){
            const diff = newMyGoals - newBotGoals;
            let d;
            if(diff > 0)       d = newMyGoals===5?Math.floor(bet*4):newMyGoals===4?Math.floor(bet*1.6):Math.floor(bet*1.2);
            else if(diff === 0) d = 0;
            else                d = -bet;

            if(diff === 0 && !suddenDeath){
              setSuddenDeath(true);
              setRound(round+1);
              setPicked(null);setLastResult(null);
              setPhase('pick');
              addChat('⚡',"🔥 It's TIED! Sudden Death round! First to score while opponent misses WINS!",true);
            } else {
              onPnl(d);
              setPhase('done');
              const summary = `${newMyGoals}-${newBotGoals} · ${diff>0?'YOU WIN! +'+d+' CUTBAR':diff===0?'DRAW — full refund':'BOT WINS · -'+bet+' CUTBAR'}`;
              addChat(diff>0?'🏆':'😤', summary, true);
              toast(diff>0?`🥅 YOU WIN! ${newMyGoals}-${newBotGoals} +${d}`:`😤 ${newMyGoals}-${newBotGoals} Bot wins`);
            }
          } else {
            setRound(r=>r+1);
            setPicked(null);setLastResult(null);
            setPhase('pick');
          }
        },1200);
      },1800);
    },700);
  };

  const reset=()=>{
    setRound(1);setMyGoals(0);setBotGoals(0);
    setPhase('pick');setPicked(null);setLastResult(null);
    setHistory([]);setSuddenDeath(false);
    addChat('🥅','New shootout! 5 rounds. Pick your corner ⚽',true);
  };

  // Scoreboard dots
  const ScoreDots=({goals,rounds,color})=>(
    <div style={{display:'flex',gap:3}}>
      {Array.from({length:5},(_,i)=>
        <div key={i} style={{width:10,height:10,borderRadius:'50%',border:`1.5px solid ${i<rounds?(history[i]?.[color]?'var(--g)':'var(--red)'):'var(--b)'}`,background:i<rounds?(history[i]?.[color]?'var(--g)':'rgba(255,59,92,.2)'):'transparent'}}/>
      )}
    </div>
  );

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      {/* Compact scoreboard */}
      <div style={{padding:'8px 14px',background:'var(--panel)',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:2}}>YOU 🧍</div>
            <div style={{fontSize:28,fontWeight:800,color:'var(--g)',lineHeight:1}}>{myGoals}</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:1}}>{suddenDeath?'⚡ SUDDEN DEATH':`Round ${Math.min(round,5)} / 5`}</div>
            <div style={{fontSize:11,color:phase==='done'?'var(--gold)':'var(--text)',fontWeight:700}}>{phase==='done'?(myGoals>botGoals?'YOU WIN! 🏆':myGoals===botGoals?'DRAW':'BOT WINS 🤖'):phase==='saving'?'⚽ KICKING...':phase==='result'||phase==='botshot'?'🤖 BOT KICKS...':'🎯 SHOOT!'}</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:2}}>BOT 🤖</div>
            <div style={{fontSize:28,fontWeight:800,color:'var(--red)',lineHeight:1}}>{botGoals}</div>
          </div>
        </div>
        {/* Goal dots */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <ScoreDots goals={myGoals} rounds={history.length} color="myGoal"/>
          <span style={{fontSize:14}}>🥅</span>
          <ScoreDots goals={botGoals} rounds={history.length} color="botGoal"/>
        </div>
      </div>

      {/* Direction picker or result */}
      <div style={{padding:'8px 14px',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        {phase==='pick'&&(
          <div>
            <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',textAlign:'center',marginBottom:6,letterSpacing:1}}>PICK YOUR SHOT DIRECTION</div>
            <div style={{display:'flex',gap:6}}>
              {DIRS.map((d,i)=>(
                <div key={i} onClick={()=>shoot(i)}
                  style={{flex:1,padding:'10px 4px',borderRadius:10,border:'2px solid var(--bb)',background:'rgba(0,229,255,.07)',display:'flex',flexDirection:'column',alignItems:'center',gap:3,cursor:'pointer',transition:'all .15s'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--cyan)';e.currentTarget.style.background='rgba(0,229,255,.15)';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--bb)';e.currentTarget.style.background='rgba(0,229,255,.07)';}}>
                  <span style={{fontSize:20}}>{d.split(' ')[0]}</span>
                  <span style={{fontSize:9,color:'var(--cyan)',fontFamily:'var(--mono)',fontWeight:700}}>{d.split(' ')[1]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {(phase==='saving'||phase==='result'||phase==='botshot')&&lastResult&&(
          <div style={{textAlign:'center',padding:'4px 0'}}>
            <div style={{fontSize:20,marginBottom:4}}>{lastResult.scored?'🥅':'🧤'}</div>
            <div style={{fontSize:12,fontWeight:800,color:lastResult.scored?'var(--g)':'var(--red)',marginBottom:3}}>
              {lastResult.scored?'⚽ GOAL!':'🛑 SAVED!'}
            </div>
            <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>{lastResult.msg}</div>
          </div>
        )}
        {phase==='saving'&&!lastResult&&(
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'10px'}}>
            <span style={{fontSize:24,animation:'pulse .5s infinite'}}>⚽</span>
            <span style={{fontSize:11,color:'var(--cyan)',fontFamily:'var(--display)'}}>SHOOTING...</span>
          </div>
        )}
        {phase==='done'&&(
          <div style={{textAlign:'center',padding:'4px 0'}}>
            <div style={{fontSize:16,fontWeight:800,color:myGoals>botGoals?'var(--g)':myGoals===botGoals?'var(--gold)':'var(--red)',marginBottom:6}}>
              {myGoals>botGoals?'🏆 YOU WIN!':myGoals===botGoals?'🤝 DRAW':'😤 BOT WINS'}
            </div>
            <div style={{fontSize:12,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:8}}>{myGoals} — {botGoals}</div>
            <button onClick={reset} style={{padding:'7px 20px',borderRadius:9,background:'rgba(0,229,255,.1)',border:'1px solid var(--bb)',color:'var(--cyan)',fontFamily:'var(--display)',fontSize:12,cursor:'pointer'}}>🔄 REMATCH</button>
          </div>
        )}
      </div>

      <GameChat chat={chat} onSend={handleSend} quick={['GOAL! 🥅','Lucky save 🧤','Miss 😬','LFG ⚽']} roomName="Penalty Shootout" bet={bet} onBetChange={null} balance={chatBalance}/>
    </div>
  );
}

// ── BotKabaddiGame ───────────────────────────────────────────
export function BotKabaddiGame({toast,bet,onPnl}){
  const MOVES=[
    {id:'rush',label:'⚡ Rush',emoji:'⚡',desc:'Sprint past defenders — high risk, high tag'},
    {id:'feint',label:'🎭 Feint',emoji:'🎭',desc:'Fake direction — confuses 2 defenders'},
    {id:'dive',label:'🤸 Dive',emoji:'🤸',desc:'Dive under tackles — tag 1 guaranteed'},
    {id:'chain',label:'🔗 Chain Touch',emoji:'🔗',desc:'Chain tag multiple — bonus per extra'},
    {id:'stealth',label:'👻 Stealth',emoji:'👻',desc:'Silent creep — 40% caught, 60% clean escape'},
  ];
  const DEF_NAMES=['Bholu','Sanju','Ramu','Chotu','Veer','Motu','Kalu'];
  const [raid,setRaid]=useState(1);
  const [score,setScore]=useState({you:0,bot:0});
  const [phase,setPhase]=useState('pick');
  const [lastResult,setLastResult]=useState(null);
  const [history,setHistory]=useState([]);
  const {chat,addChat,handleSend,balance:cb}=useGameChat([
    {u:'🤸',m:'Bot Kabaddi! You are the Raider. Pick your move each raid — tag defenders without getting caught!',t:tNow(),sys:true},
    {u:'Khachi',m:'Rush in, tag em, come back alive! Best of 7 raids. Catch me if you can 😤',t:tNow()},
  ],5000);

  const doRaid=(move)=>{
    if(phase!=='pick')return;
    setPhase('result');
    const defCount=2+Math.floor(Math.random()*3);
    const defs=DEF_NAMES.slice(0,defCount);
    let tagged=0,caught=false,msg='';
    const r=Math.random();
    if(move.id==='rush'){caught=r<0.48;tagged=caught?0:1+Math.floor(Math.random()*2);msg=caught?`💥 ${defs[0]} and ${defs[1]} brought you DOWN!`:`⚡ Blazed past ${tagged} defenders! Clean escape!`;}
    else if(move.id==='feint'){caught=r<0.35;tagged=caught?0:1+Math.floor(r*1.5);msg=caught?`🎭 Feint read! ${defs[0]} grabs your ankle!`:`🎭 Feint worked! ${tagged} defenders fooled!`;}
    else if(move.id==='dive'){caught=r<0.15;tagged=caught?0:1;msg=caught?`🤸 Dive failed! Piled on by ${defs.join(' & ')}!`:`🤸 Rolled under! Tagged ${defs[0]} clean!`;}
    else if(move.id==='chain'){caught=r<0.52;tagged=caught?0:1+Math.floor(r*2);msg=caught?`🔗 Chain broke! Caught mid-tag by ${defs[1]}!`:`🔗 Chain touch! Tagged ${tagged} defenders!`;}
    else{caught=r<0.4;tagged=caught?0:0;msg=caught?`👻 Stealth spotted! ${defs[0]} heard your breathing!`:`👻 Ghost raid! Crossed line — no tags but safe!`;}

    const bonusTag=tagged>3?tagged-3:0;
    const raidWin=!caught;
    const newScore={you:score.you+(raidWin?1:0),bot:score.bot+(caught?1:0)};
    setScore(newScore);
    setLastResult({move,tagged,caught,bonusTag,msg,defs});
    setHistory(h=>[...h,{raid,won:raidWin,tagged,caught}]);
    addChat(caught?'💥':'🏃',`Raid ${raid}: ${msg}`,true);
    if(bonusTag>0) addChat('🔥',`+${bonusTag} BONUS TAGS! Crowd goes wild!`,true);

    setTimeout(()=>{
      if(raid>=7||newScore.you>=5||newScore.bot>=3){
        const won=newScore.you>newScore.bot;
        const d=newScore.you>=5?Math.floor(bet*2.5):won?Math.floor(bet*1.3):newScore.you===newScore.bot?0:-bet;
        onPnl(d);
        setPhase('done');
        addChat(won?'🏆':'💀',`Full Time! You ${newScore.you} — Bot ${newScore.bot} · ${d>=0?'+'+d:d} CUTBAR`,true);
        toast(won?`🤸 WIN! ${newScore.you}-${newScore.bot} +${d}`:`💀 ${newScore.you}-${newScore.bot} -${bet}`);
      } else {
        setRaid(r=>r+1);
        setPhase('pick');
        setLastResult(null);
      }
    },1600);
  };

  const reset=()=>{setRaid(1);setScore({you:0,bot:0});setPhase('pick');setLastResult(null);setHistory([]);addChat('🤸','New match! 7 raids. Go!',true);};

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      {/* Compact scoreboard */}
      <div style={{padding:'7px 14px',background:'var(--panel)',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
          <div style={{textAlign:'center'}}><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)'}}>RAIDS WON</div><div style={{fontSize:24,fontWeight:800,color:'var(--g)'}}>{score.you}</div></div>
          <div style={{textAlign:'center'}}><div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:1}}>Raid {Math.min(raid,7)} / 7</div><div style={{fontSize:10,color:phase==='done'?'var(--gold)':'var(--text)',fontWeight:700}}>{phase==='done'?(score.you>score.bot?'YOU WIN 🏆':'BOT WINS 💀'):'Pick a move'}</div></div>
          <div style={{textAlign:'center'}}><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)'}}>CAUGHT</div><div style={{fontSize:24,fontWeight:800,color:'var(--red)'}}>{score.bot}</div></div>
        </div>
        <div style={{display:'flex',gap:3}}>{Array.from({length:7},(_,i)=><div key={i} style={{flex:1,height:5,borderRadius:3,background:i<history.length?(history[i].won?'var(--g)':'var(--red)'):'var(--b)',transition:'all .3s'}}/>)}</div>
      </div>
      {/* Move picker */}
      <div style={{padding:'7px 14px',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        {phase==='pick'&&<div style={{display:'flex',gap:5}}>{MOVES.map(m=><div key={m.id} onClick={()=>doRaid(m)} style={{flex:1,padding:'8px 2px',borderRadius:9,border:'1px solid var(--bb)',background:'rgba(0,255,65,.05)',display:'flex',flexDirection:'column',alignItems:'center',gap:2,cursor:'pointer',transition:'all .15s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--g)';e.currentTarget.style.background='rgba(0,255,65,.12)';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--bb)';e.currentTarget.style.background='rgba(0,255,65,.05)';}}>
          <span style={{fontSize:18}}>{m.emoji}</span><span style={{fontSize:8,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700,textAlign:'center'}}>{m.label.split(' ').slice(1).join(' ')}</span>
        </div>)}</div>}
        {phase==='result'&&lastResult&&<div style={{textAlign:'center',padding:'4px 0'}}><span style={{fontSize:18}}>{lastResult.caught?'💥':'🏃'}</span><div style={{fontSize:11,fontWeight:700,color:lastResult.caught?'var(--red)':'var(--g)',marginTop:2}}>{lastResult.caught?'CAUGHT!':'ESCAPED!'}{lastResult.tagged>0?` · Tagged ${lastResult.tagged}`:''}</div></div>}
        {phase==='done'&&<div style={{textAlign:'center',padding:'4px 0'}}><div style={{fontSize:13,fontWeight:800,color:score.you>score.bot?'var(--g)':'var(--red)',marginBottom:4}}>{score.you>score.bot?'🏆 YOU WIN!':'💀 BOT WINS'}</div><button onClick={reset} style={{padding:'6px 18px',borderRadius:8,background:'rgba(0,255,65,.1)',border:'1px solid var(--bb)',color:'var(--g)',fontSize:11,cursor:'pointer'}}>🔄 Rematch</button></div>}
      </div>
      <GameChat chat={chat} onSend={handleSend} quick={['Kabaddi! 🤸','LFG ⚡','RIP 💀','Chain!🔗']} roomName="Bot Kabaddi" bet={bet} onBetChange={null} balance={cb}/>
    </div>
  );
}

// ── BlindArcherGame ──────────────────────────────────────────
export function BlindArcherGame({toast,bet,onPnl}){
  const [arrow,setArrow]=useState(1);
  const [angle,setAngle]=useState(45);
  const [power,setPower]=useState(3);
  const [totalScore,setTotalScore]=useState(0);
  const [phase,setPhase]=useState('aim'); // aim|flight|done
  const [lastShot,setLastShot]=useState(null);
  const [shots,setShots]=useState([]);
  const {chat,addChat,handleSend,balance:cb}=useGameChat([
    {u:'🏹',m:'Blind Archer! Set ANGLE and POWER — the wind shifts secretly. Closest to bullseye = max points. 5 arrows.',t:tNow(),sys:true},
    {u:'Khachi',m:'The wind is deceptive today. Trust your instincts! 🌬️',t:tNow()},
  ],5000);
  const TOTAL_ARROWS=5;

  const shoot=()=>{
    if(phase!=='aim')return;
    setPhase('flight');
    const windShift=(Math.random()-0.5)*40; // ±20° — harder to predict
    const effectiveAngle=Math.max(0,Math.min(90,angle+windShift));
    // Ideal angle for power: p=1→80°, p=2→70°, p=3→60°, p=4→50°, p=5→40°
    const idealAngle=90-power*10;
    const angleDiff=Math.abs(effectiveAngle-idealAngle);
    // Score: 0 diff=100, 45diff=10
    const sc=Math.max(5,Math.round(100-angleDiff*2.8));
    const bullseye=sc>=90;
    const newTotal=totalScore+sc;
    setTotalScore(newTotal);
    setLastShot({angle,power,windShift:Math.round(windShift),effective:Math.round(effectiveAngle),sc,bullseye});
    setShots(s=>[...s,{a:arrow,sc,bullseye}]);
    addChat(bullseye?'🎯':'🏹',`Arrow ${arrow}: Angle ${angle}° + Wind ${windShift>0?'+':''}${Math.round(windShift)}° = ${Math.round(effectiveAngle)}° → ${sc} pts${bullseye?' 🎯 BULLSEYE!':''}`,true);

    setTimeout(()=>{
      if(arrow>=TOTAL_ARROWS){
        const d=newTotal>=400?Math.floor(bet*3.5):newTotal>=300?Math.floor(bet*1.8):newTotal>=220?Math.floor(bet*1.1):-bet;
        onPnl(d);setPhase('done');
        addChat('🏆',`Final: ${newTotal} pts · ${d>=0?'+'+d:d} CUTBAR`,true);
        toast(newTotal>=400?`🎯 LEGEND! ${newTotal}pts +${d}`:newTotal>=300?`🏹 Great! ${newTotal}pts +${d}`:`${newTotal}pts ${d<0?d:'+'+d}`);
      } else {
        setArrow(a=>a+1);setPhase('aim');setLastShot(null);
      }
    },1400);
  };

  const reset=()=>{setArrow(1);setAngle(45);setPower(3);setTotalScore(0);setPhase('aim');setLastShot(null);setShots([]);addChat('🏹','New round! 5 arrows. Read the wind!',true);};

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'7px 14px',background:'var(--panel)',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
          <div><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)'}}>SCORE</div><div style={{fontSize:24,fontWeight:800,color:'var(--gold)'}}>{totalScore}</div></div>
          <div style={{textAlign:'center'}}><div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>Arrow {Math.min(arrow,5)} / 5</div><div style={{fontSize:10,fontWeight:700,color:'var(--text)'}}>Target ≥300 for ×2</div></div>
          <div><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',textAlign:'right'}}>BEST</div><div style={{fontSize:18}}>{shots.some(s=>s.bullseye)?'🎯':'🏹'}</div></div>
        </div>
        <div style={{display:'flex',gap:3}}>{Array.from({length:5},(_,i)=><div key={i} style={{flex:1,height:5,borderRadius:3,background:i<shots.length?(shots[i].sc>=90?'var(--gold)':shots[i].sc>=60?'var(--g)':'var(--td)'):'var(--b)'}}/>)}</div>
      </div>
      <div style={{padding:'8px 14px',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        {phase==='aim'&&<div>
          <div style={{display:'flex',gap:10,marginBottom:7,alignItems:'center'}}>
            <div style={{flex:1}}><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:3}}>ANGLE: {angle}°</div><input type="range" min="0" max="90" value={angle} onChange={e=>setAngle(Number(e.target.value))} style={{width:'100%',accentColor:'var(--gold)'}}/></div>
            <div style={{flex:1}}><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:3}}>POWER: {power}</div><input type="range" min="1" max="5" value={power} onChange={e=>setPower(Number(e.target.value))} style={{width:'100%',accentColor:'var(--cyan)'}}/></div>
          </div>
          <button onClick={shoot} style={{width:'100%',padding:'8px',borderRadius:9,background:'linear-gradient(135deg,#886600,var(--gold))',border:'none',color:'#000',fontFamily:'var(--display)',fontSize:13,fontWeight:700,cursor:'pointer'}}>🏹 RELEASE ARROW</button>
        </div>}
        {phase==='flight'&&lastShot&&<div style={{textAlign:'center',padding:'4px 0'}}><span style={{fontSize:24}}>{lastShot.bullseye?'🎯':'🏹'}</span><div style={{fontSize:11,fontWeight:700,color:lastShot.bullseye?'var(--gold)':'var(--text)',marginTop:2}}>{lastShot.sc} points{lastShot.bullseye?' · BULLSEYE!':''}</div><div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>Wind: {lastShot.windShift>0?'+':''}{lastShot.windShift}°</div></div>}
        {phase==='done'&&<div style={{textAlign:'center',padding:'4px 0'}}><div style={{fontSize:13,fontWeight:800,color:'var(--gold)',marginBottom:4}}>{totalScore} / 500 pts</div><button onClick={reset} style={{padding:'6px 18px',borderRadius:8,background:'rgba(255,215,0,.1)',border:'1px solid var(--gold)',color:'var(--gold)',fontSize:11,cursor:'pointer'}}>🏹 Shoot Again</button></div>}
      </div>
      <GameChat chat={chat} onSend={handleSend} quick={['Bullseye! 🎯','Windy! 🌬️','Close!','GG 🏹']} roomName="Blind Archer" bet={bet} onBetChange={null} balance={cb}/>
    </div>
  );
}

// ── CutbarJungGame ───────────────────────────────────────────
export function CutbarJungGame({toast,bet,onPnl}){
  const ATTACKS=[
    {id:'headbutt',emoji:'🤜',label:'Headbutt',dmg:[18,28],miss:0.2,counter:0.1},
    {id:'sidestep',emoji:'💨',label:'Sidestep',dmg:[8,14],miss:0.05,counter:0.35},
    {id:'hornjab',emoji:'🐂',label:'Horn Jab',dmg:[25,38],miss:0.35,counter:0.15},
    {id:'charge',emoji:'⚡',label:'Full Charge',dmg:[35,50],miss:0.5,counter:0.2},
    {id:'dodge',emoji:'🛡️',label:'Dodge+Block',dmg:[5,10],miss:0.0,counter:0.55},
  ];
  const BOT_MOVES=['headbutt','hornjab','sidestep','charge','headbutt','sidestep','hornjab'];
  const [youHp,setYouHp]=useState(100);
  const [botHp,setBotHp]=useState(100);
  const [turn,setTurn]=useState(1);
  const [phase,setPhase]=useState('fight'); // fight|result|done
  const [lastTurn,setLastTurn]=useState(null);
  const {chat,addChat,handleSend,balance:cb}=useGameChat([
    {u:'🐑',m:'CUTBAR JUNG! Your 🐑 vs Bot 🐑. Hard horns, sharp instincts. Reduce bot HP to 0!',t:tNow(),sys:true},
    {u:'Khachi',m:'My sheep ate gunpowder this morning 💥 Come fight!',t:tNow()},
  ],5000);

  const fight=(atk)=>{
    if(phase!=='fight')return;
    setPhase('result');
    const r=Math.random();
    // Your attack
    let yourDmg=0,yourMsg='';
    if(r<atk.miss){yourMsg=`💨 Missed! Bot dodged your ${atk.label}!`;}
    else if(r<atk.miss+atk.counter){yourMsg=`🔄 COUNTERED! Bot blocks and retaliates!`;yourDmg=0;}
    else{yourDmg=atk.dmg[0]+Math.floor(Math.random()*(atk.dmg[1]-atk.dmg[0]));yourMsg=`${atk.emoji} Your ${atk.label} hits for ${yourDmg} damage!`;}
    // Bot attack — picks strongest available move each turn for house edge
    const botAtk=ATTACKS.find(a=>a.id===BOT_MOVES[(turn-1)%BOT_MOVES.length])||ATTACKS[0];
    const r2=Math.random();
    let botDmg=0,botMsg='';
    if(r2<botAtk.miss*0.45){botMsg=`💨 Bot's ${botAtk.label} missed!`;} // Bot misses less
    else{botDmg=botAtk.dmg[0]+Math.floor(Math.random()*(botAtk.dmg[1]-botAtk.dmg[0]));botMsg=`🤖 Bot ${botAtk.label} hits you for ${botDmg}!`;}
    const newYouHp=Math.max(0,youHp-botDmg);
    const newBotHp=Math.max(0,botHp-yourDmg);
    setYouHp(newYouHp);setBotHp(newBotHp);
    setLastTurn({yourDmg,botDmg,yourMsg,botMsg,atk,botAtk});
    addChat(yourDmg>botDmg?'💪':'😤',`Turn ${turn}: ${yourMsg} | ${botMsg}`,true);

    setTimeout(()=>{
      if(newBotHp<=0||newYouHp<=0){
        const won=newBotHp<=0&&newYouHp>0;const draw=newBotHp<=0&&newYouHp<=0;
        const d=won?Math.floor(bet*1.7):draw?0:-bet;
        onPnl(d);setPhase('done');
        addChat(won?'🏆':'💀',`${won?'YOUR SHEEP WINS':'BOT SHEEP WINS'}${draw?' (DRAW)':''} · ${d>=0?'+'+d:d} CUTBAR`,true);
        toast(won?`🐑 WIN! +${d}`:`💀 ${d}`);
      } else {setTurn(t=>t+1);setPhase('fight');setLastTurn(null);}
    },1400);
  };

  const reset=()=>{setYouHp(100);setBotHp(100);setTurn(1);setPhase('fight');setLastTurn(null);addChat('🐑','New fight! HP reset to 100. Horns sharp!',true);};
  const HpBar=({hp,color})=><div style={{flex:1,height:8,borderRadius:4,background:'var(--b)',overflow:'hidden'}}><div style={{width:`${hp}%`,height:'100%',background:color,transition:'width .4s',borderRadius:4}}/></div>;

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'7px 14px',background:'var(--panel)',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
          <div style={{flex:1}}><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:2}}>🐑 YOU  {youHp}HP</div><HpBar hp={youHp} color="var(--g)"/></div>
          <div style={{padding:'0 10px',fontSize:11,color:'var(--td)',fontFamily:'var(--mono)'}}>T{turn}</div>
          <div style={{flex:1}}><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:2,textAlign:'right'}}>BOT 🐑 {botHp}HP</div><HpBar hp={botHp} color="var(--red)"/></div>
        </div>
      </div>
      <div style={{padding:'7px 14px',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        {phase==='fight'&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5}}>{ATTACKS.map(a=><div key={a.id} onClick={()=>fight(a)} style={{padding:'7px 6px',borderRadius:9,border:'1px solid var(--bb)',background:'rgba(0,255,65,.04)',display:'flex',flexDirection:'column',alignItems:'center',gap:2,cursor:'pointer',transition:'all .15s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--g)';e.currentTarget.style.background='rgba(0,255,65,.12)';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--bb)';e.currentTarget.style.background='rgba(0,255,65,.04)';}}>
          <span style={{fontSize:18}}>{a.emoji}</span><span style={{fontSize:9,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700}}>{a.label}</span><span style={{fontSize:7,color:'var(--td)',fontFamily:'var(--mono)'}}>{a.dmg[0]}-{a.dmg[1]}dmg</span>
        </div>)}</div>}
        {phase==='result'&&lastTurn&&<div style={{display:'flex',justifyContent:'space-around',alignItems:'center',padding:'4px 0'}}><div style={{textAlign:'center'}}><div style={{fontSize:16}}>{lastTurn.yourDmg>0?lastTurn.atk.emoji:'💨'}</div><div style={{fontSize:10,fontWeight:700,color:'var(--g)'}}>-{lastTurn.yourDmg}</div></div><div style={{fontSize:20}}>⚡</div><div style={{textAlign:'center'}}><div style={{fontSize:16}}>{lastTurn.botDmg>0?lastTurn.botAtk.emoji:'💨'}</div><div style={{fontSize:10,fontWeight:700,color:'var(--red)'}}>-{lastTurn.botDmg}</div></div></div>}
        {phase==='done'&&<div style={{textAlign:'center',padding:'4px 0'}}><div style={{fontSize:13,fontWeight:800,color:youHp>0&&botHp<=0?'var(--g)':'var(--red)',marginBottom:4}}>{youHp>0&&botHp<=0?'🐑 YOUR SHEEP WINS!':'💀 BOT SHEEP WINS'}</div><button onClick={reset} style={{padding:'6px 16px',borderRadius:8,background:'rgba(0,255,65,.1)',border:'1px solid var(--bb)',color:'var(--g)',fontSize:11,cursor:'pointer'}}>🐑 Rematch</button></div>}
      </div>
      <GameChat chat={chat} onSend={handleSend} quick={['Charge! ⚡','DODGE! 🛡️','GG 🐑','RIP 💀']} roomName="Cutbar Jung" bet={bet} onBetChange={null} balance={cb}/>
    </div>
  );
}

// ── KokarFightGame ───────────────────────────────────────────
export function KokarFightGame({toast,bet,onPnl}){
  const MOVES=[
    {id:'claw',emoji:'🦅',label:'Claw Strike',beats:'peck',color:'#ff3b5c'},
    {id:'peck',emoji:'💥',label:'Beak Peck',beats:'dodge',color:'#ff7a00'},
    {id:'dodge',emoji:'🌀',label:'Wing Dodge',beats:'claw',color:'#00e5ff'},
  ];
  const BOT_PICKS=()=>MOVES[Math.floor(Math.random()*3)];
  const [youPts,setYouPts]=useState(0);
  const [botPts,setBotPts]=useState(0);
  const [round,setRound]=useState(1);
  const [phase,setPhase]=useState('pick');
  const [lastRound,setLastRound]=useState(null);
  const [roundHistory,setRoundHistory]=useState([]);
  const {chat,addChat,handleSend,balance:cb}=useGameChat([
    {u:'🐓',m:'KOKAR FIGHT! Curved claws, survival instinct. CLAW beats PECK · DODGE beats CLAW · PECK beats DODGE. First to 5 wins!',t:tNow(),sys:true},
    {u:'Khachi',m:'My rooster trained in the mountains. Prepare yourself! 🐓⚔️',t:tNow()},
  ],5000);

  const pick=(move)=>{
    if(phase!=='pick')return;
    const bot=BOT_PICKS();
    const youWin=move.beats===bot.id;
    const draw=move.id===bot.id;
    const botWin=!youWin&&!draw;
    const newYou=youPts+(youWin?1:0);
    const newBot=botPts+(botWin?1:0);
    setYouPts(newYou);setBotPts(newBot);
    setLastRound({you:move,bot,youWin,draw,botWin});
    setRoundHistory(h=>[...h,{r:round,youWin,draw}]);
    const resultMsg=draw?`🤝 DRAW! Both picked ${move.label}`:(youWin?`${move.emoji} YOUR ${move.label} BEATS bot's ${bot.label}! +1pt`:`${bot.emoji} Bot's ${bot.label} BEATS your ${move.label}! +1pt bot`);
    addChat(youWin?'🏆':draw?'🤝':'💀',resultMsg,true);
    setPhase('result');

    setTimeout(()=>{
      if(newYou>=5||newBot>=5||round>=9){
        const won=newYou>newBot;const isDraw=newYou===newBot;
        const d=won?Math.floor(bet*2):isDraw?0:-bet;
        onPnl(d);setPhase('done');
        addChat(won?'🐓':'😤',`FIGHT OVER! ${newYou}-${newBot} · ${d>=0?'+'+d:d} CUTBAR`,true);
        toast(won?`🐓 WIN! ${newYou}-${newBot} +${d}`:`${newYou}-${newBot} -${bet}`);
      } else {setRound(r=>r+1);setPhase('pick');setLastRound(null);}
    },1400);
  };

  const reset=()=>{setYouPts(0);setBotPts(0);setRound(1);setPhase('pick');setLastRound(null);setRoundHistory([]);addChat('🐓','New fight! First to 5 wins!',true);};

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'7px 14px',background:'var(--panel)',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
          <div style={{textAlign:'center'}}><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)'}}>🐓 YOU</div><div style={{fontSize:26,fontWeight:800,color:'var(--g)'}}>{youPts}</div></div>
          <div style={{textAlign:'center'}}><div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>Round {Math.min(round,9)}/9</div><div style={{fontSize:10,fontWeight:700,color:phase==='done'?'var(--gold)':'var(--text)'}}>First to 5</div></div>
          <div style={{textAlign:'center'}}><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)'}}>BOT 🐓</div><div style={{fontSize:26,fontWeight:800,color:'var(--red)'}}>{botPts}</div></div>
        </div>
        <div style={{display:'flex',gap:3}}>{Array.from({length:9},(_,i)=><div key={i} style={{flex:1,height:5,borderRadius:3,background:i<roundHistory.length?(roundHistory[i].youWin?'var(--g)':roundHistory[i].draw?'var(--gold)':'var(--red)'):'var(--b)'}}/>)}</div>
      </div>
      <div style={{padding:'7px 14px',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        {phase==='pick'&&<div style={{display:'flex',gap:6}}>{MOVES.map(m=><div key={m.id} onClick={()=>pick(m)} style={{flex:1,padding:'10px 4px',borderRadius:10,border:`2px solid ${m.color}44`,background:`${m.color}08`,display:'flex',flexDirection:'column',alignItems:'center',gap:3,cursor:'pointer',transition:'all .15s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor=m.color;e.currentTarget.style.background=m.color+'18';}} onMouseLeave={e=>{e.currentTarget.style.borderColor=m.color+'44';e.currentTarget.style.background=m.color+'08';}}>
          <span style={{fontSize:22}}>{m.emoji}</span><span style={{fontSize:9,fontFamily:'var(--mono)',fontWeight:700,color:m.color,textAlign:'center'}}>{m.label}</span>
        </div>)}</div>}
        {phase==='result'&&lastRound&&<div style={{display:'flex',justifyContent:'space-around',alignItems:'center',padding:'6px 0'}}><div style={{textAlign:'center'}}><span style={{fontSize:22}}>{lastRound.you.emoji}</span><div style={{fontSize:9,color:'var(--g)',fontFamily:'var(--mono)'}}>{lastRound.you.label}</div></div><div style={{fontSize:18,color:lastRound.youWin?'var(--g)':lastRound.draw?'var(--gold)':'var(--red)'}}>{lastRound.youWin?'WIN':'DRAW'||lastRound.botWin?'LOSE':''}</div><div style={{textAlign:'center'}}><span style={{fontSize:22}}>{lastRound.bot.emoji}</span><div style={{fontSize:9,color:'var(--red)',fontFamily:'var(--mono)'}}>BOT</div></div></div>}
        {phase==='done'&&<div style={{textAlign:'center',padding:'4px 0'}}><div style={{fontSize:13,fontWeight:800,color:youPts>botPts?'var(--g)':'var(--red)',marginBottom:4}}>{youPts>botPts?'🐓 YOUR ROOSTER WINS!':'💀 BOT WINS'}</div><button onClick={reset} style={{padding:'6px 16px',borderRadius:8,background:'rgba(0,229,255,.1)',border:'1px solid var(--cyan)',color:'var(--cyan)',fontSize:11,cursor:'pointer'}}>🐓 Rematch</button></div>}
      </div>
      <GameChat chat={chat} onSend={handleSend} quick={['Claw! 🦅','Dodge! 🌀','GG 🐓','FIGHT! ⚔️']} roomName="Kokar Fight" bet={bet} onBetChange={null} balance={cb}/>
    </div>
  );
}

// ── TaekwondoGame ────────────────────────────────────────────
export function TaekwondoGame({toast,bet,onPnl}){
  const COMBOS=[
    {id:'kick',emoji:'🦵',label:'High Kick',beats:'punch',power:3,stamina:2,color:'#ff3b5c'},
    {id:'punch',emoji:'👊',label:'Iron Fist',beats:'block',power:2,stamina:1,color:'#ff7a00'},
    {id:'block',emoji:'🤺',label:'Steel Block',beats:'kick',power:1,stamina:0,color:'#00e5ff'},
    {id:'sweep',emoji:'🌪️',label:'Leg Sweep',beats:'punch',power:4,stamina:3,color:'#9945ff'},
    {id:'strike',emoji:'✋',label:'Palm Strike',beats:'block',power:3,stamina:2,color:'#ffd700'},
  ];
  const TECHS=['Yeop Chagi','Dollyo Chagi','Naeryo Chagi','Yop Makki','Ap Chagi','Momtong Punch'];
  const [youStam,setYouStam]=useState(10);
  const [round,setRound]=useState(1);
  const [exchange,setExchange]=useState(1);
  const [roundWins,setRoundWins]=useState([]);
  const [exchWins,setExchWins]=useState({you:0,bot:0});
  const [phase,setPhase]=useState('fight');
  const [lastEx,setLastEx]=useState(null);
  const [chain,setChain]=useState(0);
  const {chat,addChat,handleSend,balance:cb}=useGameChat([
    {u:'🥋',m:'TAEKWONDO! Korean + Chinese + Japanese martial arts fusion. KICK > PUNCH > BLOCK > KICK. Win 2 rounds to claim the pot!',t:tNow(),sys:true},
    {u:'Khachi',m:'I trained 10 years in the mountains. Show me your best 🥋',t:tNow()},
  ],5000);

  const doMove=(combo)=>{
    if(phase!=='fight')return;
    if(youStam<combo.stamina){addChat('😤','Not enough stamina! Pick a lighter move.',false);return;}
    const botCombo=COMBOS[Math.floor(Math.random()*COMBOS.length)];
    // House edge: bot 15% chance to read and counter perfectly
    const botReads=Math.random()<0.15;
    const youWin=!botReads&&(combo.beats===botCombo.id||combo.power>botCombo.power+1);
    const draw=combo.id===botCombo.id;
    const botWin=!youWin&&!draw;
    const newChain=youWin?chain+1:0;
    setChain(newChain);
    setYouStam(s=>Math.max(0,s-combo.stamina));
    const tech=TECHS[Math.floor(Math.random()*TECHS.length)];
    const msg=draw?`🤝 Clash! ${combo.label} vs ${botCombo.label} — ${tech}!`:(youWin?`${combo.emoji} ${tech}! Your ${combo.label} scores!${newChain>1?' 🔥 x'+newChain+' CHAIN!':''}`:`${botCombo.emoji} Bot's ${botCombo.label} — ${tech}! Counter!`);
    addChat(youWin?'🥋':draw?'🤝':'💥',msg,true);
    const newExchWins={you:exchWins.you+(youWin?1:0),bot:exchWins.bot+(botWin?1:0)};
    setExchWins(newExchWins);
    setLastEx({combo,botCombo,youWin,draw,botWin,tech,chain:newChain});
    setPhase('result');

    setTimeout(()=>{
      if(exchange>=5){
        const rWon=newExchWins.you>newExchWins.bot;
        const newRoundWins=[...roundWins,rWon?'you':'bot'];
        setRoundWins(newRoundWins);
        addChat(rWon?'🏆':'💀',`Round ${round} end: ${newExchWins.you}-${newExchWins.bot} · ${rWon?'YOU WIN round!':'BOT wins round'}`,true);
        if(round>=3||newRoundWins.filter(r=>r==='you').length>=2||newRoundWins.filter(r=>r==='bot').length>=2){
          const youRndWins=newRoundWins.filter(r=>r==='you').length;
          const perfect=youRndWins===3;
          const won=youRndWins>newRoundWins.filter(r=>r==='bot').length;
          const d=perfect?Math.floor(bet*3.5):won?Math.floor(bet*1.7):won===false&&!perfect?-bet:0;
          onPnl(d);setPhase('done');
          addChat(won?'🥋':'💀',`${perfect?'PERFECT! ':''}${youRndWins} rounds won · ${d>=0?'+'+d:d} CUTBAR`,true);
          toast(perfect?`🥋 PERFECT! ×4 +${d}`:won?`🥋 WIN! +${d}`:`-${bet}`);
        } else {setRound(r=>r+1);setExchange(1);setExchWins({you:0,bot:0});setYouStam(10);setPhase('fight');setLastEx(null);addChat('🥋',`Round ${round+1} begins! Stamina restored.`,true);}
      } else {setExchange(e=>e+1);setPhase('fight');setLastEx(null);}
    },1300);
  };

  const reset=()=>{setYouStam(10);setRound(1);setExchange(1);setRoundWins([]);setExchWins({you:0,bot:0});setPhase('fight');setLastEx(null);setChain(0);addChat('🥋','New match! 3 rounds of 5 exchanges. FIGHT!',true);};

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'7px 14px',background:'var(--panel)',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
          <div style={{textAlign:'center'}}><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)'}}>STAMINA</div><div style={{fontSize:20,fontWeight:800,color:youStam>5?'var(--g)':youStam>2?'var(--gold)':'var(--red)'}}>{youStam}/10</div></div>
          <div style={{textAlign:'center'}}><div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>Round {round}/3 · Ex {exchange}/5</div><div style={{display:'flex',gap:4,marginTop:2,justifyContent:'center'}}>{[0,1,2].map(i=><span key={i} style={{fontSize:12}}>{roundWins[i]==='you'?'🏆':roundWins[i]==='bot'?'💀':'⬜'}</span>)}</div></div>
          <div style={{textAlign:'center'}}><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)'}}>EXCHANGE</div><div style={{fontSize:14,fontWeight:800,color:'var(--cyan)'}}>{exchWins.you}-{exchWins.bot}</div></div>
        </div>
      </div>
      <div style={{padding:'7px 14px',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        {phase==='fight'&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:5}}>{COMBOS.map(c=><div key={c.id} onClick={()=>doMove(c)} style={{padding:'7px 3px',borderRadius:9,border:`1px solid ${youStam<c.stamina?'var(--b)':c.color+'44'}`,background:youStam<c.stamina?'var(--bg3)':`${c.color}08`,display:'flex',flexDirection:'column',alignItems:'center',gap:2,cursor:youStam<c.stamina?'not-allowed':'pointer',opacity:youStam<c.stamina?.4:1,transition:'all .15s'}} onMouseEnter={e=>{if(youStam>=c.stamina){e.currentTarget.style.borderColor=c.color;e.currentTarget.style.background=c.color+'18';}}} onMouseLeave={e=>{e.currentTarget.style.borderColor=c.color+'44';e.currentTarget.style.background=c.color+'08';}}>
          <span style={{fontSize:16}}>{c.emoji}</span><span style={{fontSize:8,fontFamily:'var(--mono)',fontWeight:700,color:c.color,textAlign:'center'}}>{c.label}</span><span style={{fontSize:7,color:'var(--td)',fontFamily:'var(--mono)'}}>-{c.stamina}⚡</span>
        </div>)}</div>}
        {phase==='result'&&lastEx&&<div style={{display:'flex',justifyContent:'space-around',alignItems:'center',padding:'4px 0'}}><div style={{textAlign:'center'}}><span style={{fontSize:20}}>{lastEx.combo.emoji}</span><div style={{fontSize:9,fontFamily:'var(--mono)',color:lastEx.youWin?'var(--g)':'var(--td)'}}>{lastEx.tech}</div></div><div style={{fontSize:16,color:lastEx.youWin?'var(--g)':lastEx.draw?'var(--gold)':'var(--red)'}}>{lastEx.youWin?'WIN':lastEx.draw?'DRAW':'LOSE'}</div><div style={{textAlign:'center'}}><span style={{fontSize:20}}>{lastEx.botCombo.emoji}</span><div style={{fontSize:9,fontFamily:'var(--mono)',color:'var(--red)'}}>BOT</div></div></div>}
        {phase==='done'&&<div style={{textAlign:'center',padding:'4px 0'}}><div style={{fontSize:13,fontWeight:800,color:roundWins.filter(r=>r==='you').length>1?'var(--g)':'var(--red)',marginBottom:4}}>{roundWins.filter(r=>r==='you').length>1?'🥋 YOU WIN!':'💀 BOT WINS'}</div><button onClick={reset} style={{padding:'6px 16px',borderRadius:8,background:'rgba(153,69,255,.1)',border:'1px solid rgba(153,69,255,.5)',color:'#b57aff',fontSize:11,cursor:'pointer'}}>🥋 Rematch</button></div>}
      </div>
      <GameChat chat={chat} onSend={handleSend} quick={['HIYAAA! 🥋','Dodge! 🌀','Chain! 🔥','GG 🏆']} roomName="Taekwondo" bet={bet} onBetChange={null} balance={cb}/>
    </div>
  );
}
