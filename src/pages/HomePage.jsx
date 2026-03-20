import { useState, useEffect, useMemo } from 'react';
import { R, C, Txt, Div, Spin, Bx } from '../components/primitives';
import { SVC_ICONS, CORE_ACTIONS, ALL_SERVICES } from '../constants';
import CoinDetailPage from './CoinDetailPage';

const EXPLORE_SERVICES = ALL_SERVICES.filter(s => !['cutpay','trade','earn','stake_tournament','game','wallet','market'].includes(s.iconKey));

function SvcIcon({ k, color, size = 22 }) {
  const ic = SVC_ICONS[k];
  if (!ic) return <span style={{ fontSize:size }}>{k}</span>;
  return <div style={{ width:size, height:size, color }}>{ic}</div>;
}

function CutbarLaunchCard({ navigate }) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const target = new Date().getTime() + 7*24*60*60*1000;
    const t = setInterval(() => { const diff = Math.max(0,target-new Date().getTime()); setSecs(Math.floor(diff/1000)); }, 1000);
    return () => clearInterval(t);
  }, []);
  const d=Math.floor(secs/86400),h=Math.floor((secs%86400)/3600),m=Math.floor((secs%3600)/60),s=secs%60;
  const pad=n=>String(n).padStart(2,'0');
  return (
    <div onClick={() => navigate('token')} style={{ background:'linear-gradient(135deg,rgba(0,255,65,.1),rgba(0,255,65,.03))', border:'1px solid rgba(0,255,65,.35)', borderRadius:14, padding:'12px 14px', marginBottom:6, cursor:'pointer', position:'relative', overflow:'hidden', boxShadow:'0 0 20px rgba(0,255,65,.08)', margin:'0 14px 10px' }}>
      <div style={{ position:'absolute', right:-12, top:-12, fontSize:64, opacity:.06, pointerEvents:'none', lineHeight:1 }}>🐑</div>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:11, background:'rgba(0,255,65,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, border:'1px solid rgba(0,255,65,.3)', animation:'float 3s ease-in-out infinite', flexShrink:0 }}>🐑</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3, flexWrap:'wrap' }}>
            <span style={{ fontSize:13, fontWeight:800, color:'var(--g)' }}>CUTBAR Token</span>
            <Bx color="green" style={{ fontSize:7 }}>PRE-LAUNCH</Bx>
            <Bx color="gold"  style={{ fontSize:7 }}>BSC</Bx>
          </div>
          <div style={{ display:'flex', gap:4, alignItems:'center', marginBottom:4 }}>
            {[[d,'D'],[h,'H'],[m,'M'],[s,'S']].map(([v,u]) => (
              <div key={u} style={{ textAlign:'center', background:'rgba(0,255,65,.12)', border:'1px solid rgba(0,255,65,.2)', borderRadius:5, padding:'2px 5px', minWidth:24 }}>
                <div style={{ fontSize:10, fontWeight:800, color:'var(--g)', fontFamily:'var(--mono)', lineHeight:1 }}>{pad(v)}</div>
                <div style={{ fontSize:6, color:'var(--td)', fontFamily:'var(--mono)' }}>{u}</div>
              </div>
            ))}
            <span style={{ fontSize:9, color:'var(--td)', fontFamily:'var(--mono)', marginLeft:4 }}>to launch</span>
          </div>
        </div>
        <div style={{ padding:'8px 12px', borderRadius:10, background:'linear-gradient(135deg,var(--g2),var(--g))', color:'#000', fontSize:9, fontWeight:900, flexShrink:0, fontFamily:'var(--mono)', whiteSpace:'nowrap' }}>Early Access →</div>
      </div>
    </div>
  );
}

