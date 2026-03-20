import { useState } from 'react';
import { BackBar, Btn, Input, Bx, CoinIcon } from '../components/primitives';

const WTABS = ['Overview', 'Funding', 'Trading'];

export default function WalletPage({ toast, coins, bp, onBack, navigate }) {
  const [tab,      setTab]      = useState('Overview');
  const [screen,   setScreen]   = useState(null);
  const [selCoin,  setSelCoin]  = useState(null);
  const [swapFrom, setSwapFrom] = useState('BTC');
  const [swapTo,   setSwapTo]   = useState('USDT');
  const [swapAmt,  setSwapAmt]  = useState('');

  const assets = [
    {sym:'₿',  name:'Bitcoin',  code:'BTC',    id:'bitcoin',     bal:0, col:'#f7931a'},
    {sym:'Ξ',  name:'Ethereum', code:'ETH',    id:'ethereum',    bal:0, col:'#8d95d0'},
    {sym:'◎',  name:'Solana',   code:'SOL',    id:'solana',      bal:0, col:'#14f195'},
    {sym:'🐑', name:'CUTBAR',   code:'CUTBAR', id:'cudbar',      bal:0, col:'#00ff41'},
    {sym:'₮',  name:'Tether',   code:'USDT',   id:'tether',      bal:0, col:'#26a17b'},
    {sym:'B',  name:'BNB',      code:'BNB',    id:'binancecoin', bal:0, col:'#f3ba2f'},
  ];

  const coinMap   = Object.fromEntries(coins.map(c => [c.id, c]));
  const getPrice  = a => { const live=bp[a.code+'USDT']; const cd=coinMap[a.id]; return (live&&live.price)||(cd&&cd.current_price)||0; };
  const getChg    = a => { const live=bp[a.code+'USDT']; const cd=coinMap[a.id]; return (live&&live.change)||(cd&&cd.price_change_percentage_24h)||0; };
  const totalUSD  = assets.reduce((s, a) => s + a.bal * getPrice(a), 0);

  const ACTIONS = [
    {ic:'📥', lb:'Add Funds', fn:()=>setScreen('deposit')},
    {ic:'📤', lb:'Send',      fn:()=>setScreen('send')},
    {ic:'⇄',  lb:'Transfer',  fn:()=>setScreen('transfer')},
    {ic:'💰', lb:'Earn',      fn:()=>navigate('earn')},
  ];

  // ── COIN DETAIL ──
  if (screen === 'coinDetail' && selCoin) {
    const price=getPrice(selCoin); const chg=getChg(selCoin); const cd=coinMap[selCoin.id];
    return (
      <div className="fu">
        <BackBar title={selCoin.name} onBack={()=>{setScreen(null);setSelCoin(null);}}/>
        <div style={{margin:'0 14px 12px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:16}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
            {cd?<CoinIcon coin={cd} size={44} radius={11}/>:<div style={{width:44,height:44,borderRadius:11,background:selCoin.col+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,border:'1px solid '+selCoin.col+'28',flexShrink:0}}>{selCoin.sym}</div>}
            <div style={{flex:1}}><div style={{fontSize:16,fontWeight:800}}>{selCoin.name}</div><div style={{fontSize:11,color:'var(--td)',fontFamily:'var(--mono)'}}>{selCoin.code}</div></div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:18,fontWeight:800,color:'var(--g)',fontFamily:'var(--mono)'}}>${price<1?price.toFixed(6):price.toLocaleString('en',{maximumFractionDigits:2})}</div>
              <div style={{fontSize:11,color:chg>=0?'var(--g)':'var(--red)',fontFamily:'var(--mono)'}}>{chg>=0?'▲':'▼'}{Math.abs(chg||0).toFixed(2)}%</div>
            </div>
          </div>
          <div style={{background:'var(--bg3)',borderRadius:12,padding:'12px 14px',marginBottom:14}}>
            <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:6}}>YOUR BALANCE</div>
            <div style={{fontSize:24,fontWeight:800,color:'var(--g)',fontFamily:'var(--mono)',marginBottom:2}}>{selCoin.bal.toLocaleString()} {selCoin.code}</div>
            <div style={{fontSize:12,color:'var(--td)',fontFamily:'var(--mono)'}}>approx ${(selCoin.bal*price).toLocaleString('en',{maximumFractionDigits:2})}</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {[{icon:'📤',label:'Send',color:'var(--g)',fn:()=>setScreen('send')},{icon:'📥',label:'Receive',color:'var(--cyan)',fn:()=>setScreen('deposit')},{icon:'⇄',label:'Swap',color:'var(--gold)',fn:()=>{setSwapFrom(selCoin.code);setScreen('swap');}},{icon:'📈',label:'Trade',color:'var(--orange)',fn:()=>navigate('trade')}].map(a=>(
              <button key={a.label} onClick={a.fn} style={{padding:'13px',borderRadius:11,background:'var(--bg3)',border:'1px solid var(--b)',color:a.color,fontFamily:'var(--body)',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
                <span style={{fontSize:22}}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── DEPOSIT ──
  if (screen === 'deposit') return (
    <div className="fu">
      <BackBar title="Add Funds" onBack={()=>setScreen(null)}/>
      <div style={{padding:'8px 14px 14px'}}>
        <div style={{fontSize:15,fontWeight:800,marginBottom:2}}>Select Deposit Method</div>
        <div style={{fontSize:12,color:'var(--td)',marginBottom:14}}>Buy Crypto with Fiat</div>
        {[{icon:'💳',title:'Buy Crypto',sub:'Buy instantly using Visa, Mastercard, and more',fn:()=>toast('Redirecting to payment gateway...'),badge:null},{icon:'🤝',title:'P2P Trading',sub:'Buy safely from verified merchants with local payment methods',fn:()=>setScreen('p2p'),badge:'Last Used'}].map(m=>(
          <div key={m.title} onClick={m.fn} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'14px',cursor:'pointer',marginBottom:10,display:'flex',alignItems:'center',gap:12,position:'relative'}}>
            {m.badge&&<div style={{position:'absolute',top:10,right:10,background:'var(--g)',color:'#000',fontSize:9,fontFamily:'var(--mono)',fontWeight:700,padding:'2px 8px',borderRadius:10}}>{m.badge}</div>}
            <div style={{width:42,height:42,borderRadius:12,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{m.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,marginBottom:2}}>{m.title}</div><div style={{fontSize:11,color:'var(--td)',lineHeight:1.5}}>{m.sub}</div></div>
            <span style={{fontSize:16,color:'var(--td)'}}>›</span>
          </div>
        ))}
        <div style={{fontSize:12,color:'var(--td)',marginBottom:10,marginTop:6}}>Already have crypto?</div>
        {[{icon:'⬇️',title:'Deposit Crypto',sub:'Add funds directly to your addresses via blockchain',fn:()=>setScreen('deposit_crypto')},{icon:'🏦',title:'Deposit at Cutbar Pay Bank',sub:'Transfer from your bank account or UPI',fn:()=>navigate('cutpay')}].map(m=>(
          <div key={m.title} onClick={m.fn} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'14px',cursor:'pointer',marginBottom:10,display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:42,height:42,borderRadius:12,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{m.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,marginBottom:2}}>{m.title}</div><div style={{fontSize:11,color:'var(--td)',lineHeight:1.5}}>{m.sub}</div></div>
            <span style={{fontSize:16,color:'var(--td)'}}>›</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── DEPOSIT CRYPTO ──
  if (screen === 'deposit_crypto') return (
    <div className="fu">
      <BackBar title="Deposit Crypto" onBack={()=>setScreen('deposit')}/>
      <div style={{padding:14,display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
        <div style={{background:'white',borderRadius:16,padding:16,boxShadow:'0 0 30px rgba(0,255,65,.2)'}}>
          <svg width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" fill="white"/>{[0,1,2,3,4].map(r=>[0,1,2,3,4].map(c=><rect key={r+'-'+c} x={12+c*28} y={12+r*28} width={24} height={24} fill={(r<2&&c<2)||(r<2&&c>2)||(r>2&&c<2)?'#00a028':'#222'} rx={3}/>))}</svg>
        </div>
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:12,padding:'12px 14px',fontFamily:'var(--mono)',fontSize:11,color:'var(--td)',wordBreak:'break-all',textAlign:'center',lineHeight:1.7,width:'100%'}}>0x4aB7C1d9F3e2b8A6c5D0e1F2a3B4c5D6e7F8a9B0</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',justifyContent:'center'}}>
          {['BSC (BEP-20)','ETH (ERC-20)','SOL (SPL)'].map(n=><Bx key={n} color="green">{n}</Bx>)}
        </div>
        <div style={{width:'100%',display:'flex',gap:8}}>
          <Btn v="outline" onClick={()=>toast('Address copied!')}>COPY</Btn>
          <Btn v="primary" onClick={()=>toast('QR link shared!')}>SHARE</Btn>
        </div>
      </div>
    </div>
  );

  // ── SEND / WITHDRAW ──
  if (screen === 'send') return (
    <div className="fu">
      <BackBar title="Send / Withdraw" onBack={()=>setScreen(null)}/>
      <div style={{padding:'8px 14px 14px'}}>
        <div style={{fontSize:15,fontWeight:800,marginBottom:2}}>Select Withdrawal Method</div>
        <div style={{fontSize:12,color:'var(--td)',marginBottom:14}}>Sell Crypto for Fiat</div>
        {[{icon:'💵',title:'Sell Crypto',sub:'Convert your cryptocurrency to fiat instantly',fn:()=>toast('Redirecting to sell...'),badge:'Last Used'},{icon:'🤝',title:'P2P Trading',sub:'Sell your crypto to verified merchants for fiat',fn:()=>setScreen('p2p'),badge:null},{icon:'🏦',title:'Withdraw Fiat',sub:'Withdraw fiat directly to your bank account',fn:()=>toast('Bank withdrawal initiated'),badge:null}].map(m=>(
          <div key={m.title} onClick={m.fn} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'14px',cursor:'pointer',marginBottom:10,display:'flex',alignItems:'center',gap:12,position:'relative'}}>
            {m.badge&&<div style={{position:'absolute',top:10,right:10,background:'var(--g)',color:'#000',fontSize:9,fontFamily:'var(--mono)',fontWeight:700,padding:'2px 8px',borderRadius:10}}>{m.badge}</div>}
            <div style={{width:42,height:42,borderRadius:12,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{m.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,marginBottom:2}}>{m.title}</div><div style={{fontSize:11,color:'var(--td)',lineHeight:1.5}}>{m.sub}</div></div>
            <span style={{fontSize:16,color:'var(--td)'}}>›</span>
          </div>
        ))}
        <div style={{fontSize:12,color:'var(--td)',marginBottom:10,marginTop:6}}>Withdraw Crypto</div>
        {[{icon:'📤',title:'Withdraw Crypto',sub:'Send crypto to another platform or wallet via blockchain',fn:()=>setScreen('withdraw_crypto')},{icon:'🔑',title:'Cutbar Pay',sub:'Pay with CUTBAR to merchants and services',fn:()=>navigate('cutpay')}].map(m=>(
          <div key={m.title} onClick={m.fn} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'14px',cursor:'pointer',marginBottom:10,display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:42,height:42,borderRadius:12,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{m.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,marginBottom:2}}>{m.title}</div><div style={{fontSize:11,color:'var(--td)',lineHeight:1.5}}>{m.sub}</div></div>
            <span style={{fontSize:16,color:'var(--td)'}}>›</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── WITHDRAW CRYPTO ──
  if (screen === 'withdraw_crypto') return (
    <div className="fu">
      <BackBar title="Withdraw Crypto" onBack={()=>setScreen('send')}/>
      <div style={{padding:14,display:'flex',flexDirection:'column',gap:12}}>
        <Input label="Recipient Address" placeholder="0x... wallet address or ENS"/>
        <div style={{display:'flex',gap:10}}>
          <Input label="Amount" placeholder="0.00" type="number" style={{flex:1}}/>
          <div style={{flex:.5,display:'flex',flexDirection:'column',gap:5}}>
            <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:1,textTransform:'uppercase'}}>Coin</span>
            <select style={{background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:13,borderRadius:9,padding:11,outline:'none'}}>
              {['BTC','ETH','SOL','CUTBAR','USDT','BNB'].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:5}}>
          <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:1,textTransform:'uppercase'}}>Network</span>
          <select style={{background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:13,borderRadius:9,padding:11,width:'100%',outline:'none'}}>
            {['BSC (BEP-20)','Ethereum (ERC-20)','Solana (SPL)','Bitcoin','Polygon'].map(n=><option key={n}>{n}</option>)}
          </select>
        </div>
        <div style={{background:'rgba(255,215,0,.06)',border:'1px solid rgba(255,215,0,.2)',borderRadius:10,padding:'10px 13px'}}>
          {[['Network Fee','~$0.10 (BSC)'],['Est. Time','~3 seconds'],['Min Withdrawal','10 USDT'],['Security','256-bit AES']].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
              <span style={{fontSize:11,color:'var(--td)',fontFamily:'var(--mono)'}}>{k}</span>
              <span style={{fontSize:11,color:'var(--gold)',fontFamily:'var(--mono)',fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
        <Btn v="primary" onClick={()=>{toast('TX broadcast to blockchain!');setScreen(null);}}>CONFIRM WITHDRAWAL</Btn>
      </div>
    </div>
  );

  // ── SWAP ──
  if (screen === 'swap') {
    const fromPrice=(bp[swapFrom+'USDT']&&bp[swapFrom+'USDT'].price)||0;
    const toPrice=(bp[swapTo+'USDT']&&bp[swapTo+'USDT'].price)||1;
    const rate=toPrice>0&&fromPrice>0?(fromPrice/toPrice).toFixed(6):'0';
    const receiveAmt=swapAmt&&+rate>0?(+swapAmt*+rate).toFixed(6):'';
    return (
      <div className="fu">
        <BackBar title="Convert" onBack={()=>setScreen(null)} right={<Bx color="green" style={{fontSize:9}}>0 Fees</Bx>}/>
        <div style={{display:'flex',gap:0,padding:'0 14px',borderBottom:'1px solid var(--b)'}}>
          {['Market','Limit','Staking'].map((t,i)=>(
            <div key={t} style={{padding:'10px 14px',fontSize:12,fontWeight:700,color:i===0?'var(--g)':'var(--td)',borderBottom:i===0?'2px solid var(--g)':'2px solid transparent',cursor:'pointer'}}>{t}</div>
          ))}
        </div>
        <div style={{padding:14,display:'flex',flexDirection:'column',gap:0}}>
          <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:'14px 14px 0 0',padding:'14px 16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}><span style={{fontSize:12,color:'var(--td)'}}>Pay</span></div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <select value={swapFrom} onChange={e=>setSwapFrom(e.target.value)} style={{background:'transparent',border:'none',color:'var(--text)',fontFamily:'var(--body)',fontSize:16,fontWeight:800,outline:'none',cursor:'pointer'}}>
                {['BTC','ETH','SOL','CUTBAR','BNB','USDT'].map(c=><option key={c} style={{background:'var(--bg3)'}}>{c}</option>)}
              </select>
              <input value={swapAmt} onChange={e=>setSwapAmt(e.target.value)} placeholder="0.000001" style={{flex:1,background:'transparent',border:'none',color:'var(--text)',fontFamily:'var(--mono)',fontSize:18,fontWeight:700,outline:'none',textAlign:'right'}}/>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'center',margin:'0',zIndex:1}}>
            <button onClick={()=>{const t=swapFrom;setSwapFrom(swapTo);setSwapTo(t);}} style={{width:40,height:40,borderRadius:'50%',background:'var(--bg)',border:'2px solid var(--b)',color:'var(--text)',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800}}>⇅</button>
          </div>
          <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:'0 0 14px 14px',padding:'14px 16px',borderTop:'none'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}><span style={{fontSize:12,color:'var(--td)'}}>Receive</span></div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <select value={swapTo} onChange={e=>setSwapTo(e.target.value)} style={{background:'transparent',border:'none',color:'var(--text)',fontFamily:'var(--body)',fontSize:16,fontWeight:800,outline:'none',cursor:'pointer'}}>
                {['USDT','ETH','BTC','SOL','BNB','CUTBAR'].map(c=><option key={c} style={{background:'var(--bg3)'}}>{c}</option>)}
              </select>
              <div style={{flex:1,textAlign:'right',fontSize:18,fontWeight:700,color:'var(--td)',fontFamily:'var(--mono)'}}>{receiveAmt||'—'}</div>
            </div>
          </div>
          <div style={{textAlign:'center',padding:'14px 0',borderBottom:'1px solid var(--b)',marginBottom:14}}>
            <span style={{fontSize:13,color:'var(--td)',fontFamily:'var(--mono)'}}>1 {swapFrom} ≈ {rate} {swapTo}</span>
          </div>
          <Btn v={swapAmt?'primary':'ghost'} disabled={!swapAmt} onClick={()=>{toast('Swap: '+swapAmt+' '+swapFrom+' → '+receiveAmt+' '+swapTo);setScreen(null);}}>
            {swapAmt ? 'Confirm Swap' : 'Enter Amount'}
          </Btn>
        </div>
      </div>
    );
  }

  // ── P2P ──
  if (screen === 'p2p') return (
    <div className="fu">
      <BackBar title="P2P Trading" onBack={()=>setScreen(null)}/>
      <div style={{display:'flex',flexDirection:'column',gap:10,padding:14}}>
        {[{init:'VB',name:'VeerBhat_Pro',trades:1243,rate:'99.2',price:'57,20,000',min:'₹1,000',max:'₹5,00,000',methods:'UPI · IMPS · CDM',time:'10 min',col:'#00ff41'},{init:'SA',name:'SatoshiAlpha',trades:567,rate:'98.7',price:'57,15,000',min:'₹5,000',max:'₹10,00,000',methods:'Bank · CDM · NEFT',time:'15 min',col:'#00e5ff'},{init:'KH',name:'Khachi',trades:42,rate:'100',price:'57,00,000',min:'₹100',max:'₹50,000',methods:'UPI · CutPay · CDM',time:'2 min',col:'#ff7a00'}].map(t=>(
          <div key={t.name} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,padding:14}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <div style={{width:40,height:40,borderRadius:10,background:t.col+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:800,color:t.col,fontFamily:'var(--display)',border:'1px solid '+t.col+'28',flexShrink:0}}>{t.init}</div>
                <div><div style={{fontSize:14,fontWeight:700}}>{t.name}</div><div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>{t.trades} trades · {t.rate}%⭐</div></div>
              </div>
              <div style={{fontSize:16,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700}}>₹{t.price}</div>
            </div>
            <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:10}}>
              {['Min:'+t.min,'Max:'+t.max,t.methods,'⚡'+t.time].map(d=>(
                <div key={d} style={{background:'var(--bg3)',borderRadius:5,padding:'3px 8px',fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',border:'1px solid var(--b)'}}>{d}</div>
              ))}
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>toast('Buy from '+t.name)} style={{flex:1,padding:'10px',borderRadius:9,border:'1px solid rgba(0,255,65,.3)',background:'rgba(0,255,65,.1)',color:'var(--g)',fontFamily:'var(--display)',fontSize:12,cursor:'pointer',fontWeight:700}}>BUY</button>
              <button onClick={()=>toast('Sell to '+t.name)} style={{flex:1,padding:'10px',borderRadius:9,border:'1px solid rgba(255,59,92,.3)',background:'rgba(255,59,92,.1)',color:'var(--red)',fontFamily:'var(--display)',fontSize:12,cursor:'pointer',fontWeight:700}}>SELL</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── TRANSFER ──
  if (screen === 'transfer') return (
    <div className="fu">
      <BackBar title="Internal Transfer" onBack={()=>setScreen(null)}/>
      <div style={{padding:14,display:'flex',flexDirection:'column',gap:10}}>
        {[{from:'Funding',to:'Trading'},{from:'Trading',to:'Funding'},{from:'Funding',to:'Margin'},{from:'Funding',to:'Futures'}].map(t=>(
          <div key={t.from+t.to} onClick={()=>toast('Transfer from '+t.from+' to '+t.to+' done!')} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,padding:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:13,fontWeight:700}}>{t.from}</span>
            <span style={{fontSize:18,color:'var(--g)'}}>→</span>
            <span style={{fontSize:13,fontWeight:700,color:'var(--g)'}}>{t.to}</span>
          </div>
        ))}
        <Input label="Amount (USDT)" placeholder="0.00" type="number"/>
        <Btn v="primary" onClick={()=>{toast('Transfer complete!');setScreen(null);}}>TRANSFER NOW</Btn>
      </div>
    </div>
  );

  // ── MAIN VIEW ──
  const tabBals   = {Overview:totalUSD, Funding:totalUSD*0.99, Trading:totalUSD*0.01, Margin:0, Futures:0};
  const tabAssets = {Overview:assets, Funding:assets.slice(0,3), Trading:assets.slice(0,2), Margin:[], Futures:[]};

  return (
    <div className="fu">
      <BackBar title="Wallet" onBack={onBack}/>
      <div style={{margin:'0 14px 14px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:16,padding:16}}>
        <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:6}}>TOTAL ASSETS</div>
        <div style={{fontSize:32,fontFamily:'var(--display)',letterSpacing:1,marginBottom:2}}>
          <span style={{color:'var(--g)'}}>{(tabBals[tab]||0).toFixed(2)}</span> <span style={{fontSize:16,color:'var(--td)'}}>USDT</span>
        </div>
        <div style={{fontSize:11,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:14}}>approx ₹{((tabBals[tab]||0)*83.5).toLocaleString('en-IN',{maximumFractionDigits:0})}</div>
        <div style={{display:'flex',gap:0,justifyContent:'space-around'}}>
          {ACTIONS.map(a=>(
            <div key={a.lb} onClick={a.fn} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,cursor:'pointer',flex:1}}>
              <div style={{width:46,height:46,borderRadius:'50%',background:'var(--bg3)',border:'1px solid var(--b)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{a.ic}</div>
              <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--body)',fontWeight:700}}>{a.lb}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:'flex',overflowX:'auto',borderBottom:'1px solid var(--b)',paddingLeft:14}}>
        {WTABS.map(t=>(
          <div key={t} onClick={()=>setTab(t)} style={{flexShrink:0,padding:'10px 14px',fontSize:12,fontWeight:700,cursor:'pointer',borderBottom:'2px solid '+(tab===t?'var(--g)':'transparent'),color:tab===t?'var(--g)':'var(--td)',transition:'all .2s',whiteSpace:'nowrap'}}>{t}</div>
        ))}
      </div>
      {(tab==='Margin'||tab==='Futures') ? (
        <div style={{padding:28,textAlign:'center'}}>
          <div style={{fontSize:32,marginBottom:8}}>🔮</div>
          <div style={{fontSize:14,fontWeight:700,color:'var(--gold)',marginBottom:4}}>{tab}</div>
          <div style={{fontSize:12,color:'var(--td)',lineHeight:1.6,marginBottom:14}}>Coming in Phase 4. High risk products for experienced traders.</div>
          <Btn v="ghost" onClick={()=>toast(`Notify me when ${tab} goes live!`)}>Get Notified</Btn>
        </div>
      ) : (
        <>
          {(tabAssets[tab]||assets).map((a,i)=>{
            const price=getPrice(a);const chg=getChg(a);const cd=coinMap[a.id];const val=a.bal*price;const pct=totalUSD>0?(val/totalUSD*100).toFixed(1):0;
            return (
              <div key={a.code} onClick={()=>{setSelCoin(a);setScreen('coinDetail');}} style={{cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(0,255,65,.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                {i>0&&<div style={{height:1,background:'var(--b)',margin:'0 14px'}}/>}
                <div style={{display:'flex',gap:12,padding:'12px 14px',alignItems:'center'}}>
                  <div style={{position:'relative',flexShrink:0}}>
                    {cd?<CoinIcon coin={cd} size={38} radius={10}/>:<div style={{width:38,height:38,borderRadius:10,background:a.col+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:'bold',color:a.col,border:'1px solid '+a.col+'28'}}>{a.sym}</div>}
                    <div style={{position:'absolute',bottom:-2,right:-2,width:10,height:10,borderRadius:'50%',background:chg>=0?'var(--g)':'var(--red)',border:'2px solid var(--bg)'}}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{a.name}</div>
                    <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>{pct}%</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:13,fontWeight:700,fontFamily:'var(--mono)',marginBottom:1}}>{a.bal.toFixed(4)} {a.code}</div>
                    <div style={{fontSize:10,color:chg>=0?'var(--g)':'var(--red)',fontFamily:'var(--mono)'}}>{chg>=0?'+':''}{chg.toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{padding:'28px 20px',textAlign:'center'}}>
            <div style={{fontSize:36,marginBottom:10}}>📭</div>
            <div style={{fontSize:14,fontWeight:700,color:'var(--text)',marginBottom:6}}>No transactions yet</div>
            <div style={{fontSize:11,color:'var(--td)',lineHeight:1.6,marginBottom:16}}>Start by adding funds to your wallet to unlock the full CUTBAR experience.</div>
            <Btn v="primary" onClick={()=>setScreen('deposit')} style={{maxWidth:200,margin:'0 auto'}}>Deposit Now →</Btn>
          </div>
        </>
      )}
    </div>
  );
}
