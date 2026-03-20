import { useState } from 'react';
import { useGameChat } from '../features/games/useGameChat';
import { getCricketCommentary, getPredictionMsg, tNow } from '../features/games/gameHelpers';
import GameChat from './GameChat';

export function EightBallGame({ toast, bet, onPnl }) {
  const OT=['DOT','1','2','4','6','WICKET'];
  const OC={DOT:'var(--td)',1:'var(--text)',2:'var(--cyan)',4:'#00e5ff',6:'var(--g)',WICKET:'var(--red)'};
  const OE={DOT:'•',1:'1',2:'2',4:'4️⃣',6:'6️⃣',WICKET:'🏏'};

  const [currentBall, setCurrentBall] = useState(0);
  const [myPick,      setMyPick]      = useState(null);
  const [ballResults, setBallResults] = useState([]);
  const [phase,       setPhase]       = useState('pick');
  const [revealing,   setRevealing]   = useState(false);
  const [lastReveal,  setLastReveal]  = useState(null);
  const {chat, addChat, handleSend, balance: chatBalance} = useGameChat([
    {u:'🎱',m:"8Ball Cricket — ball by ball. 8 rounds. Pick your prediction for each ball.",t:tNow(),sys:true},
    {u:'Khachi',m:'Predict wisely. 5+ correct = big money 👀',t:tNow()},
  ], 5000);

  const correctCount = ballResults.filter(r=>r.correct).length;
  const TOTAL = 8;
  const overNum = 345;
  const PTABLE=[['0-2','Loss'],['3','Refund'],['4','×2'],['5','×5'],['6','×10'],['7','×25'],['8','×50']];

  const rollBall = () => {
    const ws=[25,20,15,20,10,10]; const tot=ws.reduce((a,b)=>a+b,0);
    let r=Math.random()*tot;
    for(let i=0;i<OT.length;i++){r-=ws[i];if(r<=0)return OT[i];}
    return 'DOT';
  };

  const confirmPick = () => {
    if(!myPick||phase!=='pick'||revealing) return;
    setRevealing(true); setPhase('reveal');
    setTimeout(()=>{
      const actual=rollBall(); const correct=myPick===actual;
      const commentary=getCricketCommentary(actual);
      const result={pick:myPick,actual,correct,commentary,ball:currentBall+1};
      setLastReveal(result); setBallResults(prev=>[...prev,result]);
      addChat('🏏',`Over ${overNum}.${currentBall+1} — ${commentary}`,true);
      setTimeout(()=>{
        setRevealing(false);
        const nextBall=currentBall+1;
        if(nextBall>=TOTAL){finishOver([...ballResults,result]);}
        else{setCurrentBall(nextBall);setMyPick(null);setLastReveal(null);setPhase('pick');}
      },2800);
    },1400);
  };

  const finishOver = (results) => {
    const cor=results.filter(r=>r.correct).length;
    const d=cor===8?bet*40:cor===7?bet*18:cor===6?bet*7:cor===5?bet*3:cor===4?Math.floor(bet*.5):cor===3?0:-bet;
    onPnl(d); setPhase('done');
    addChat(cor>=5?'📢':'🏏',cor>=5?`🔥 @You dominated Over ${overNum} — ${cor}/8 correct! ${d>=0?'+'+d:d} CUTBAR`:`Over ${overNum} complete. ${cor}/8 correct. ${d>=0?'+'+d:d} CUTBAR`,true);
    toast(cor>=7?`🎱 LEGENDARY! ${cor}/8! +${d}`:cor>=5?`🔥 ${cor}/8 correct +${d}`:cor>=3?`${cor}/8 — refund`:`${cor}/8 — try again`);
  };

  const reset = () => {setCurrentBall(0);setMyPick(null);setBallResults([]);setPhase('pick');setRevealing(false);setLastReveal(null);addChat('🏏','New over begins! Ball 1 incoming...',true);};

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'8px 14px',background:'var(--panel)',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
          <div>
            <div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:1}}>OVER {overNum}</div>
            <div style={{fontSize:10,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700}}>{phase==='done'?`${correctCount}/8 correct`:`Ball ${currentBall+1} of ${TOTAL}`}</div>
          </div>
          <div style={{display:'flex',gap:2}}>
            {PTABLE.slice(2).map(([b,r])=>(
              <div key={b} style={{padding:'2px 4px',borderRadius:4,background:'var(--bg3)',border:'1px solid var(--b)',textAlign:'center'}}>
                <div style={{fontSize:7,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700}}>{r}</div>
                <div style={{fontSize:6,color:'var(--td)',fontFamily:'var(--mono)'}}>{b}✓</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:'flex',gap:3}}>
          {Array.from({length:TOTAL},(_,i)=>{
            const done=i<ballResults.length;const current=i===currentBall&&phase!=='done';const res=ballResults[i];
            return <div key={i} style={{flex:1,height:6,borderRadius:3,background:done?(res?.correct?'var(--g)':'var(--red)'):current?'var(--gold)':'var(--b)',boxShadow:current?'0 0 6px var(--gold)':'none',transition:'all .4s'}}/>;
          })}
        </div>
      </div>

      <div style={{padding:'8px 14px',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        {phase==='pick'&&(
          <div>
            <div style={{fontSize:10,color:'var(--text)',fontWeight:700,marginBottom:7,textAlign:'center'}}>Over {overNum}.{currentBall+1} — Pick your prediction</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:5,marginBottom:7}}>
              {OT.map(o=>(
                <div key={o} onClick={()=>setMyPick(o)}
                  style={{padding:'9px 4px',borderRadius:9,border:'2px solid '+(myPick===o?'var(--g)':'var(--b)'),background:myPick===o?'rgba(0,255,65,.15)':'var(--panel2)',display:'flex',flexDirection:'column',alignItems:'center',gap:2,cursor:'pointer',transition:'all .15s'}}>
                  <span style={{fontSize:16,fontWeight:800,color:myPick===o?'var(--g)':OC[o]||'var(--text)',fontFamily:'var(--mono)'}}>{OE[o]||o}</span>
                  <span style={{fontSize:8,color:myPick===o?'var(--g)':'var(--td)',fontFamily:'var(--mono)',fontWeight:700}}>{o}</span>
                </div>
              ))}
            </div>
            <button onClick={confirmPick} disabled={!myPick}
              style={{width:'100%',padding:'9px',borderRadius:9,background:myPick?'linear-gradient(135deg,var(--g2),var(--g))':'var(--bg3)',border:'none',color:myPick?'#000':'var(--td)',fontFamily:'var(--display)',fontSize:13,cursor:myPick?'pointer':'not-allowed',fontWeight:700}}>
              {myPick?`PREDICT ${myPick} →`:'SELECT TO PREDICT'}
            </button>
          </div>
        )}
        {phase==='reveal'&&(
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,minHeight:90,justifyContent:'center'}}>
            {!lastReveal?(
              <div style={{textAlign:'center'}}><div style={{fontSize:28,animation:'pulse 0.5s infinite'}}>🏏</div><div style={{fontSize:12,color:'var(--gold)',fontFamily:'var(--display)'}}>BOWLING...</div></div>
            ):(
              <div style={{width:'100%'}}>
                <div style={{display:'flex',justifyContent:'center',gap:14,marginBottom:6}}>
                  <div style={{textAlign:'center'}}><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:2}}>YOU</div><div style={{fontSize:22,fontWeight:800,color:'var(--td)',fontFamily:'var(--mono)'}}>{OE[lastReveal.pick]||lastReveal.pick}</div></div>
                  <div style={{display:'flex',alignItems:'center',fontSize:16,color:'var(--td)'}}>→</div>
                  <div style={{textAlign:'center'}}><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:2}}>ACTUAL</div><div style={{fontSize:22,fontWeight:800,color:OC[lastReveal.actual]||'var(--text)',fontFamily:'var(--mono)'}}>{OE[lastReveal.actual]||lastReveal.actual}</div></div>
                </div>
                <div style={{padding:'6px 10px',borderRadius:10,background:lastReveal.correct?'rgba(0,255,65,.1)':'rgba(255,59,92,.08)',border:'1px solid '+(lastReveal.correct?'rgba(0,255,65,.25)':'rgba(255,59,92,.2)'),textAlign:'center'}}>
                  <div style={{fontSize:12,fontWeight:800,color:lastReveal.correct?'var(--g)':'var(--red)'}}>{lastReveal.correct?'✅ CORRECT!':'❌ WRONG'}</div>
                  <div style={{fontSize:9,color:'var(--tm)',marginTop:2,lineHeight:1.4}}>{lastReveal.commentary}</div>
                </div>
              </div>
            )}
          </div>
        )}
        {phase==='done'&&(
          <div style={{textAlign:'center'}}>
            <div style={{display:'flex',justifyContent:'center',gap:3,marginBottom:6}}>
              {ballResults.map((r,i)=>(
                <div key={i} style={{width:22,height:22,borderRadius:6,background:r.correct?'rgba(0,255,65,.2)':'rgba(255,59,92,.15)',border:'1px solid '+(r.correct?'var(--g)':'var(--red)'),display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:r.correct?'var(--g)':'var(--red)',fontFamily:'var(--mono)',fontWeight:800}}>{OE[r.actual]||r.actual}</div>
              ))}
            </div>
            <div style={{fontSize:12,fontWeight:800,color:'var(--gold)',marginBottom:6}}>{correctCount}/8 correct</div>
            <button onClick={reset} style={{padding:'8px 20px',borderRadius:9,background:'rgba(0,255,65,.1)',border:'1px solid var(--bb)',color:'var(--g)',fontFamily:'var(--display)',fontSize:12,cursor:'pointer'}}>▶ NEXT OVER</button>
          </div>
        )}
      </div>
      <GameChat chat={chat} onSend={handleSend} quick={['Called it 😎','Six coming! 🔥','Wicket ball 🎯','Boundary! 4️⃣']} roomName="8Ball Cricket" bet={bet} balance={chatBalance}/>
    </div>
  );
}
