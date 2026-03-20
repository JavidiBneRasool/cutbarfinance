import { useState, useEffect } from 'react';
import { BackBar, Btn, CoinIcon, Spin } from '../components/primitives';

function AboutText({text}){
  const [expanded,setExpanded]=useState(false);
  const clean=text.replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g,'$2').replace(/<[^>]*>/g,'');
  const short=clean.slice(0,500);
  return(
    <div>
      <div style={{fontSize:12,color:'var(--tm)',lineHeight:1.8}}>{expanded?clean:short}{!expanded&&clean.length>500&&'...'}</div>
      {clean.length>500&&<div onClick={()=>setExpanded(e=>!e)} style={{marginTop:8,fontSize:11,color:'var(--g)',cursor:'pointer',fontFamily:'var(--mono)',fontWeight:700}}>{expanded?'▲ Show Less':'▼ Read More'}</div>}
    </div>
  );
}

export default function CoinDetailPage({coin, bp, onBack}){
  const [chartRange,setChartRange]=useState('1D');
  const [tab,setTab]=useState('overview');
  const [detail,setDetail]=useState(null);
  const [detailLoad,setDetailLoad]=useState(true);

  // Fetch full coin details from CoinGecko
  useEffect(()=>{
    if(!coin||!coin.id) return;
    setDetailLoad(true);
    fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false`)
      .then(r=>r.ok?r.json():null)
      .then(d=>{if(d)setDetail(d);})
      .catch(()=>{})
      .finally(()=>setDetailLoad(false));
  },[coin&&coin.id]); // eslint-disable-line

  const live=bp[`${(coin.symbol||'').toUpperCase()}USDT`];
  const price=(live&&live.price)||coin.current_price||0;
  const chg=(live&&live.change)||coin.price_change_percentage_24h||0;
  const chg7=coin.price_change_percentage_7d_in_currency||coin.price_change_percentage_7d||0;
  const mcap=coin.market_cap||0;
  const vol=coin.total_volume||0;
  const supply=coin.circulating_supply||0;
  const maxSupply=coin.max_supply||null;
  const ath=coin.ath||0;
  const atl=coin.atl||0;
  const tvSymbol=`${(coin.symbol||'btc').toUpperCase()}USDT`;
  const tvInterval={['1H']:'60',['4H']:'240',['1D']:'D',['1W']:'W',['1M']:'M'}[chartRange]||'D';

  // Real links from CoinGecko detail
  const links=detail&&detail.links;
  const websites=(links&&links.homepage)||[];
  const explorers=(links&&links.blockchain_site)||[];
  const twitterHandle=links&&links.twitter_screen_name;
  const telegramUrl=links&&links.telegram_channel_identifier;
  const redditUrl=links&&links.subreddit_url;
  const githubRepos=(links&&links.repos_url&&links.repos_url.github)||[];
  const description=detail&&detail.description&&detail.description.en;
  const platforms=detail&&detail.platforms;
  const categories=detail&&detail.categories;
  const communityScore=detail&&detail.community_score;
  const sentimentUp=detail&&detail.sentiment_votes_up_percentage;

  const EXCHANGES={
    btc:['Binance','Coinbase','Kraken','OKX','Bybit','HTX','KuCoin'],
    eth:['Binance','Coinbase','Kraken','OKX','Bybit','HTX','Uniswap'],
    sol:['Binance','Coinbase','OKX','Bybit','KuCoin'],
    bnb:['Binance','OKX','Bybit','HTX'],
    ada:['Binance','Coinbase','OKX','Kraken'],
    xrp:['Binance','Coinbase','Kraken','OKX','Bybit'],
    doge:['Binance','Coinbase','OKX','Bybit','KuCoin'],
    default:['Binance','OKX','Bybit','KuCoin','HTX'],
  };
  const exchanges=EXCHANGES[(coin.symbol||'').toLowerCase()]||EXCHANGES.default;

  const fmt=(n)=>n>=1e9?'$'+(n/1e9).toFixed(2)+'B':n>=1e6?'$'+(n/1e6).toFixed(2)+'M':n>=1e3?'$'+(n/1e3).toFixed(1)+'K':'$'+n.toFixed(2);
  const fmtN=(n)=>n>=1e9?(n/1e9).toFixed(2)+'B':n>=1e6?(n/1e6).toFixed(2)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':n.toFixed(0);
  const openLink=(url)=>{if(url)window.open(url,'_blank','noopener');};

  return(
    <div className="fu">
      {/* Header */}
      <BackBar title={coin.name} onBack={onBack} right={
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <CoinIcon coin={coin} size={24} radius={6}/>
          <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',fontWeight:700}}>{(coin.symbol||'').toUpperCase()}</span>
        </div>
      }/>

      {/* Tab Nav */}
      <div style={{display:'flex',borderBottom:'1px solid var(--b)',background:'var(--bg)',overflowX:'auto',flexShrink:0}}>
        {[['overview','📊 Overview'],['chart','📈 Chart'],['about','ℹ️ About']].map(([t,l])=>(
          <div key={t} onClick={()=>setTab(t)} style={{flex:1,padding:'10px 6px',textAlign:'center',fontSize:11,fontFamily:'var(--mono)',fontWeight:700,cursor:'pointer',color:tab===t?'var(--g)':'var(--td)',borderBottom:tab===t?'2px solid var(--g)':'2px solid transparent',whiteSpace:'nowrap',minWidth:80,transition:'all .15s'}}>{l}</div>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab==='overview'&&<>

      {/* Price hero */}
      <div style={{margin:'0 14px 12px',padding:'16px',background:'linear-gradient(135deg,#091a0c,#040e07)',border:'1px solid var(--bb)',borderRadius:16,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 20% 50%,rgba(0,255,65,.06),transparent 60%)',pointerEvents:'none'}}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
          <div>
            <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:4}}>LIVE PRICE · {(coin.symbol||'').toUpperCase()}/USD</div>
            <div style={{fontSize:32,color:'var(--g)',fontFamily:'var(--display)',fontWeight:800,letterSpacing:1,lineHeight:1}}>
              ${price<1?(price||0).toFixed(6):price<100?(price||0).toFixed(4):price.toLocaleString('en',{maximumFractionDigits:2})}
            </div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:16,fontWeight:800,color:chg>=0?'var(--g)':'var(--red)',fontFamily:'var(--mono)'}}>{chg>=0?'▲':'▼'}{Math.abs(chg||0).toFixed(2)}%</div>
            <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>24h</div>
            {chg7!==0&&<div style={{fontSize:11,color:chg7>=0?'var(--g)':'var(--red)',fontFamily:'var(--mono)',marginTop:2}}>{chg7>=0?'+':''}{chg7.toFixed(2)}% 7d</div>}
          </div>
        </div>
        {live&&<div style={{display:'flex',gap:10}}>
          <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>H: ${live.high?(+live.high).toLocaleString('en',{maximumFractionDigits:4}):'-'}</span>
          <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>L: ${live.low?(+live.low).toLocaleString('en',{maximumFractionDigits:4}):'-'}</span>
        </div>}
      </div>

      {/* Quick actions — only in overview */}
      {tab==='overview'&&<div style={{margin:'0 14px 12px',display:'flex',gap:8}}>
        <Btn v="primary" onClick={()=>setTab('chart')} style={{flex:1}}>📈 Trade {(coin.symbol||'').toUpperCase()}</Btn>
        <Btn v="ghost" onClick={()=>setTab('about')} style={{flex:1}}>ℹ️ About</Btn>
      </div>}

      {/* Key stats */}
      <div style={{margin:'0 14px 12px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'12px 14px'}}>
        <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:10}}>KEY STATS</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:0}}>
          {[
            ['Market Cap',fmt(mcap)],
            ['24h Volume',fmt(vol)],
            ['Circulating',fmtN(supply)+' '+(coin.symbol||'').toUpperCase()],
            ['Max Supply',maxSupply?fmtN(maxSupply)+' '+(coin.symbol||'').toUpperCase():'∞'],
            ['All Time High','$'+(ath<1?ath.toFixed(6):ath.toLocaleString('en',{maximumFractionDigits:2}))],
            ['All Time Low','$'+(atl<0.001?atl.toFixed(8):atl.toFixed(4))],
            ['Market Cap Rank','#'+(coin.market_cap_rank||'—')],
            ['7D Change',(chg7>=0?'+':'')+chg7.toFixed(2)+'%'],
          ].map(([k,v],i)=>(
            <div key={k} style={{padding:'8px 0',borderBottom:'1px solid var(--b)',paddingRight:i%2===0?16:0,paddingLeft:i%2===1?16:0}}>
              <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:2}}>{k}</div>
              <div style={{fontSize:12,fontWeight:700,color:k.includes('Change')?(chg7>=0?'var(--g)':'var(--red)'):'var(--text)',fontFamily:'var(--mono)'}}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Available on exchanges */}
      <div style={{margin:'0 14px 12px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'12px 14px'}}>
        <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:10}}>AVAILABLE ON EXCHANGES</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {exchanges.map(e=>(
            <div key={e} style={{padding:'5px 12px',borderRadius:20,background:'rgba(0,255,65,.06)',border:'1px solid var(--bb)',fontSize:11,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700}}>{e}</div>
          ))}
        </div>
      </div>

      {/* Contracts — overview tab */}
      {platforms&&Object.keys(platforms).filter(k=>platforms[k]).length>0&&(
        <div style={{margin:'0 14px 12px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'12px 14px'}}>
          <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:10}}>CONTRACT ADDRESSES</div>
          {Object.entries(platforms).filter(([,v])=>v).slice(0,4).map(([chain,addr])=>(
            <div key={chain} onClick={()=>{const expUrl=`https://etherscan.io/token/${addr}`;openLink(expUrl);}} style={{marginBottom:8,padding:'8px 10px',background:'var(--bg3)',borderRadius:9,border:'1px solid var(--b)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
              <div>
                <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:1,marginBottom:3,textTransform:'uppercase'}}>{chain}</div>
                <div style={{fontSize:10,color:'var(--g)',fontFamily:'var(--mono)',wordBreak:'break-all',lineHeight:1.5}}>{addr.slice(0,20)}...{addr.slice(-8)}</div>
              </div>
              <span style={{fontSize:16,color:'var(--td)',flexShrink:0}}>↗</span>
            </div>
          ))}
        </div>
      )}

      </>}

      {/* ── CHART TAB ── */}
      {tab==='chart'&&<>
        <div style={{margin:'14px 14px 12px',borderRadius:14,overflow:'hidden',border:'1px solid var(--b)',background:'#131722'}}>
          <div style={{display:'flex',gap:0,borderBottom:'1px solid var(--b)'}}>
            {['1H','4H','1D','1W','1M'].map(r=>(
              <div key={r} onClick={()=>setChartRange(r)} style={{flex:1,padding:'9px 4px',textAlign:'center',fontSize:11,fontFamily:'var(--mono)',fontWeight:700,cursor:'pointer',background:chartRange===r?'rgba(0,255,65,.12)':'transparent',color:chartRange===r?'var(--g)':'var(--td)',borderBottom:chartRange===r?'2px solid var(--g)':'2px solid transparent',transition:'all .15s'}}>{r}</div>
            ))}
          </div>
          <iframe
            key={tvSymbol+tvInterval+'full'}
            src={`https://s.tradingview.com/widgetembed/?frameElementId=tv2_${tvSymbol}&symbol=BINANCE:${tvSymbol}&interval=${tvInterval}&hidesidetoolbar=0&symboledit=0&saveimage=0&toolbarbg=131722&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1&hide_top_toolbar=0&hide_legend=0&backgroundColor=131722`}
            style={{width:'100%',height:480,border:'none',display:'block'}}
            allowTransparency
            scrolling="no"
          />
        </div>
        <div style={{margin:'0 14px 14px',display:'flex',gap:8}}>
          <Btn v="primary" onClick={()=>{}} style={{flex:1}}>📈 Buy {(coin.symbol||'').toUpperCase()}</Btn>
          <Btn v="red" onClick={()=>{}} style={{flex:1}}>📉 Sell</Btn>
        </div>
      </>}

      {/* ── ABOUT TAB ── */}
      {tab==='about'&&<>
        {detailLoad&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,padding:32}}><Spin/><span style={{fontSize:12,color:'var(--td)',fontFamily:'var(--mono)'}}>Loading coin data...</span></div>}
        {!detailLoad&&<>
          {/* Description */}
          {description&&(
            <div style={{margin:'14px 14px 12px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'14px'}}>
              <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:10}}>ABOUT {(coin.name||'').toUpperCase()}</div>
              <AboutText text={description}/>
            </div>
          )}

          {/* Official Links */}
          {(websites.filter(Boolean).length>0||githubRepos.length>0)&&(
            <div style={{margin:'0 14px 12px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'14px'}}>
              <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:12}}>OFFICIAL LINKS</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {websites.filter(Boolean).slice(0,3).map((url,i)=>(
                  <div key={url} onClick={()=>openLink(url)} style={{padding:'7px 14px',borderRadius:20,background:'var(--bg3)',border:'1px solid var(--b)',fontSize:11,color:'var(--text)',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontWeight:600}}>
                    <span>🌐</span>{i===0?'Website':`Website ${i+1}`}
                  </div>
                ))}
                {githubRepos.filter(Boolean).slice(0,1).map(url=>(
                  <div key={url} onClick={()=>openLink(url)} style={{padding:'7px 14px',borderRadius:20,background:'var(--bg3)',border:'1px solid var(--b)',fontSize:11,color:'var(--text)',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontWeight:600}}>
                    <span>🐙</span>GitHub
                  </div>
                ))}
                {links&&links.whitepaper&&(
                  <div onClick={()=>openLink(links.whitepaper)} style={{padding:'7px 14px',borderRadius:20,background:'var(--bg3)',border:'1px solid var(--b)',fontSize:11,color:'var(--text)',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontWeight:600}}>
                    <span>📄</span>Whitepaper
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Community / Socials */}
          {(twitterHandle||telegramUrl||redditUrl)&&(
            <div style={{margin:'0 14px 12px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'14px'}}>
              <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:12}}>COMMUNITY</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {twitterHandle&&<div onClick={()=>openLink(`https://twitter.com/${twitterHandle}`)} style={{padding:'7px 14px',borderRadius:20,background:'rgba(29,161,242,.1)',border:'1px solid rgba(29,161,242,.3)',fontSize:11,color:'#1da1f2',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontWeight:700}}><span>𝕏</span>@{twitterHandle}</div>}
                {telegramUrl&&<div onClick={()=>openLink(`https://t.me/${telegramUrl}`)} style={{padding:'7px 14px',borderRadius:20,background:'rgba(0,136,204,.1)',border:'1px solid rgba(0,136,204,.3)',fontSize:11,color:'#0088cc',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontWeight:700}}><span>✈️</span>Telegram</div>}
                {redditUrl&&<div onClick={()=>openLink(redditUrl)} style={{padding:'7px 14px',borderRadius:20,background:'rgba(255,87,0,.1)',border:'1px solid rgba(255,87,0,.3)',fontSize:11,color:'#ff5700',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontWeight:700}}><span>🔴</span>Reddit</div>}
              </div>
              {communityScore!=null&&<div style={{marginTop:10,fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>Community score: <span style={{color:'var(--g)',fontWeight:700}}>{communityScore?.toFixed(1)}</span> · Sentiment up: <span style={{color:'var(--g)',fontWeight:700}}>{sentimentUp?.toFixed(1)}%</span></div>}
            </div>
          )}

          {/* Chain Explorers */}
          {explorers.filter(Boolean).length>0&&(
            <div style={{margin:'0 14px 12px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'14px'}}>
              <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:12}}>CHAIN EXPLORERS</div>
              {explorers.filter(Boolean).slice(0,4).map(url=>(
                <div key={url} onClick={()=>openLink(url)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',borderRadius:9,background:'var(--bg3)',border:'1px solid var(--b)',marginBottom:8,cursor:'pointer'}}>
                  <span style={{fontSize:11,color:'var(--g)',fontFamily:'var(--mono)',wordBreak:'break-all',flex:1,marginRight:8}}>{url.replace('https://','').slice(0,50)}...</span>
                  <span style={{fontSize:16,color:'var(--td)',flexShrink:0}}>↗</span>
                </div>
              ))}
            </div>
          )}

          {/* Contract Addresses */}
          {platforms&&Object.keys(platforms).filter(k=>platforms[k]).length>0&&(
            <div style={{margin:'0 14px 12px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'14px'}}>
              <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:12}}>CONTRACT ADDRESSES</div>
              {Object.entries(platforms).filter(([,v])=>v).slice(0,4).map(([chain,addr])=>(
                <div key={chain} style={{marginBottom:8,padding:'10px 12px',background:'var(--bg3)',borderRadius:9,border:'1px solid var(--b)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:1,marginBottom:3,textTransform:'uppercase'}}>{chain}</div>
                    <div style={{fontSize:10,color:'var(--g)',fontFamily:'var(--mono)',wordBreak:'break-all',lineHeight:1.5}}>{addr}</div>
                  </div>
                  <button onClick={()=>{navigator.clipboard&&navigator.clipboard.writeText(addr);}} style={{padding:'4px 10px',borderRadius:8,background:'var(--panel)',border:'1px solid var(--bb)',color:'var(--g)',fontSize:9,cursor:'pointer',fontFamily:'var(--mono)',flexShrink:0}}>COPY</button>
                </div>
              ))}
            </div>
          )}

          {/* Categories */}
          {categories&&categories.length>0&&(
            <div style={{margin:'0 14px 14px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'14px'}}>
              <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:10}}>CATEGORIES</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {categories.slice(0,8).map(c=><span key={c} style={{padding:'4px 10px',borderRadius:20,background:'var(--bg3)',border:'1px solid var(--b)',fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>{c}</span>)}
              </div>
            </div>
          )}
        </>}
      </>}

    </div>
  );
}
