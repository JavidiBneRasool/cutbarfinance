import { useState, useRef, useEffect } from 'react';
import { BackBar, R, Txt } from '../components/primitives';

const KNOWLEDGE={cudbar:"CUTBAR token symbol is CUTBAR (BEP-20 on BSC). Token not yet listed — price $0.00 (pre-launch). Created by KHAN. Kashmiri word for male sheep 🐑 = resilience.",cutbar:"CUTBAR is a Web3 ecosystem by KHAN (Khachi). Token: CUTBAR · BSC · BEP-20. App: Home, Market, Trade, Bank, Fun, Wallet tabs. Real-time Binance + CoinGecko data.",price:"Live prices come from Binance + CoinGecko in real-time. CUTBAR token is pre-launch — price $0.00. Check Markets tab for 100+ live coins!",bank:"Bank tab: 🏦 Open CUTBAR Bank Account · 📲 UPI (user@cutbar) · 💳 GPay, PhonePe, Paytm, Visa, Mastercard · 🏦 Net Banking · ₹50,000 daily limit",games:"Fun zone: 🃏 cutPlay — LowCardOut, Dice Cricket, 8Ball, Goal9 · 🏆 Trading Tournaments · 🌾 Staking · 🔮 Up/Down BTC prediction with CUTBAR betting",p2p:"P2P trading in Wallet tab: VeerBhat_Pro 1,243 trades ⭐99.2% · SatoshiAlpha 567 trades ⭐98.7% · Khachi 42 trades ⭐100%. All escrow-protected!",wallet:"Wallet tabs: Overview (all assets live prices) · Spot (buy/sell) · Futures (Phase 4) · Margin (Phase 4) · P2P (peer-to-peer trading)"};

function localReply(msg){const l=msg.toLowerCase();for(const[k,v]of Object.entries(KNOWLEDGE))if(l.includes(k))return v;if(l.match(/hi|hello|hey|salam/))return"Hello! 👋 Ask about CUTBAR token, prices, bank, games, P2P, or wallet!";return"Try: CUTBAR, price, bank, games, P2P, wallet 🚀";}
function renderMd(t){return t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br/>');}

export default function ChatPage({ onBack }) {
  const [msgs,setMsgs]=useState([{r:'bot',t:"👋 Hello! I'm CUTBAR AI!\n\nToken: CUTBAR (BEP-20 · BSC)\nReal-time: Binance + CoinGecko\n\nAsk me anything about CUTBAR! 🐑",time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}]);
  const [input,setInput]=useState('');const [typing,setTyping]=useState(false);const [apiKey,setApiKey]=useState('');const [showKey,setShowKey]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[msgs,typing]);
  const add=(t,r)=>setMsgs(m=>[...m,{r,t,time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}]);
  const send=()=>{
    const msg=input.trim();if(!msg)return;setInput('');add(msg,'user');setTyping(true);
    if(apiKey){
      fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:300,system:'You are CUTBAR AI. Token CUTBAR BSC BEP-20 by KHAN from Kashmir. Be helpful and concise.',messages:[{role:'user',content:msg}]})})
        .then(r=>r.json()).then(d=>{setTyping(false);add((d.content&&d.content[0]&&d.content[0].text)||localReply(msg),'bot');}).catch(()=>{setTyping(false);add(localReply(msg),'bot');});
    }else{setTimeout(()=>{setTyping(false);add(localReply(msg),'bot');},500+Math.floor(Math.random()*400));}
  };
  return(
    <div className="fu" style={{display:'flex',flexDirection:'column',height:'calc(100vh - 120px)'}}>
      <BackBar title="CUTBAR AI" onBack={onBack} right={<div onClick={()=>setShowKey(!showKey)} style={{fontSize:9,color:apiKey?'var(--g)':'var(--td)',cursor:'pointer',border:'1px solid var(--b)',borderRadius:6,padding:'4px 8px',fontFamily:'var(--mono)',background:apiKey?'rgba(0,255,65,.07)':'transparent'}}>⚡{apiKey?'ON':'API'}</div>}/>
      {showKey&&<input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="Anthropic API key for live Claude AI..." style={{background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:11,borderRadius:7,padding:'7px 11px',margin:'0 14px 8px',outline:'none'}}/>}
      <div ref={ref} style={{flex:1,overflowY:'auto',padding:12,display:'flex',flexDirection:'column',gap:10}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{maxWidth:'84%',alignSelf:m.r==='bot'?'flex-start':'flex-end'}}>
            <div style={{padding:'9px 12px',borderRadius:m.r==='bot'?'4px 12px 12px 12px':'12px 4px 12px 12px',background:m.r==='bot'?'var(--panel2)':'rgba(0,255,65,.1)',border:`1px solid ${m.r==='bot'?'var(--b)':'rgba(0,255,65,.2)'}`,color:m.r==='bot'?'var(--text)':'var(--g)',fontSize:12,lineHeight:1.6,fontFamily:'var(--body)',fontWeight:500}} dangerouslySetInnerHTML={{__html:renderMd(m.t)}}/>
            <Txt size={8} color="var(--td)" mono={true} style={{display:'block',marginTop:2,padding:'0 3px',textAlign:m.r==='user'?'right':'left'}}>{m.time}</Txt>
          </div>
        ))}
        {typing&&<div style={{alignSelf:'flex-start'}}><div style={{padding:'9px 12px',borderRadius:'4px 12px 12px 12px',background:'var(--panel2)',border:'1px solid var(--b)',display:'inline-flex',gap:4,alignItems:'center'}}>{[0,.2,.4].map((d,i)=><span key={i} style={{width:5,height:5,background:'var(--td)',borderRadius:'50%',animation:`bounce 1.4s ${d}s infinite`}}/>)}</div></div>}
      </div>
      <div style={{display:'flex',gap:5,padding:'5px 12px',overflowX:'auto',flexShrink:0,borderTop:'1px solid var(--b)'}}>
        {['CUTBAR token','Open bank account','cutPlay games','P2P trading','Wallet tabs','Up/Down game'].map(q=><div key={q} onClick={()=>{setInput(q);setTimeout(send,30);}} style={{flexShrink:0,padding:'5px 10px',borderRadius:20,border:'1px solid var(--b)',background:'var(--panel)',color:'var(--td)',fontSize:9,cursor:'pointer',whiteSpace:'nowrap',fontFamily:'var(--body)',fontWeight:700}}>{q}</div>)}
      </div>
      <R gap={8} style={{padding:'8px 12px 10px',flexShrink:0}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ask CUTBAR AI..." rows={1} style={{flex:1,resize:'none',height:40,background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--body)',fontSize:12,borderRadius:20,padding:'9px 13px',outline:'none'}}/>
        <button onClick={send} style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,var(--g2),var(--g))',border:'none',cursor:'pointer',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>➤</button>
      </R>
    </div>
  );
}
