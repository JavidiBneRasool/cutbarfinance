import { useState, useRef } from 'react';
import { BackBar } from '../components/primitives';

export default function UpDownPage({ toast, bp, onBack }) {
  const [sel,setSel]=useState(null);const [res,setRes]=useState(null);const [score,setScore]=useState(0);const [bet,setBet]=useState(100);const [cd,setCd]=useState(null);const [hist,setHist]=useState([]);
  const live=bp['BTCUSDT'];const price=live&&live.price?live.price:67432;const ref=useRef(price);
  function predict(dir){
    if(cd!==null)return;
    setSel(dir);setRes(null);ref.current=price;
    var c=10;setCd(c);
    var t=setInterval(function(){
      c--;setCd(c);
      if(c<=0){clearInterval(t);setCd(null);var np=price+(Math.random()-.48)*price*.003;var actual=np>ref.current?'up':'down';var won=actual===dir;var wa=won?Math.floor(bet*1.9):-bet;setRes({won,np:np.toFixed(2),op:ref.current.toFixed(2),actual,wa});setScore(s=>s+wa);setHist(h=>[{dir,actual,won,wa},...h.slice(0,6)]);toast(won?'🎉 +'+wa+' CUTBAR!':'❌ '+wa+' CUTBAR');}
    },1000);
  }
  return(
    <div className="fu">
      <BackBar title="BTC Up or Down?" onBack={onBack} right={<div style={{textAlign:'right'}}><div style={{fontSize:8,color:'var(--td)',fontFamily:'var(--mono)'}}>SCORE</div><div style={{fontSize:14,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700}}>{score} CUTBAR</div></div>}/>
      <div style={{margin:'0 14px 12px',background:'linear-gradient(135deg,#091a0c,#040e07)',border:'1px solid var(--bb)',borderRadius:16,padding:'18px 16px',textAlign:'center'}}>
        <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:6}}>BTC/USDT · BINANCE LIVE</div>
        <div style={{fontFamily:'var(--display)',fontSize:42,color:'var(--g)',letterSpacing:.5}}>${price.toLocaleString('en',{maximumFractionDigits:2})}</div>
        {live&&<div style={{fontSize:11,color:live.change>=0?'var(--g)':'var(--red)',fontFamily:'var(--mono)',marginTop:5}}>{live.change>=0?'▲':'▼'}{Math.abs(live.change).toFixed(2)}%</div>}
        {cd!==null&&<div style={{marginTop:12,fontFamily:'var(--display)',fontSize:44,color:'var(--gold)'}}>{cd}</div>}
        {res&&<div style={{marginTop:12,padding:12,background:res.won?'rgba(0,255,65,.1)':'rgba(255,59,92,.1)',borderRadius:10,border:'1px solid '+(res.won?'rgba(0,255,65,.3)':'rgba(255,59,92,.3)')}}>
          <div style={{fontSize:18,color:res.won?'var(--g)':'var(--red)',fontFamily:'var(--display)',letterSpacing:1,marginBottom:4}}>{res.won?'✅ CORRECT!':'❌ WRONG!'}</div>
          <div style={{fontSize:11,color:'var(--text)',fontFamily:'var(--mono)',marginBottom:4}}>${res.op} → ${res.np} ({res.actual.toUpperCase()})</div>
          <div style={{fontSize:14,color:res.won?'var(--g)':'var(--red)',fontFamily:'var(--mono)',fontWeight:700}}>{res.won?'+':''}{res.wa} CUTBAR</div>
        </div>}
      </div>
      <div style={{margin:'0 14px 10px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:12,padding:12}}>
        <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,display:'block',marginBottom:8,textTransform:'uppercase'}}>Bet Amount (CUTBAR)</div>
        <div style={{display:'flex',gap:7}}>
          {[25,50,100,250,500].map(b=><div key={b} onClick={()=>{if(cd===null)setBet(b);}} style={{flex:1,padding:8,textAlign:'center',borderRadius:9,background:bet===b?'rgba(0,255,65,.15)':'var(--bg3)',border:'1px solid '+(bet===b?'var(--bb)':'var(--b)'),fontFamily:'var(--mono)',fontSize:10,color:bet===b?'var(--g)':'var(--td)',cursor:'pointer'}}>{b}</div>)}
        </div>
      </div>
      <div style={{display:'flex',gap:10,margin:'0 14px 12px'}}>
        <button onClick={()=>predict('up')} disabled={cd!==null} style={{flex:1,padding:'20px 10px',borderRadius:14,border:'2px solid '+(sel==='up'?'rgba(0,255,65,.3)':'rgba(128,128,128,.2)'),background:sel==='up'?'rgba(0,255,65,.15)':'transparent',color:'var(--g)',fontFamily:'var(--display)',fontSize:24,cursor:cd!==null?'not-allowed':'pointer',opacity:cd!==null?0.6:1,letterSpacing:.5}}>▲ UP</button>
        <button onClick={()=>predict('down')} disabled={cd!==null} style={{flex:1,padding:'20px 10px',borderRadius:14,border:'2px solid '+(sel==='down'?'rgba(255,59,92,.3)':'rgba(128,128,128,.2)'),background:sel==='down'?'rgba(255,59,92,.15)':'transparent',color:'var(--red)',fontFamily:'var(--display)',fontSize:24,cursor:cd!==null?'not-allowed':'pointer',opacity:cd!==null?0.6:1,letterSpacing:.5}}>▼ DOWN</button>
      </div>
      {hist.length>0&&<div style={{margin:'0 14px 14px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:12,padding:12}}>
        <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:8,textTransform:'uppercase'}}>History</div>
        {hist.map((h,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
          <div style={{display:'flex',gap:7,alignItems:'center'}}><span style={{fontSize:12}}>{h.won?'✅':'❌'}</span><span style={{fontSize:11,fontFamily:'var(--mono)',color:'var(--text)'}}>Bet {h.dir.toUpperCase()} · {h.actual.toUpperCase()}</span></div>
          <span style={{fontSize:11,fontFamily:'var(--mono)',color:h.won?'var(--g)':'var(--red)',fontWeight:700}}>{h.won?'+':''}{h.wa} CUTBAR</span>
        </div>)}
      </div>}
    </div>
  );
}