export default function HomePage({ navigate, coins, bp, global:gs, fg, load }) {
  const [showExplore,   setShowExplore]   = useState(false);
  const [mktTab,        setMktTab]        = useState('top');
  const [selectedCoin,  setSelectedCoin]  = useState(null);
  const btcLive = bp['BTCUSDT'];
  const ethLive = bp['ETHUSDT'];
  const topCoins = useMemo(() => coins.slice(0,10).map(c => { const l=bp[`${c.symbol.toUpperCase()}USDT`]; return {...c,lp:(l&&l.price)||c.current_price||0,lc:(l&&l.change!=null?l.change:c.price_change_percentage_24h)||0}; }), [coins,bp]);
  const gainers  = useMemo(() => coins.length?[...coins].filter(c=>c.price_change_percentage_24h!=null&&c.market_cap_rank).sort((a,b)=>(b.price_change_percentage_24h||0)-(a.price_change_percentage_24h||0)).slice(0,10):[], [coins]);
  const losers   = useMemo(() => coins.length?[...coins].filter(c=>c.price_change_percentage_24h!=null&&c.market_cap_rank).sort((a,b)=>(a.price_change_percentage_24h||0)-(b.price_change_percentage_24h||0)).slice(0,10):[], [coins]);
  const newList  = useMemo(() => coins.length?[...coins].filter(c=>c.market_cap_rank&&c.market_cap_rank>30).sort((a,b)=>(new Date(b.atl_date||0))-(new Date(a.atl_date||0))).slice(0,10):[], [coins]);
  const hotCoins = mktTab==='top'?topCoins:mktTab==='gainers'?gainers:mktTab==='losers'?losers:newList;
  if (selectedCoin) return <CoinDetailPage coin={selectedCoin} bp={bp} onBack={() => setSelectedCoin(null)} />;
  return (
    <div className="fu" style={{ overflowY:'auto', paddingBottom:80 }}>
      <div style={{ margin:'14px 14px 10px', background:'linear-gradient(135deg,#091a0c,#040e07)', border:'1px solid var(--bb)', borderRadius:16, padding:16, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:120, height:120, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,255,65,.06),transparent 70%)', pointerEvents:'none' }} />
        <R justify="space-between" align="flex-start">
          <C gap={3}>
            <Txt size={9} color="var(--td)" mono={true} style={{ letterSpacing:3 }}>GLOBAL MARKET CAP</Txt>
            <div style={{ fontFamily:'var(--display)', fontSize:26, color:'var(--g)', letterSpacing:.5, textShadow:'var(--glow)', lineHeight:1 }}>
              {gs&&gs.total_market_cap&&gs.total_market_cap.usd?'$'+(gs.total_market_cap.usd/1e12).toFixed(2)+'T':'—'}
            </div>
            <R gap={6} style={{ flexWrap:'wrap', marginTop:2 }}>
              {gs&&gs.market_cap_change_percentage_24h_usd!=null&&<Bx color={gs.market_cap_change_percentage_24h_usd>=0?'green':'red'} style={{fontSize:9}}>{gs.market_cap_change_percentage_24h_usd>=0?'↑':'↓'}{Math.abs(gs.market_cap_change_percentage_24h_usd||0).toFixed(2)}% 24h</Bx>}
              {btcLive&&<Bx color={btcLive.change>=0?'green':'red'} style={{fontSize:9}}>BTC {btcLive.change>=0?'+':''}{(btcLive.change||0).toFixed(1)}%</Bx>}
              {ethLive&&<Bx color={ethLive.change>=0?'green':'red'} style={{fontSize:9}}>ETH {ethLive.change>=0?'+':''}{(ethLive.change||0).toFixed(1)}%</Bx>}
            </R>
          </C>
          {fg&&<div style={{ background:+fg.value>50?'rgba(0,255,65,.08)':'rgba(255,59,92,.08)', border:`1px solid ${+fg.value>50?'rgba(0,255,65,.2)':'rgba(255,59,92,.2)'}`, borderRadius:10, padding:'8px 12px', textAlign:'center', flexShrink:0 }}>
            <Txt size={8} color="var(--td)" mono={true} style={{ display:'block', letterSpacing:1.5, marginBottom:2 }}>FEAR & GREED</Txt>
            <div style={{ fontSize:22, fontWeight:800, fontFamily:'var(--mono)', color:+fg.value>50?'var(--g)':'var(--red)', lineHeight:1 }}>{fg.value}</div>
            <Txt size={8} color="var(--td)" style={{ display:'block', marginTop:2 }}>{fg.value_classification}</Txt>
          </div>}
        </R>
      </div>
      <div style={{ padding:'0 14px 14px' }}>
        <Txt size={9} color="var(--td)" mono={true} style={{ letterSpacing:3, display:'block', marginBottom:10 }}>QUICK ACTIONS</Txt>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
          {CORE_ACTIONS.map((s,i) => (
            <div key={i} onClick={() => navigate(s.page)} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 12px', background:'var(--panel)', border:'1px solid var(--b)', borderRadius:14, cursor:'pointer', transition:'all .2s', position:'relative', overflow:'hidden' }}
              onMouseEnter={e => e.currentTarget.style.borderColor=s.color+'60'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--b)'}>
              <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 0% 50%,${s.color}07,transparent 60%)`, pointerEvents:'none' }} />
              <div style={{ width:32, height:32, borderRadius:9, background:`${s.color}15`, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${s.color}25`, color:s.color, flexShrink:0, padding:6 }}>
                <SvcIcon k={s.iconKey} color={s.color} size={18} />
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:800, color:'var(--text)', lineHeight:1.2 }}>{s.label}</div>
                <div style={{ fontSize:9, color:'var(--td)', fontFamily:'var(--mono)', marginTop:1 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'0 14px', marginBottom:14 }}>
        <div onClick={() => setShowExplore(e=>!e)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px', background:'var(--panel)', border:'1px solid var(--b)', borderRadius:showExplore?'12px 12px 0 0':12, cursor:'pointer', transition:'border-radius .2s' }}>
          <R gap={8}><Txt size={10} color="var(--td)" mono={true} weight={700} style={{ letterSpacing:2 }}>EXPLORE</Txt><Bx color="green" style={{ fontSize:8 }}>+{EXPLORE_SERVICES.length} services</Bx></R>
          <Txt size={13} color="var(--td)">{showExplore?'▲':'▼'}</Txt>
        </div>
        {showExplore&&<div style={{ background:'var(--panel)', border:'1px solid var(--b)', borderTop:'none', borderRadius:'0 0 12px 12px', padding:'10px 10px 12px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
          {EXPLORE_SERVICES.map((s,i) => (
            <div key={i} onClick={() => navigate(s.page)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:'10px 4px', background:'var(--bg3)', border:'1px solid var(--b)', borderRadius:11, cursor:'pointer', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 50% 0%,${s.color}07,transparent 60%)`, pointerEvents:'none' }} />
              <div style={{ width:30, height:30, borderRadius:8, background:`${s.color}14`, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${s.color}22`, color:s.color, padding:5 }}><SvcIcon k={s.iconKey} color={s.color} size={17} /></div>
              <Txt size={8} weight={700} style={{ textAlign:'center', lineHeight:1.2, color:'var(--td)' }}>{s.label}</Txt>
            </div>
          ))}
        </div>}
      </div>
      <CutbarLaunchCard navigate={navigate} />
      <div style={{ padding:'0 14px 6px' }}>
        <R justify="space-between" align="center" style={{ marginBottom:10 }}>
          <Txt size={9} color="var(--td)" mono={true} style={{ letterSpacing:3 }}>LIVE MARKETS</Txt>
          <R gap={6}>
            {load?<Spin/>:<Bx color="green" style={{ fontSize:8 }}>● LIVE</Bx>}
            <div onClick={() => navigate('market')} style={{ fontSize:9, color:'var(--g)', fontFamily:'var(--mono)', fontWeight:700, cursor:'pointer' }}>See All →</div>
          </R>
        </R>
        <R gap={6} style={{ overflowX:'auto', paddingBottom:4, marginBottom:10 }}>
          {[['top','🔥 Top 10'],['gainers','📈 Gainers'],['losers','📉 Losers'],['new','🆕 New']].map(([t,l]) => (
            <div key={t} onClick={() => setMktTab(t)} style={{ flexShrink:0, padding:'5px 11px', borderRadius:20, border:`1px solid ${mktTab===t?'var(--bb)':'var(--b)'}`, background:mktTab===t?'rgba(0,255,65,.1)':'var(--panel)', fontSize:10, color:mktTab===t?'var(--g)':'var(--td)', cursor:'pointer', fontFamily:'var(--body)', fontWeight:700, whiteSpace:'nowrap' }}>{l}</div>
          ))}
        </R>
        <div style={{ background:'var(--panel)', border:'1px solid var(--b)', borderRadius:14, overflow:'hidden', marginBottom:10 }}>
          {load
            ? <R justify="center" style={{ padding:24, gap:10 }}><Spin/><Txt size={12} color="var(--td)" mono={true}>Fetching live data...</Txt></R>
            : hotCoins.map((c,i) => {
                const _bp=bp[`${c.symbol.toUpperCase()}USDT`];
                const price=c.lp||(_bp&&_bp.price)||c.current_price||0;
                const chg=c.lc!=null?c.lc:(_bp&&_bp.change!=null?_bp.change:c.price_change_percentage_24h||0);
                return (
                  <div key={c.id}>
                    {i>0&&<Div m="0 12px"/>}
                    <R gap={8} onClick={() => setSelectedCoin(c)} style={{ padding:'10px 12px', cursor:'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(0,255,65,.02)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <Txt size={10} color="var(--td)" mono={true} style={{ width:20, textAlign:'right', flexShrink:0 }}>{c.market_cap_rank||i+1}</Txt>
                      {c.image?<img src={c.image} alt={c.symbol} style={{ width:30, height:30, borderRadius:7, flexShrink:0, objectFit:'cover' }}/>:<div style={{ width:30, height:30, borderRadius:7, background:'#33333322', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>{(c.symbol||'?')[0]}</div>}
                      <C gap={1} style={{ flex:1, minWidth:0 }}>
                        <Txt size={12} weight={700} style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</Txt>
                        <Txt size={9} color="var(--td)" mono={true}>{c.symbol.toUpperCase()}</Txt>
                      </C>
                      {c.sparkline_in_7d&&c.sparkline_in_7d.price&&c.sparkline_in_7d.price.length>1&&(()=>{const pts=c.sparkline_in_7d.price;const mn=Math.min(...pts),mx=Math.max(...pts);const norm=pts.map((p,j)=>`${(j/(pts.length-1))*36},${14-((p-mn)/(mx-mn||1))*14}`);const up=pts[pts.length-1]>=pts[0];return <svg width="36" height="14" viewBox="0 0 36 14" style={{flexShrink:0}}><polyline points={norm.join(' ')} fill="none" stroke={up?'#00ff41':'#ff3b5c'} strokeWidth="1.2" opacity=".8"/></svg>;})()}
                      <C gap={1} align="flex-end" style={{ flexShrink:0 }}>
                        <Txt size={11} mono={true} weight={700}>${price<1?(price||0).toFixed(4):price.toLocaleString('en',{maximumFractionDigits:2})}</Txt>
                        <Txt size={9} mono={true} color={chg>=0?'var(--g)':'var(--red)'}>{chg>=0?'▲':'▼'}{(chg||0).toFixed(2)}%</Txt>
                      </C>
                    </R>
                  </div>
                );
              })
          }
        </div>
      </div>
    </div>
  );
}
