import { useState, useMemo } from 'react';
import { BackBar, CoinIcon, Spin } from '../components/primitives';
import CoinDetailPage from './CoinDetailPage';

const STOCKS=[{id:"aapl",symbol:"AAPL",name:"Apple Inc.",current_price:178.5,price_change_percentage_24h:1.2,market_cap:2800000000000,market_cap_rank:1,image:"https://logo.clearbit.com/apple.com",sparkline_in_7d:{price:[]}},{id:"msft",symbol:"MSFT",name:"Microsoft",current_price:415.2,price_change_percentage_24h:0.8,market_cap:3100000000000,market_cap_rank:2,image:"https://logo.clearbit.com/microsoft.com",sparkline_in_7d:{price:[]}},{id:"googl",symbol:"GOOGL",name:"Alphabet",current_price:178.9,price_change_percentage_24h:-0.5,market_cap:2200000000000,market_cap_rank:3,image:"https://logo.clearbit.com/google.com",sparkline_in_7d:{price:[]}},{id:"nvda",symbol:"NVDA",name:"NVIDIA",current_price:878.4,price_change_percentage_24h:3.4,market_cap:2160000000000,market_cap_rank:5,image:"https://logo.clearbit.com/nvidia.com",sparkline_in_7d:{price:[]}},{id:"tsla",symbol:"TSLA",name:"Tesla",current_price:248.5,price_change_percentage_24h:-2.3,market_cap:792000000000,market_cap_rank:6,image:"https://logo.clearbit.com/tesla.com",sparkline_in_7d:{price:[]}}];
const COMMODITIES=[{id:"gold",symbol:"XAU",name:"Gold",current_price:2340.5,price_change_percentage_24h:0.4,market_cap_rank:1,image:"🥇",sparkline_in_7d:{price:[]}},{id:"silver",symbol:"XAG",name:"Silver",current_price:29.8,price_change_percentage_24h:-0.3,market_cap_rank:2,image:"🥈",sparkline_in_7d:{price:[]}},{id:"oil",symbol:"WTI",name:"Crude Oil",current_price:82.4,price_change_percentage_24h:1.1,market_cap_rank:3,image:"🛢️",sparkline_in_7d:{price:[]}},{id:"natgas",symbol:"NG",name:"Natural Gas",current_price:1.85,price_change_percentage_24h:-2.4,market_cap_rank:4,image:"🔥",sparkline_in_7d:{price:[]}}];
const LAUNCHES=[{id:"pepe2",symbol:"PEPE2",name:"Pepe 2.0",current_price:1.42e-6,price_change_percentage_24h:234.5,image:"🐸",status:"live",launch_countdown:null},{id:"doge2",symbol:"DOGE2",name:"Doge 2.0",current_price:0,price_change_percentage_24h:0,image:"🐕",status:"soon",launch_countdown:"18h 24m"},{id:"meme",symbol:"MEME",name:"Memecoin",current_price:0.0234,price_change_percentage_24h:45.2,image:"😂",status:"listed",launch_countdown:null},{id:"ai16z",symbol:"AI16Z",name:"AI16Z",current_price:1.24,price_change_percentage_24h:-12.3,image:"🤖",status:"listed",launch_countdown:null},{id:"base",symbol:"BASE",name:"Base Token",current_price:0,price_change_percentage_24h:0,image:"🔵",status:"soon",launch_countdown:"3d 12h"}];

