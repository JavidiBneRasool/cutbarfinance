import { useState, useEffect, useRef, useMemo } from 'react';

function useSmartPrompts(coins, bp, fg, page) {
  return useMemo(() => {
    const prompts = [];
    const btc = bp['BTCUSDT'];
    const eth = bp['ETHUSDT'];
    if (btc && btc.change <= -3) prompts.push({ id:'btc-drop', icon:'📉', label:'BTC SIGNAL',    text:`BTC dropped ${Math.abs(btc.change).toFixed(1)}% — buy opportunity?`, cta:'Trade BTC',   page:'trade',  color:'#ff3b5c', urgency:3 });
    if (btc && btc.change >= 4)  prompts.push({ id:'btc-pump', icon:'🚀', label:'BTC PUMPING',   text:`BTC is up ${btc.change.toFixed(1)}% — momentum trade?`,               cta:'Trade Now',  page:'trade',  color:'#00ff41', urgency:3 });
    if (eth && eth.change <= -4) prompts.push({ id:'eth-drop', icon:'⚡', label:'ETH DIP',       text:`ETH down ${Math.abs(eth.change).toFixed(1)}% in 24h`,                  cta:'Buy ETH',    page:'trade',  color:'#8d95d0', urgency:2 });
    if (fg && +fg.value < 25)    prompts.push({ id:'fear',  icon:'😱', label:'EXTREME FEAR',  text:'Market fear at '+fg.value+' — historically strong buy zone', cta:'Buy Dip',    page:'trade',  color:'#ff3b5c', urgency:3 });
    else if (fg && +fg.value > 80) prompts.push({ id:'greed', icon:'🤑', label:'EXTREME GREED', text:'Market greed at '+fg.value+' — consider taking profits',   cta:'View Markets',page:'market', color:'#ffd700', urgency:2 });
    const topGainer = coins.length ? [...coins].filter(c=>c.price_change_percentage_24h).sort((a,b)=>(b.price_change_percentage_24h||0)-(a.price_change_percentage_24h||0))[0] : null;
    const topLoser  = coins.length ? [...coins].filter(c=>c.price_change_percentage_24h).sort((a,b)=>(a.price_change_percentage_24h||0)-(b.price_change_percentage_24h||0))[0] : null;
    if (topGainer && topGainer.price_change_percentage_24h > 12) prompts.push({ id:'top-gain', icon:'🔥', label:'TOP GAINER', text:`${topGainer.symbol.toUpperCase()} up ${topGainer.price_change_percentage_24h.toFixed(1)}% — trending now`, cta:'View',    page:'market', color:'#00ff41', urgency:2 });
    if (topLoser  && topLoser.price_change_percentage_24h  < -12) prompts.push({ id:'top-lose', icon:'🩸', label:'TOP LOSER',  text:`${topLoser.symbol.toUpperCase()} down ${Math.abs(topLoser.price_change_percentage_24h).toFixed(1)}% — capitulation?`, cta:'Analyze', page:'market', color:'#ff3b5c', urgency:1 });
    prompts.push({ id:'yield',  icon:'💰', label:'IDLE FUNDS', text:'Idle balance earns nothing — Earn up to 18.66% APY', cta:'Earn Now', page:'earn',             color:'#ffd700', urgency:1 });
    prompts.push({ id:'stake',  icon:'🌾', label:'STAKING',    text:'Stake CUTBAR tokens for passive weekly rewards',     cta:'Stake',    page:'stake_tournament', color:'#00cc88', urgency:1 });
    prompts.push({ id:'arena',  icon:'⚔️', label:'ARENA OPEN', text:'New tournament live — compete for CUTBAR prize pool', cta:'Enter',   page:'tournaments',      color:'#ff7a00', urgency:1 });
    prompts.push({ id:'updown', icon:'🔮', label:'QUICK TRADE', text:'Predict BTC direction — win in 60 seconds',          cta:'Play',    page:'updown',           color:'#9945ff', urgency:1 });
    if (page==='market') prompts.unshift({ id:'ctx-market', icon:'⭐', label:'PRO TIP',   text:'Swipe to your Watchlist to track your top picks',    cta:'Watchlist',  page:'market',    color:'#00e5ff', urgency:1 });
    if (page==='trade')  prompts.unshift({ id:'ctx-trade',  icon:'📊', label:'CHART TIP', text:'Switch to Chart tab for full TradingView analysis',  cta:'Open Chart', page:'trade',     color:'#ffd700', urgency:1 });
    if (page==='wallet') prompts.unshift({ id:'ctx-wallet', icon:'🛡️', label:'SECURITY',  text:'Enable 2FA to protect your assets',                 cta:'Secure Now', page:'account',   color:'#00e5ff', urgency:2 });
    if (page==='bank')   prompts.unshift({ id:'ctx-pay',    icon:'💳', label:'CUTPAY',    text:'Set up UPI for instant payments with zero fees',     cta:'Setup UPI',  page:'cutbarupi', color:'#00e5ff', urgency:1 });
    if (page==='fun')    prompts.unshift({ id:'ctx-arena',  icon:'🏆', label:'ARENA',     text:'Weekly tournament resets Monday — register now',    cta:'Register',   page:'tournaments',color:'#ff7a00', urgency:2 });
    return prompts.sort((a,b) => b.urgency-a.urgency).slice(0,8);
  }, [coins, bp, fg, page]);
}

