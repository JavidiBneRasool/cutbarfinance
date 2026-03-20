import { useState, useMemo } from 'react';
import { BackBar, R, C, Txt, Bx, Btn, CoinIcon } from '../components/primitives';

export default function TradePage({ toast, coins, bp, onBack }) {
  const [pair,setPair]=useState('BTCUSDT');const [side,setSide]=useState('buy');const [ot,setOt]=useState('limit');const [amt,setAmt]=useState('0.01');
  const live=bp[pair];const mid=(live&&live.price)||67432;const total=(+amt*mid).toFixed(2);
  const asks=useMemo(()=>Array.from({length:5},(_,i)=>[(mid*(1+.0001*(i+1))).toFixed(2),(Math.random()*2+.1).toFixed(3)]),[mid]);
  const bids=useMemo(()=>Array.from({length:5},(_,i)=>[(mid*(1-.0001*(i+1))).toFixed(2),(Math.random()*2+.1).toFixed(3)]),[mid]);
  const coin=coins.find(c=>c.symbol.toUpperCase()===pair.replace('USDT',''));
  return(
    <div className="fu">
      <BackBar title="Pro Trade" onBack={onBack}/>
      <R gap={7} style={{padding:'0 14px 8px',overflowX:'auto'}}>
        {['BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT','ADAUSDT'].map(p=>{
          const c=coins.find(x=>x.symbol.toUpperCase()===p.replace('USDT',''));
          return(<div key={p} onClick={()=>setPair(p)} style={{flexShrink:0,display:'flex',alignItems:'center',gap:5,padding:'5px 10px',borderRadius:20,border:`1px solid ${pair===p?'var(--bb)':'var(--b)'}`,background:pair===p?'rgba(0,255,65,.1)':'var(--panel)',cursor:'pointer'}}>
            {c&&<CoinIcon coin={c} size={16} radius={4}/>}
            <Txt size={10} color={pair===p?'var(--g)':'var(--td)'} mono={true} weight={700}>{p.replace('USDT','/U')}</Txt>
          </div>);
        })}
      </R>
      <div style={{margin:'0 14px 10px',background:'var(--panel)',border:'1px solid var(--bb)',borderRadius:12,padding:'11px 14px'}}>
        <R justify="space-between">
          <R gap={10}>
            {coin&&<CoinIcon coin={coin} size={36} radius={9}/>}
            <C gap={2}><Txt size={9} color="var(--td)" mono={true} style={{letterSpacing:2}}>{pair}</Txt><Txt size={24} color="var(--g)" mono={true} weight={700}>${mid.toLocaleString('en',{maximumFractionDigits:2})}</Txt></C>
          </R>
          <C gap={4} align="flex-end">
            {live&&<><Bx color={live.change>=0?'green':'red'}>{live.change>=0?'+':''}{(live.change||0).toFixed(2)}%</Bx><Txt size={9} color="var(--td)" mono={true}>H:${(live.high||0).toFixed(0)} L:${(live.low||0).toFixed(0)}</Txt></>}
            <Bx color="green" style={{fontSize:8}}>● BINANCE LIVE</Bx>
          </C>
        </R>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,margin:'0 14px 10px'}}>
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:12,padding:'10px 10px 8px'}}>
          {[...asks].reverse().map(([p,a],i)=>(
            <R key={i} justify="space-between" onClick={()=>setAmt(a)} style={{padding:'3px 2px',fontFamily:'var(--mono)',fontSize:10,cursor:'pointer',color:'var(--red)',position:'relative'}}>
              <div style={{position:'absolute',right:0,top:0,bottom:0,width:`${+a/2*100}%`,background:'rgba(255,59,92,.06)',borderRadius:3}}/>
              <span>{(+p).toFixed(0)}</span><span>{(+a).toFixed(3)}</span>
            </R>
          ))}
          <div style={{textAlign:'center',padding:'5px 0',fontFamily:'var(--display)',fontSize:13,color:'var(--g)',letterSpacing:1}}>${mid.toFixed(0)}</div>
          {bids.map(([p,a],i)=>(
            <R key={i} justify="space-between" onClick={()=>setAmt(a)} style={{padding:'3px 2px',fontFamily:'var(--mono)',fontSize:10,cursor:'pointer',color:'var(--g)',position:'relative'}}>
              <div style={{position:'absolute',right:0,top:0,bottom:0,width:`${+a/2*100}%`,background:'rgba(0,255,65,.06)',borderRadius:3}}/>
              <span>{(+p).toFixed(0)}</span><span>{(+a).toFixed(3)}</span>
            </R>
          ))}
        </div>
        <C gap={8}>
          <R gap={6}>{[['buy','BUY'],['sell','SELL']].map(([t,l])=><div key={t} onClick={()=>setSide(t)} style={{flex:1,padding:9,textAlign:'center',borderRadius:9,fontFamily:'var(--display)',fontSize:13,cursor:'pointer',border:`1px solid ${side===t?(t==='sell'?'var(--red)':'var(--g)'):'var(--b)'}`,background:side===t?(t==='sell'?'rgba(255,59,92,.15)':'rgba(0,255,65,.12)'):'var(--bg3)',color:side===t?(t==='sell'?'var(--red)':'var(--g)'):'var(--td)',letterSpacing:1}}>{l}</div>)}</R>
          <R gap={5}>{['Limit','Market','Stop'].map(o=><div key={o} onClick={()=>setOt(o.toLowerCase())} style={{flex:1,padding:5,textAlign:'center',borderRadius:7,fontFamily:'var(--mono)',fontSize:9,cursor:'pointer',border:`1px solid ${ot===o.toLowerCase()?'var(--bb)':'var(--b)'}`,background:ot===o.toLowerCase()?'rgba(0,255,65,.08)':'var(--bg3)',color:ot===o.toLowerCase()?'var(--g)':'var(--td)'}}>{o}</div>)}</R>
          <C gap={6}>
            <C gap={3}><Txt size={9} color="var(--td)" mono={true} style={{letterSpacing:1}}>PRICE</Txt><div style={{position:'relative'}}><input readOnly value={mid.toFixed(2)} style={{background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:12,borderRadius:8,padding:'9px 40px 9px 10px',width:'100%',outline:'none'}}/><span style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',color:'var(--td)',fontSize:9,fontFamily:'var(--mono)'}}>USDT</span></div></C>
            <C gap={3}><Txt size={9} color="var(--td)" mono={true} style={{letterSpacing:1}}>AMOUNT</Txt><div style={{position:'relative'}}><input value={amt} onChange={e=>setAmt(e.target.value)} style={{background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:12,borderRadius:8,padding:'9px 40px 9px 10px',width:'100%',outline:'none'}}/><span style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',color:'var(--td)',fontSize:9,fontFamily:'var(--mono)'}}>{pair.replace('USDT','')}</span></div></C>
            <R gap={5}>{[25,50,75,100].map(p=><div key={p} onClick={()=>setAmt((0.001*p/100).toFixed(6))} style={{flex:1,padding:5,textAlign:'center',borderRadius:7,background:'var(--bg3)',border:'1px solid var(--b)',fontSize:9,color:'var(--td)',cursor:'pointer',fontFamily:'var(--mono)'}}>{p}%</div>)}</R>
            <div style={{background:'rgba(0,255,65,.04)',borderRadius:8,padding:'7px 10px'}}><R justify="space-between"><Txt size={10} color="var(--td)" mono={true}>Total</Txt><Txt size={10} color="var(--g)" mono={true} weight={700}>${total} USDT</Txt></R></div>
          </C>
          <button onClick={()=>toast(`✅ ${side.toUpperCase()} ${amt} @ $${mid.toFixed(2)}`)} style={{padding:11,borderRadius:10,border:'none',cursor:'pointer',fontFamily:'var(--display)',fontSize:13,letterSpacing:1,background:side==='buy'?'linear-gradient(135deg,var(--g2),var(--g))':'linear-gradient(135deg,#aa0022,var(--red))',color:side==='buy'?'#000':'#fff'}}>{side==='buy'?'▲ BUY':'▼ SELL'} {pair.replace('USDT','')}</button>
        </C>
      </div>
    </div>
  );
}