export default function MarketPage({ coins, bp, load, ts, go, trend, onBack }) {
  const [q,setQ]=useState('');const [sort,setSort]=useState('rank');const [tab,setTab]=useState('all');const [segment,setSegment]=useState('crypto');const [newSub,setNewSub]=useState('live');const [selectedCoin,setSelectedCoin]=useState(null);
  const watchlist=['bitcoin','ethereum','solana','binancecoin','ripple'];
  const watchCoins=useMemo(()=>coins.filter(c=>watchlist.includes(c.id)),[coins]);
  const trendingCoins=useMemo(()=>{if(!trend||!trend.trending||!trend.trending.length)return[];return trend.trending.map(t=>{const full=coins.find(c=>c.id===t.id||c.symbol.toLowerCase()===t.symbol.toLowerCase());return full||{id:t.id,name:t.name,symbol:t.symbol,image:t.thumb,current_price:(t.data&&t.data.price)||0,price_change_percentage_24h:(t.data&&t.data.price_change_percentage_24h&&t.data.price_change_percentage_24h.usd)||0,market_cap_rank:t.market_cap_rank,sparkline_in_7d:{price:[]}};});},[trend,coins]);
  const gainers=useMemo(()=>[...coins].filter(c=>c.price_change_percentage_24h!=null).sort((a,b)=>(b.price_change_percentage_24h||0)-(a.price_change_percentage_24h||0)).slice(0,50),[coins]);
  const losers=useMemo(()=>[...coins].filter(c=>c.price_change_percentage_24h!=null).sort((a,b)=>(a.price_change_percentage_24h||0)-(b.price_change_percentage_24h||0)).slice(0,50),[coins]);
  const segmentBase=segment==='stocks'?STOCKS:segment==='commodities'?COMMODITIES:segment==='new'?[]:coins;
  const baseList=segment!=='crypto'?segmentBase:tab==='trending'?trendingCoins:tab==='gainers'?gainers:tab==='losers'?losers:tab==='watchlist'?watchCoins:coins;
  const list=useMemo(()=>{if(segment==='new')return[];let base=[...baseList];if(q){const ql=q.toLowerCase();base=base.filter(c=>(c.name||'').toLowerCase().includes(ql)||(c.symbol||'').toLowerCase().includes(ql));}if(sort==='price')base=[...base].sort((a,b)=>(b.current_price||0)-(a.current_price||0));if(sort==='change')base=[...base].sort((a,b)=>(b.price_change_percentage_24h||0)-(a.price_change_percentage_24h||0));return base;},[baseList,q,sort,segment]);
  if(selectedCoin)return<CoinDetailPage coin={selectedCoin} bp={bp} onBack={()=>setSelectedCoin(null)}/>;
  const CRYPTO_TABS=[['all','All'],['trending','🔥 Hot'],['gainers','📈 Gainers'],['losers','📉 Losers'],['watchlist','⭐ Watch']];
  const SEGMENTS=[['crypto','Crypto'],['stocks','📊 Stocks'],['commodities','🏆 Commod.'],['new','🆕 Launches']];
  return(
    <div className="fu" style={{paddingBottom:80}}>
      <BackBar title="Markets" onBack={onBack} right={<div style={{display:'flex',gap:6,alignItems:'center'}}>{ts&&<span style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>↻ {ts.toLocaleTimeString()}</span>}<div onClick={go} style={{padding:'4px 10px',borderRadius:8,background:'var(--panel)',border:'1px solid var(--bb)',cursor:'pointer',fontSize:10,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700}}>↻</div></div>}/>
      <div style={{padding:'8px 14px 6px',position:'relative'}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Search crypto, stocks, gold..." style={{background:'var(--panel)',border:'1px solid '+(q?'var(--bb)':'var(--b)'),color:'var(--text)',fontFamily:'var(--mono)',fontSize:12,borderRadius:10,padding:'10px 14px',width:'100%',outline:'none'}}/>
        {q&&<div onClick={()=>setQ('')} style={{position:'absolute',right:24,top:'50%',transform:'translateY(-50%)',fontSize:11,color:'var(--td)',cursor:'pointer'}}>✕</div>}
      </div>
      <div style={{display:'flex',gap:0,borderBottom:'1px solid var(--b)',padding:'0 14px'}}>
        {SEGMENTS.map(([s,l])=><div key={s} onClick={()=>{setSegment(s);setTab('all');setQ('');}} style={{flex:1,padding:'9px 4px',textAlign:'center',fontSize:10,fontFamily:'var(--mono)',fontWeight:700,cursor:'pointer',color:segment===s?'var(--g)':'var(--td)',borderBottom:segment===s?'2px solid var(--g)':'2px solid transparent',whiteSpace:'nowrap',transition:'all .15s'}}>{l}</div>)}
      </div>
      {segment==='crypto'&&<div style={{display:'flex',gap:6,padding:'8px 14px 6px',overflowX:'auto'}}>
        {CRYPTO_TABS.map(([t,l])=><div key={t} onClick={()=>setTab(t)} style={{flexShrink:0,padding:'5px 12px',borderRadius:20,border:`1px solid ${tab===t?'var(--bb)':'var(--b)'}`,background:tab===t?'rgba(0,255,65,.1)':'var(--panel)',fontSize:10,color:tab===t?'var(--g)':'var(--td)',cursor:'pointer',fontFamily:'var(--mono)',fontWeight:700,whiteSpace:'nowrap'}}>{l}</div>)}
      </div>}
      {segment==='new'&&<div style={{paddingBottom:14}}>
        <div style={{display:'flex',gap:8,padding:'10px 14px 8px'}}>
          {[['live','🔴 Live Now'],['soon','⏳ Soon'],['listed','🚀 Listed']].map(([s,l])=><div key={s} onClick={()=>setNewSub(s)} style={{flexShrink:0,padding:'5px 11px',borderRadius:20,border:`1px solid ${newSub===s?'var(--bb)':'var(--b)'}`,background:newSub===s?'rgba(0,255,65,.1)':'var(--panel)',fontSize:10,color:newSub===s?'var(--g)':'var(--td)',cursor:'pointer',fontFamily:'var(--mono)',fontWeight:700}}>{l}</div>)}
        </div>
        <div style={{padding:'0 14px',display:'flex',flexDirection:'column',gap:10}}>
          {LAUNCHES.filter(c=>c.status===newSub).map((c,i)=>(
            <div key={i} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'13px 14px',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:40,height:40,borderRadius:11,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{typeof c.image==='string'&&c.image.startsWith('http')?<img src={c.image} style={{width:40,height:40,borderRadius:11,objectFit:'cover'}} alt=""/>:c.image}</div>
              <div style={{flex:1}}><div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}><span style={{fontSize:13,fontWeight:800,color:'var(--text)'}}>{c.name}</span><span style={{fontSize:8,padding:'2px 6px',borderRadius:20,background:c.status==='live'?'rgba(255,59,92,.15)':c.status==='soon'?'rgba(255,215,0,.15)':'rgba(0,255,65,.15)',color:c.status==='live'?'var(--red)':c.status==='soon'?'var(--gold)':'var(--g)',fontFamily:'var(--mono)',fontWeight:800}}>{c.status==='live'?'● LIVE':c.status==='soon'?'⏳ SOON':'✅ LISTED'}</span></div><div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>{c.symbol}</div></div>
              <div style={{textAlign:'right'}}>{c.launch_countdown?<div style={{fontSize:11,fontWeight:700,color:'var(--gold)',fontFamily:'var(--mono)'}}>{c.launch_countdown}</div>:<div style={{fontSize:12,fontWeight:700,color:'var(--g)',fontFamily:'var(--mono)'}}>${c.current_price<1?(c.current_price||0).toFixed(6):(c.current_price||0).toFixed(2)}</div>}{c.price_change_percentage_24h!==0&&<div style={{fontSize:9,color:c.price_change_percentage_24h>=0?'var(--g)':'var(--red)',fontFamily:'var(--mono)'}}>{c.price_change_percentage_24h>=0?'+':''}{(c.price_change_percentage_24h||0).toFixed(1)}%</div>}</div>
            </div>
          ))}
          {LAUNCHES.filter(c=>c.status===newSub).length===0&&<div style={{padding:24,textAlign:'center',color:'var(--td)',fontSize:12,fontFamily:'var(--mono)'}}>No {newSub} launches right now</div>}
        </div>
      </div>}
      {segment!=='new'&&<div style={{margin:'0 14px 14px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,overflow:'hidden'}}>
        <div style={{display:'flex',padding:'8px 12px',borderBottom:'1px solid var(--b)',gap:8}}>
          <span style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',width:22,textAlign:'right',flexShrink:0}}>#</span>
          <div style={{width:30,flexShrink:0}}/>
          <span style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',flex:1,paddingLeft:8}}>Coin</span>
          <span style={{fontSize:9,color:sort==='price'?'var(--g)':'var(--td)',fontFamily:'var(--mono)',width:80,textAlign:'right',cursor:'pointer',flexShrink:0}} onClick={()=>setSort(s=>s==='price'?'rank':'price')}>Price{sort==='price'?' ▾':''}</span>
          <span style={{fontSize:9,color:sort==='change'?'var(--g)':'var(--td)',fontFamily:'var(--mono)',width:58,textAlign:'right',cursor:'pointer',flexShrink:0}} onClick={()=>setSort(s=>s==='change'?'rank':'change')}>24h{sort==='change'?' ▾':''}</span>
          <span style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',width:44,textAlign:'center',flexShrink:0}}>7D</span>
        </div>
        {load&&tab==='all'?<div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:32,gap:10}}><Spin/><span style={{fontSize:12,color:'var(--td)',fontFamily:'var(--mono)'}}>Loading live prices...</span></div>
        :list.length===0?<div style={{padding:24,textAlign:'center'}}><span style={{fontSize:13,color:'var(--td)',fontFamily:'var(--mono)'}}>{tab==='trending'?'Fetching trending data...':'No coins found'}</span></div>
        :list.slice(0,100).map((c,i)=>{
          const live=bp[`${(c.symbol||'').toUpperCase()}USDT`];
          const price=(live&&live.price)||c.current_price||0;
          const chg=(live&&live.change)!=null?(live.change):(c.price_change_percentage_24h||0);
          const isGainer=tab==='gainers'||chg>5;
          const isLoser=tab==='losers'||chg<-5;
          return(
            <div key={c.id||i} onClick={()=>setSelectedCoin(c)} style={{cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(0,255,65,.03)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              {i>0&&<div style={{height:1,background:'var(--b)',margin:'0 12px'}}/>}
              <div style={{display:'flex',gap:8,padding:'10px 12px',alignItems:'center'}}>
                <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',width:22,textAlign:'right',flexShrink:0}}>{c.market_cap_rank||i+1}</span>
                <CoinIcon coin={c} size={30} radius={7}/>
                <div style={{flex:1,minWidth:0,paddingLeft:8}}>
                  <div style={{fontSize:12,fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</div>
                  <div style={{display:'flex',alignItems:'center',gap:5}}>
                    <span style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>{(c.symbol||'').toUpperCase()}</span>
                    {(isGainer||isLoser)&&<span style={{fontSize:8,padding:'1px 5px',borderRadius:10,background:isGainer?'rgba(0,255,65,.12)':'rgba(255,59,92,.12)',color:isGainer?'var(--g)':'var(--red)',fontFamily:'var(--mono)',fontWeight:700}}>{isGainer?'▲ HOT':'▼ DIP'}</span>}
                  </div>
                </div>
                <span style={{fontSize:12,fontFamily:'var(--mono)',fontWeight:700,width:80,textAlign:'right',flexShrink:0}}>${price<1?(price||0).toFixed(4):price<100?(price||0).toFixed(2):price.toLocaleString('en',{maximumFractionDigits:2})}</span>
                <span style={{fontSize:11,fontFamily:'var(--mono)',color:chg>=0?'var(--g)':'var(--red)',width:58,textAlign:'right',flexShrink:0,fontWeight:700}}>{chg>=0?'+':''}{(chg||0).toFixed(2)}%</span>
                <div style={{width:44,display:'flex',justifyContent:'center',flexShrink:0}}>
                  {c.sparkline_in_7d&&c.sparkline_in_7d.price&&c.sparkline_in_7d.price.length>1&&(()=>{const pts=c.sparkline_in_7d.price;const mn=Math.min(...pts),mx=Math.max(...pts);const norm=pts.map((p,j)=>`${(j/(pts.length-1))*40},${18-((p-mn)/(mx-mn||1))*18}`);const up=pts[pts.length-1]>=pts[0];return<svg width="40" height="18" viewBox="0 0 40 18"><polyline points={norm.join(' ')} fill="none" stroke={up?'#00ff41':'#ff3b5c'} strokeWidth="1.2" opacity=".8"/></svg>;})()}
                </div>
              </div>
            </div>
          );
        })}
      </div>}
    </div>
  );
}
