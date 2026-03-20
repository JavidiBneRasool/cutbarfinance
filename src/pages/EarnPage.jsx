import { BackBar } from '../components/primitives';

const EARN_ASSETS=[
  {sym:'USD', name:'US Dollar',  apr:'4.25–5.25%', icon:'💵',color:'#00cc88'},
  {sym:'EUR', name:'Euro',       apr:'2–3%',        icon:'💶',color:'#00b4d8'},
  {sym:'USDT',name:'Tether USD', apr:'4–5%',        icon:'🟢',color:'#26a17b'},
  {sym:'USDC',name:'USDC',       apr:'4–5%',        icon:'🔵',color:'#2775ca'},
  {sym:'BTC', name:'Bitcoin',    apr:'0.1–0.15%',   icon:'🟡',color:'#f7931a'},
  {sym:'ADA', name:'Cardano',    apr:'2.49%',        icon:'🔵',color:'#0033ad'},
  {sym:'ATOM',name:'Cosmos',     apr:'9.33–18.66%', icon:'⚛️',color:'#2e3148'},
  {sym:'DOT', name:'Polkadot',   apr:'5.08–10.16%', icon:'🔴',color:'#e6007a'},
  {sym:'SOL', name:'Solana',     apr:'3–6%',         icon:'◎', color:'#14f195'},
  {sym:'ETH', name:'Ethereum',   apr:'2.63–2.723%', icon:'⟠', color:'#8d95d0'},
  {sym:'TRX', name:'TRON',       apr:'1.5–3%',       icon:'🔺',color:'#e50915'},
  {sym:'KSM', name:'Kusama',     apr:'7.37–14.74%', icon:'🦋',color:'#000000'},
  {sym:'FLOW',name:'Flow',       apr:'6.07–13.68%', icon:'🌊',color:'#00d4aa'},
  {sym:'INJ', name:'Injective',  apr:'2.76–5.51%',  icon:'🔮',color:'#00b2ff'},
  {sym:'TAO', name:'Bittensor',  apr:'6%',           icon:'🧠',color:'#ffffff'},
  {sym:'POL', name:'Polygon',    apr:'1.16–2.33%',  icon:'🟣',color:'#8247e5'},
  {sym:'SUI', name:'Sui',        apr:'0.75–1.49%',  icon:'💠',color:'#6fbcf0'},
  {sym:'BNB', name:'BNB Chain',  apr:'0.24–0.48%',  icon:'💛',color:'#f0b90b'},
];

export default function EarnPage({ toast, onBack, coins }) {
  return(
    <div className="fu">
      <BackBar title="Earn" onBack={onBack} right={<span style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>Rewards: <span style={{color:'var(--g)'}}>0.00</span> USDT</span>}/>
      <div style={{display:'flex',gap:10,padding:'0 14px 14px',overflowX:'auto'}}>
        <div style={{flexShrink:0,width:260,background:'linear-gradient(135deg,rgba(0,255,65,.1),rgba(0,255,65,.04))',border:'1px solid rgba(0,255,65,.25)',borderRadius:16,padding:16}}>
          <div style={{fontSize:22,marginBottom:8}}>💰</div>
          <div style={{fontSize:12,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:4}}>AUTO EARN</div>
          <div style={{fontSize:20,fontWeight:800,color:'var(--g)',fontFamily:'var(--display)',letterSpacing:1}}>Up to 9.33%</div>
          <div style={{fontSize:11,color:'var(--td)',lineHeight:1.6,marginBottom:10}}>Earn rewards on assets in your spot wallet while keeping funds free to trade or withdraw.</div>
          <button onClick={()=>toast('💰 Auto Earn activated!')} style={{padding:'9px 16px',borderRadius:9,border:'none',cursor:'pointer',fontFamily:'var(--display)',fontSize:12,background:'var(--g)',color:'#000',letterSpacing:.5}}>Deposit to Earn</button>
        </div>
        <div style={{flexShrink:0,width:260,background:'linear-gradient(135deg,rgba(255,215,0,.1),rgba(255,215,0,.04))',border:'1px solid rgba(255,215,0,.25)',borderRadius:16,padding:16}}>
          <div style={{fontSize:22,marginBottom:8}}>📈</div>
          <div style={{fontSize:12,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:4}}>EARN STRATEGIES</div>
          <div style={{fontSize:20,fontWeight:800,color:'var(--gold)',fontFamily:'var(--display)',letterSpacing:1}}>Up to 18.66%</div>
          <div style={{fontSize:11,color:'var(--td)',lineHeight:1.6,marginBottom:10}}>Discover staking strategies. Lock your rewards by committing for longer periods.</div>
          <button onClick={()=>toast('📈 Strategy explorer opened!')} style={{padding:'9px 16px',borderRadius:9,border:'none',cursor:'pointer',fontFamily:'var(--display)',fontSize:12,background:'var(--gold)',color:'#000',letterSpacing:.5}}>Explore</button>
        </div>
      </div>
      <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',padding:'0 16px 10px',letterSpacing:3}}>ALL ASSETS</div>
      <div style={{margin:'0 14px 20px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,overflow:'hidden'}}>
        {EARN_ASSETS.map((a,i)=>(
          <div key={a.sym}>
            {i>0&&<div style={{height:1,background:'var(--b)',margin:'0 14px'}}/>}
            <div onClick={()=>toast(`💰 Earn ${a.apr} APR on ${a.name}`)} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',cursor:'pointer',transition:'background .15s'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(0,255,65,.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <div style={{width:38,height:38,borderRadius:10,background:a.color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,border:`1px solid ${a.color}28`,flexShrink:0}}>{a.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>{a.name}</div>
                <div style={{fontSize:10,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700}}>{a.apr} APR</div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:13,fontWeight:700,color:'var(--td)',fontFamily:'var(--mono)'}}>0.00 {a.sym}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