export default function SmartPromptBar({ coins, bp, fg, page, navigate }) {
  const prompts = useSmartPrompts(coins, bp, fg, page);
  const [idx,      setIdx]    = useState(0);
  const [dismissed,setDism]   = useState(new Set());
  const [visible,  setVisible] = useState(true);
  const timerRef = useRef(null);
  useEffect(() => { timerRef.current = setInterval(() => setIdx(i => i+1), 8000); return () => clearInterval(timerRef.current); }, []);
  useEffect(() => { setDism(new Set()); setIdx(0); setVisible(true); }, [page]);
  const active = prompts.filter(p => !dismissed.has(p.id));
  if (!active.length || !visible) return null;
  const p = active[idx % active.length];
  const dismiss = e => { e.stopPropagation(); const next = new Set(dismissed); next.add(p.id); setDism(next); };
  return (
    <div style={{ margin:'0 14px 10px', borderRadius:12, background:`linear-gradient(135deg,${p.color}0f,${p.color}05)`, border:`1px solid ${p.color}28`, display:'flex', alignItems:'center', gap:10, padding:'9px 10px', cursor:'pointer', animation:'fadeUp .3s ease both', position:'relative', overflow:'hidden' }}
      onClick={() => navigate(p.page)}>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(90deg,transparent,${p.color}06,transparent)`, animation:'shimmer 3s infinite', pointerEvents:'none' }} />
      {p.urgency >= 3 && <div style={{ position:'absolute', top:7, right:36, width:6, height:6, borderRadius:'50%', background:p.color, animation:'pulse 1s infinite' }} />}
      <span style={{ fontSize:18, flexShrink:0 }}>{p.icon}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
          <span style={{ fontSize:8, fontFamily:'var(--mono)', fontWeight:800, color:p.color, letterSpacing:1.5 }}>{p.label}</span>
          {active.length > 1 && <span style={{ fontSize:7, color:'var(--td)', fontFamily:'var(--mono)' }}>{(idx%active.length)+1}/{active.length}</span>}
        </div>
        <div style={{ fontSize:11, fontWeight:600, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.text}</div>
      </div>
      <div style={{ padding:'4px 10px', borderRadius:20, background:p.color, color:'#000', fontSize:9, fontWeight:800, fontFamily:'var(--mono)', flexShrink:0, whiteSpace:'nowrap' }}>{p.cta}</div>
      <div onClick={dismiss} style={{ fontSize:11, color:'var(--td)', flexShrink:0, padding:'2px 4px', cursor:'pointer', zIndex:1 }}>✕</div>
    </div>
  );
}
