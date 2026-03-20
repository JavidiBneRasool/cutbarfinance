import { BackBar, Bx } from '../components/primitives';

export default function CutFinancePage({ toast, onBack, navigate }) {
  const PRODS = [
    {id:'cutpay',    icon:'💳',n:'CUTPay',          sub:'Payment OS · Banking · UPI',         c:'#00e5ff',b:'LIVE',    d:'Send · FD · RD · Loans · Insurance · QR pay'},
    {id:'cutplay',   icon:'🎮',n:'cutPlay',          sub:'Chatroom Games',                     c:'#ff7a00',b:'LIVE',    d:'LowCardOut · Dice Cricket · 8Ball · Penalty · Kokar'},
    {id:'laststand', icon:'⚔️',n:'Last Standing',    sub:'Battle Royale Card Game',            c:'#9945ff',b:'LIVE',    d:'!start · !join · !draw — Win pot minus 4%'},
    {id:'cuttrade',  icon:'📈',n:'cutTrade',         sub:'Pro Trading · Spot · Futures',       c:'#ffd700',b:'LIVE',    d:'100 coins · Binance live · Orderbook'},
    {id:'cutpredict',icon:'🔮',n:'cutPredict',       sub:'BTC Price Prediction',               c:'#00e5ff',b:'LIVE',    d:'Predict movement in 10s · Win CUTBAR'},
    {id:'cutstake',  icon:'🌾',n:'cutStake',         sub:'Stake CUTBAR · Earn APY',            c:'#00cc88',b:'PHASE 4', d:'Weekly pools · Tournament bonus APY'},
    {id:'cutloan',   icon:'⚡',n:'cutLoan',          sub:'Instant Loans',                      c:'#ff7a00',b:'LIVE',    d:'2-Wheeler · Car · Home · Personal · Gold'},
    {id:'cutinsure', icon:'🛡️',n:'cutInsure',        sub:'All Insurance types',                c:'#9945ff',b:'LIVE',    d:'Vehicle · Life · Health · Property'},
    {id:'cutscan',   icon:'🔍',n:'cutScan',          sub:'BSC Block Explorer',                 c:'#00e5ff',b:'BETA',    d:'CUTBAR txns · Wallet lookup · Token info'},
    {id:'cutai',     icon:'🤖',n:'cutAI',            sub:'CUTBAR Intelligence',                c:'#00ff41',b:'LIVE',    d:'Market analysis · Trading signals · AI chat'},
    {id:'cutchats',  icon:'💬',n:'cutChats',         sub:'Encrypted Messaging',                c:'#ff3b5c',b:'LIVE',    d:'Private rooms · Group chat · E2E encrypted'},
    {id:'cutbrowser',icon:'🌐',n:'cutBrowser',       sub:'Privacy Web Browser',                c:'#ffd700',b:'BETA',    d:'Tor · Ghost mode · Blockchain bookmarks'},
    {id:'cutforum',  icon:'🗣️',n:'cutForum',         sub:'Community Discussions',              c:'#00cc88',b:'BETA',    d:'Trading talk · AMAs · Governance votes'},
    {id:'cutbot',    icon:'🦾',n:'cutBot',           sub:'Automated Trading Bot',              c:'#8247e5',b:'PHASE 4', d:'DCA · Grid · Signal bot · 24/7 execution'},
  ];
  const PM = {cutpay:'cutpay',cutplay:'cutplay',laststand:'laststand',cuttrade:'trade',cutpredict:'updown',cutstake:'stake_tournament',cutloan:'cutpay',cutinsure:'cutpay',cutscan:'home',cutai:'chat',cutchats:'chat',cutbrowser:'home',cutforum:'home',cutbot:'chat'};

  return (
    <div className="fu">
      <BackBar title="CUTBAR FINANCE 🐑" onBack={onBack}/>
      <div style={{margin:'6px 14px 12px',background:'linear-gradient(135deg,#020a05,#050f10)',border:'1px solid rgba(0,255,65,.2)',borderRadius:18,padding:18,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 70% 30%,rgba(0,255,65,.08),transparent 60%)',pointerEvents:'none'}}/>
        <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:6}}>CUTBAR FINANCE ECOSYSTEM</div>
        <div style={{fontSize:22,fontWeight:800,color:'var(--g)',fontFamily:'var(--display)',letterSpacing:.5,marginBottom:4}}>One Wallet. All Finance.</div>
        <div style={{fontSize:12,color:'var(--tm)',lineHeight:1.7,marginBottom:12}}>Bank · Trade · Play · Borrow · Insure · Browse · Chat — all under CUTBAR. BSC-powered.</div>
        <div style={{display:'flex',gap:7,flexWrap:'wrap'}}><Bx color="green">🐑 CUTBAR Token</Bx><Bx color="gold">BEP-20 · BSC</Bx><Bx color="cyan">14 Products</Bx></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,margin:'0 14px 12px'}}>
        {[['$0.00','Price'],['Pre-Launch','Status'],['100M','Supply']].map(([v,k])=>(
          <div key={k} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:12,padding:'11px 10px',textAlign:'center'}}>
            <div style={{fontSize:16,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:800}}>{v}</div>
            <div style={{fontSize:9,color:'var(--td)'}}>{k}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',padding:'0 16px 8px',letterSpacing:3}}>ALL PRODUCTS</div>
      <div style={{display:'flex',flexDirection:'column',gap:8,padding:'0 14px 20px'}}>
        {PRODS.map(p=>(
          <div key={p.id} onClick={()=>navigate(PM[p.id]||'home')}
            style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'12px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:12,position:'relative',overflow:'hidden',transition:'border-color .2s'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=p.c+'55'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='var(--b)'}>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 0% 50%,'+p.c+'0a,transparent 50%)',pointerEvents:'none'}}/>
            <div style={{width:44,height:44,borderRadius:12,background:p.c+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,border:'1px solid '+p.c+'28',flexShrink:0}}>{p.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:'flex',gap:7,alignItems:'center',marginBottom:2}}>
                <span style={{fontSize:13,fontWeight:800}}>{p.n}</span>
                <Bx style={{fontSize:8,background:p.c+'15',color:p.c,borderColor:p.c+'30'}}>{p.b}</Bx>
              </div>
              <div style={{fontSize:11,color:'var(--td)',fontWeight:600,marginBottom:2}}>{p.sub}</div>
              <div style={{fontSize:10,color:'var(--tm)'}}>{p.d}</div>
            </div>
            <div style={{width:7,height:7,borderRadius:'50%',background:p.b==='LIVE'?'var(--g)':'var(--td)',boxShadow:p.b==='LIVE'?'0 0 6px var(--g)':'none',animation:p.b==='LIVE'?'pulse 1.5s infinite':'none',flexShrink:0}}/>
          </div>
        ))}
      </div>
    </div>
  );
}
