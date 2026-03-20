import { useState } from 'react';
import { BackBar, Btn, Input, Bx } from '../components/primitives';

export default function CutPayPage({ toast, onBack }) {
  const [screen,setScreen] = useState('home');
  const [fdAmt,setFdAmt]   = useState(''); const [fdT,setFdT]   = useState(12);
  const [rdAmt,setRdAmt]   = useState(''); const [rdM,setRdM]   = useState(12);
  const [lAmt,setLAmt]     = useState(''); const [lType,setLType] = useState('2w');
  const [sAmt,setSAmt]     = useState(''); const [sTo,setSTo]     = useState('');

  const FDR = {3:6.5,6:7.0,12:7.5,24:7.8,36:8.0,60:8.2};
  const fdI  = fdAmt?(+fdAmt*(FDR[fdT]/100)*(fdT/12)).toFixed(2):0;
  const fdM2 = fdAmt?((+fdAmt)+(+fdI)).toFixed(2):0;
  const rdRate = 7.5/100/12;
  const rdM2 = rdAmt&&rdM?((+rdAmt*((Math.pow(1+rdRate,+rdM)-1)/rdRate)*(1+rdRate))).toFixed(2):0;
  const rdI  = rdAmt&&rdM?((+rdM2)-(+rdAmt*+rdM)).toFixed(2):0;
  const LOANS = [{id:'2w',icon:'🏍️',lbl:'2-Wheeler',r:9.5,t:48},{id:'4w',icon:'🚗',lbl:'Car Loan',r:8.9,t:84},{id:'hl',icon:'🏠',lbl:'Home Loan',r:8.4,t:240},{id:'pl',icon:'💳',lbl:'Personal',r:12,t:60},{id:'bl',icon:'🏢',lbl:'Business',r:11,t:84},{id:'gl',icon:'🥇',lbl:'Gold Loan',r:7.5,t:24}];
  const sl   = LOANS.find(l=>l.id===lType)||LOANS[0];
  const mr2  = sl.r/100/12;
  const emi  = lAmt&&mr2?((+lAmt*mr2*Math.pow(1+mr2,sl.t))/(Math.pow(1+mr2,sl.t)-1)).toFixed(0):0;
  const INS  = [{icon:'🏍️',n:'2-Wheeler',sub:'Bike · Scooter',p:'₹1,299/yr',c:'#00e5ff'},{icon:'🚗',n:'4-Wheeler',sub:'Car · SUV',p:'₹5,499/yr',c:'#ff7a00'},{icon:'🏠',n:'Property',sub:'Home · Shop',p:'₹2,999/yr',c:'#9945ff'},{icon:'❤️',n:'Life',sub:'Term · ULIP',p:'₹799/mo',c:'#ff3b5c'},{icon:'🏥',n:'Health',sub:'Individual · Family',p:'₹4,999/yr',c:'#00ff41'},{icon:'💼',n:'Business',sub:'SME · Startup',p:'₹9,999/yr',c:'#ffd700'}];

  if(screen==='qr') return(
    <div className="fu"><BackBar title="Scan & Pay · CUTPay" onBack={()=>setScreen('home')}/>
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:20}}>
      <div style={{background:'white',borderRadius:20,padding:20,marginBottom:16,boxShadow:'0 0 40px rgba(0,255,65,.3)'}}>
        <svg width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="white"/>{[0,1,2,3,4,5,6].map(r=>[0,1,2,3,4,5,6].map(c=><rect key={r+'-'+c} x={10+c*23} y={10+r*23} width={20} height={20} fill={(r<3&&c<3)||(r<3&&c>3)||(r>3&&c<3)?'#00cc33':'#111'} rx={2}/>))}<text x="90" y="170" textAnchor="middle" fontSize="9" fill="#00cc33" fontFamily="monospace" fontWeight="bold">user@cutbar · CUTPay</text></svg>
      </div>
      <div style={{fontSize:18,fontWeight:800,color:'var(--g)',fontFamily:'var(--display)',letterSpacing:.5,marginBottom:4}}>user@cutbar</div>
      <div style={{fontSize:11,color:'var(--td)',marginBottom:12}}>Scan with any UPI app · All banks accepted</div>
      <div style={{display:'flex',gap:6,marginBottom:16}}><Bx color="green">GPay</Bx><Bx color="cyan">PhonePe</Bx><Bx color="gold">Paytm</Bx><Bx color="orange">BHIM</Bx></div>
      <div style={{width:'100%',background:'var(--panel)',border:'1px solid var(--bb)',borderRadius:14,padding:14}}>
        <Input label="Request Amount (optional)" placeholder="₹" value={fdAmt} onChange={e=>setFdAmt(e.target.value.replace(/\D/g,''))} suffix="₹" style={{marginBottom:10}}/>
        <Btn v="primary" onClick={()=>toast('📤 QR link copied!')}>📤 Share QR Link</Btn>
      </div>
    </div></div>
  );

  if(screen==='send') return(
    <div className="fu"><BackBar title="Send Money · CUTPay" onBack={()=>setScreen('home')}/>
    <div style={{display:'flex',flexDirection:'column',gap:12,padding:14}}>
      <div style={{background:'linear-gradient(135deg,rgba(0,255,65,.08),rgba(0,229,255,.04))',border:'1px solid var(--bb)',borderRadius:14,padding:14}}>
        <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>AVAILABLE BALANCE</span><span style={{fontSize:13,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700}}>₹12,450.00</span></div>
      </div>
      <Input label="Send To (UPI ID / Phone)" placeholder="name@cutbar or 9876543210" value={sTo} onChange={e=>setSTo(e.target.value)}/>
      <Input label="Amount ₹" placeholder="0.00" value={sAmt} onChange={e=>setSAmt(e.target.value.replace(/\D/g,''))} suffix="₹"/>
      <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:12,padding:12}}>
        <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:8}}>QUICK AMOUNTS</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{[100,200,500,1000,2000,5000].map(a=><div key={a} onClick={()=>setSAmt(String(a))} style={{padding:'6px 12px',borderRadius:8,background:sAmt===String(a)?'rgba(0,255,65,.15)':'var(--bg3)',border:'1px solid '+(sAmt===String(a)?'var(--bb)':'var(--b)'),color:sAmt===String(a)?'var(--g)':'var(--td)',fontSize:11,fontFamily:'var(--mono)',cursor:'pointer',fontWeight:700}}>₹{a}</div>)}</div>
      </div>
      <Btn v="primary" disabled={!sAmt||!sTo} onClick={()=>toast('💸 ₹'+sAmt+' sent to '+sTo+' via CUTPay!')}>💸 SEND ₹{sAmt||'0'}</Btn>
    </div></div>
  );

  if(screen==='fd') return(
    <div className="fu"><BackBar title="Fixed Deposit · CUTPay" onBack={()=>setScreen('accounts')}/>
    <div style={{display:'flex',flexDirection:'column',gap:12,padding:14}}>
      <div style={{background:'linear-gradient(135deg,rgba(255,215,0,.1),rgba(255,215,0,.03))',border:'1px solid rgba(255,215,0,.3)',borderRadius:14,padding:14}}>
        <div style={{display:'flex',gap:10}}><span style={{fontSize:28}}>🔒</span><div><div style={{fontSize:14,fontWeight:800,color:'var(--gold)'}}>Fixed Deposit</div><div style={{fontSize:11,color:'var(--td)'}}>Up to 8.2% p.a. · Auto-renewal · Loan against FD</div></div></div>
      </div>
      <Input label="Deposit Amount ₹ (min ₹1,000)" placeholder="Min ₹1,000" value={fdAmt} onChange={e=>setFdAmt(e.target.value.replace(/\D/g,''))} suffix="₹"/>
      <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:12,padding:12}}>
        <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:8}}>TENURE</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{Object.entries(FDR).map(([t,r])=><div key={t} onClick={()=>setFdT(+t)} style={{padding:'7px 12px',borderRadius:9,background:fdT===+t?'rgba(255,215,0,.15)':'var(--bg3)',border:'1px solid '+(fdT===+t?'rgba(255,215,0,.4)':'var(--b)'),color:fdT===+t?'var(--gold)':'var(--td)',fontSize:11,fontFamily:'var(--mono)',cursor:'pointer',fontWeight:700}}>{t}m · {r}%</div>)}</div>
      </div>
      {fdAmt&&<div style={{background:'linear-gradient(135deg,rgba(255,215,0,.08),transparent)',border:'1px solid rgba(255,215,0,.3)',borderRadius:14,padding:16}}>
        {[['Principal','₹'+(+fdAmt).toLocaleString(),'var(--text)'],['Interest','₹'+(+fdI).toLocaleString(),'var(--gold)'],['Maturity','₹'+(+fdM2).toLocaleString(),'var(--g)']].map(([k,v,c])=>(
          <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--b)'}}><span style={{fontSize:12}}>{k}</span><span style={{fontSize:13,color:c,fontFamily:'var(--mono)',fontWeight:700}}>{v}</span></div>
        ))}
      </div>}
      <Btn v="gold" disabled={!fdAmt||+fdAmt<1000} onClick={()=>toast('🔒 FD ₹'+fdAmt+' for '+fdT+' months at '+FDR[fdT]+'% p.a.!')}>🔒 OPEN FIXED DEPOSIT</Btn>
    </div></div>
  );

  if(screen==='rd') return(
    <div className="fu"><BackBar title="Recurring Deposit · CUTPay" onBack={()=>setScreen('accounts')}/>
    <div style={{display:'flex',flexDirection:'column',gap:12,padding:14}}>
      <div style={{background:'linear-gradient(135deg,rgba(255,122,0,.1),rgba(255,122,0,.03))',border:'1px solid rgba(255,122,0,.3)',borderRadius:14,padding:14}}>
        <div style={{display:'flex',gap:10}}><span style={{fontSize:28}}>📅</span><div><div style={{fontSize:14,fontWeight:800,color:'var(--orange)'}}>Recurring Deposit</div><div style={{fontSize:11,color:'var(--td)'}}>7.5% p.a. · Auto-debit · Min ₹100/month</div></div></div>
      </div>
      <Input label="Monthly Amount ₹" placeholder="Min ₹100" value={rdAmt} onChange={e=>setRdAmt(e.target.value.replace(/\D/g,''))} suffix="₹"/>
      <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:12,padding:12}}>
        <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:8}}>DURATION</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{[6,12,24,36,48,60].map(m=><div key={m} onClick={()=>setRdM(m)} style={{padding:'7px 12px',borderRadius:9,background:rdM===m?'rgba(255,122,0,.15)':'var(--bg3)',border:'1px solid '+(rdM===m?'rgba(255,122,0,.4)':'var(--b)'),color:rdM===m?'var(--orange)':'var(--td)',fontSize:11,fontFamily:'var(--mono)',cursor:'pointer',fontWeight:700}}>{m} months</div>)}</div>
      </div>
      {rdAmt&&<div style={{background:'linear-gradient(135deg,rgba(255,122,0,.06),transparent)',border:'1px solid rgba(255,122,0,.25)',borderRadius:14,padding:14}}>
        {[['Total Invested','₹'+(+rdAmt*+rdM).toLocaleString(),'var(--text)'],['Interest','₹'+(+rdI).toLocaleString(),'var(--orange)'],['Maturity','₹'+(+rdM2).toLocaleString(),'var(--g)']].map(([k,v,c])=>(
          <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--b)'}}><span style={{fontSize:12}}>{k}</span><span style={{fontSize:13,color:c,fontFamily:'var(--mono)',fontWeight:700}}>{v}</span></div>
        ))}
      </div>}
      <Btn v="outline" disabled={!rdAmt||+rdAmt<100} style={{borderColor:'var(--orange)',color:'var(--orange)'}} onClick={()=>toast('📅 RD ₹'+rdAmt+'/month for '+rdM+' months started!')}>📅 START RECURRING DEPOSIT</Btn>
    </div></div>
  );

  if(screen==='loans') return(
    <div className="fu"><BackBar title="Loans · CUTPay" onBack={()=>setScreen('home')}/>
    <div style={{display:'flex',flexDirection:'column',gap:12,padding:14}}>
      <div style={{background:'linear-gradient(135deg,rgba(0,229,255,.08),rgba(0,229,255,.02))',border:'1px solid rgba(0,229,255,.25)',borderRadius:14,padding:14}}>
        <div style={{fontSize:14,fontWeight:800,color:'var(--cyan)',marginBottom:4}}>⚡ Instant Loan Approval</div>
        <div style={{fontSize:11,color:'var(--td)'}}>KYC linked · Disburse in 2h · CUTBAR credit score</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {LOANS.map(l=><div key={l.id} onClick={()=>setLType(l.id)} style={{padding:10,borderRadius:10,background:lType===l.id?'rgba(0,229,255,.12)':'var(--panel)',border:'1px solid '+(lType===l.id?'rgba(0,229,255,.35)':'var(--b)'),cursor:'pointer',textAlign:'center'}}>
          <div style={{fontSize:20,marginBottom:4}}>{l.icon}</div>
          <div style={{fontSize:10,fontWeight:700,color:lType===l.id?'var(--cyan)':'var(--text)'}}>{l.lbl}</div>
          <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)'}}>{l.r}% · {l.t}mo</div>
        </div>)}
      </div>
      <Input label="Loan Amount ₹" placeholder="Enter amount" value={lAmt} onChange={e=>setLAmt(e.target.value.replace(/\D/g,''))} suffix="₹"/>
      {lAmt&&<div style={{background:'linear-gradient(135deg,rgba(0,229,255,.06),transparent)',border:'1px solid rgba(0,229,255,.2)',borderRadius:12,padding:14}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:12}}>Monthly EMI</span><span style={{fontSize:16,color:'var(--cyan)',fontFamily:'var(--mono)',fontWeight:800}}>₹{(+emi).toLocaleString()}</span></div>
        <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:11,color:'var(--td)'}}>Rate · Tenure</span><span style={{fontSize:11,fontFamily:'var(--mono)'}}>{sl.r}% · {sl.t} months</span></div>
      </div>}
      <Btn v="cyan" disabled={!lAmt} onClick={()=>toast('⚡ Loan applied! ₹'+lAmt+' '+sl.lbl+' at '+sl.r+'%')}>⚡ APPLY NOW — INSTANT APPROVAL</Btn>
    </div></div>
  );

  if(screen==='insurance') return(
    <div className="fu"><BackBar title="Insurance · CUTPay" onBack={()=>setScreen('home')}/>
    <div style={{margin:'6px 14px 12px',background:'linear-gradient(135deg,rgba(153,69,255,.1),rgba(153,69,255,.02))',border:'1px solid rgba(153,69,255,.3)',borderRadius:14,padding:14}}>
      <div style={{fontSize:13,fontWeight:800,color:'#9945ff',marginBottom:4}}>🛡️ CUTPay Insurance</div>
      <div style={{fontSize:11,color:'var(--td)'}}>Instant cover · Digital policy · Claims in 24h</div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,margin:'0 14px 14px'}}>
      {INS.map(ins=><div key={ins.n} onClick={()=>toast('🛡️ '+ins.n+' '+ins.p+' — Getting quote...')} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:12,cursor:'pointer',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,right:0,width:36,height:36,background:ins.c+'10',borderRadius:'0 14px 0 40px'}}/>
        <div style={{fontSize:24,marginBottom:5}}>{ins.icon}</div>
        <div style={{fontSize:12,fontWeight:800,marginBottom:2}}>{ins.n}</div>
        <div style={{fontSize:10,color:'var(--td)',marginBottom:5}}>{ins.sub}</div>
        <Bx color="green" style={{fontSize:8}}>from {ins.p}</Bx>
      </div>)}
    </div></div>
  );

  if(screen==='accounts') return(
    <div className="fu"><BackBar title="Bank Accounts · CUTPay" onBack={()=>setScreen('home')}/>
    <div style={{display:'flex',flexDirection:'column',gap:10,padding:14}}>
      {[{id:'fd',icon:'🔒',n:'Fixed Deposit',d:'Up to 8.2% p.a. · Auto-renewal · Loan against FD',rate:'8.2%',c:'#ffd700'},{id:'rd',icon:'📅',n:'Recurring Deposit',d:'Save monthly · 7.5% p.a. · Auto-debit · Goal-based',rate:'7.5%',c:'#ff7a00'},{id:'sav',icon:'💰',n:'Savings Account',d:'Zero balance · 4% p.a. · Free UPI · 500 CUTBAR bonus',rate:'4%',c:'#00ff41'},{id:'cur',icon:'🏢',n:'Current Account',d:'Business banking · Overdraft · GST billing · API access',rate:'Business',c:'#00e5ff'}].map(ac=>(
        <div key={ac.id} onClick={()=>{if(ac.id==='fd')setScreen('fd');else if(ac.id==='rd')setScreen('rd');else toast('→ '+ac.n+' — open from Bank page');}}
          style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:14,cursor:'pointer',position:'relative',overflow:'hidden'}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=ac.c+'55'}
          onMouseLeave={e=>e.currentTarget.style.borderColor='var(--b)'}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 5% 50%,'+ac.c+'10,transparent 50%)',pointerEvents:'none'}}/>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              <div style={{width:46,height:46,borderRadius:12,background:ac.c+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,border:'1px solid '+ac.c+'28',flexShrink:0}}>{ac.icon}</div>
              <div><div style={{display:'flex',gap:8,alignItems:'center',marginBottom:3}}><span style={{fontSize:14,fontWeight:800}}>{ac.n}</span><Bx color="green" style={{fontSize:8,background:ac.c+'15',color:ac.c,borderColor:ac.c+'30'}}>{ac.rate}</Bx></div><div style={{fontSize:11,color:'var(--td)'}}>{ac.d}</div></div>
            </div>
            <span style={{fontSize:18,color:'var(--td)'}}>›</span>
          </div>
        </div>
      ))}
    </div></div>
  );

  // HOME
  return(
    <div className="fu">
      <BackBar title="CUTPay 💳" onBack={onBack} right={<Bx color="cyan" style={{fontSize:9}}>CUTBAR FINANCE</Bx>}/>
      <div style={{margin:'6px 14px 12px',background:'linear-gradient(135deg,#050f28,#020a14)',border:'1px solid rgba(0,229,255,.3)',borderRadius:18,padding:18,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 80% 20%,rgba(0,229,255,.12),transparent 60%)',pointerEvents:'none'}}/>
        <div style={{fontSize:9,color:'rgba(0,229,255,.6)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:6}}>SAVINGS · CUTBAR FINANCE</div>
        <div style={{fontSize:26,color:'var(--g)',fontFamily:'var(--display)',fontWeight:800,letterSpacing:.5,marginBottom:2}}>₹12,450.00</div>
        <div style={{fontSize:11,color:'rgba(0,229,255,.7)',marginBottom:12}}>user@cutbar · KYC Verified ✓</div>
        <div style={{display:'flex',gap:6,marginBottom:14}}><Bx color="cyan">✓ UPI</Bx><Bx color="green">₹50K/day</Bx><Bx color="gold">4% interest</Bx></div>
        <div style={{display:'flex',gap:8}}>
          {[['📤','Send',()=>setScreen('send')],['📲','Scan QR',()=>setScreen('qr')],['📊','History',()=>toast('📊 History')]].map(([ic,lb,fn])=>(
            <div key={lb} onClick={fn} style={{flex:1,background:'rgba(0,229,255,.08)',border:'1px solid rgba(0,229,255,.18)',borderRadius:10,padding:'10px 6px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
              <span style={{fontSize:18}}>{ic}</span><span style={{fontSize:10,fontWeight:700,color:'var(--cyan)'}}>{lb}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',padding:'0 16px 8px',letterSpacing:3}}>CUTPAY SERVICES</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,margin:'0 14px 12px'}}>
        {[{icon:'📤',lbl:'Send Money',sub:'UPI · IMPS · RTGS',c:'#00e5ff',fn:()=>setScreen('send')},{icon:'📲',lbl:'Scan & Pay',sub:'Any UPI QR code',c:'#00ff41',fn:()=>setScreen('qr')},{icon:'🏦',lbl:'Bank Accounts',sub:'Savings · Current · FD · RD',c:'#ffd700',fn:()=>setScreen('accounts')},{icon:'⚡',lbl:'Instant Loans',sub:'2-Wheeler to Home',c:'#ff7a00',fn:()=>setScreen('loans')},{icon:'🛡️',lbl:'Insurance',sub:'Vehicle · Life · Health',c:'#9945ff',fn:()=>setScreen('insurance')},{icon:'💹',lbl:'Investments',sub:'Mutual Funds · SIP · Gold',c:'#ff3b5c',fn:()=>toast('💹 Coming Phase 4')},{icon:'🧾',lbl:'Bill Payments',sub:'Electric · Mobile · DTH',c:'#00cc88',fn:()=>toast('🧾 Launching soon')},{icon:'🌍',lbl:'Forex',sub:'International transfers',c:'#00e5ff',fn:()=>toast('🌍 Phase 4')}].map(it=>(
          <div key={it.lbl} onClick={it.fn} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:'13px 11px',cursor:'pointer',position:'relative',overflow:'hidden'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=it.c+'55'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='var(--b)'}>
            <div style={{position:'absolute',top:0,right:0,width:34,height:34,background:it.c+'10',borderRadius:'0 14px 0 100%'}}/>
            <div style={{fontSize:22,marginBottom:5}}>{it.icon}</div>
            <div style={{fontSize:12,fontWeight:800,marginBottom:2}}>{it.lbl}</div>
            <div style={{fontSize:10,color:'var(--td)'}}>{it.sub}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',padding:'0 16px 8px',letterSpacing:3}}>RECENT TRANSACTIONS</div>
      <div style={{margin:'0 14px 20px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,overflow:'hidden'}}>
        {[{icon:'🏍️',n:'2-Wheeler Insurance',s:'CUTPay Insurance',a:'-₹1,299',c:'var(--red)',d:'Today'},{icon:'📥',n:'Received from VeerBhat',s:'UPI · user@cutbar',a:'+₹5,000',c:'var(--g)',d:'Yesterday'},{icon:'🔒',n:'FD Interest Credit',s:'CUTBAR Bank FD',a:'+₹312',c:'var(--gold)',d:'15 Mar'},{icon:'📤',n:'Sent to PhonePe',s:'9876543210@ybl',a:'-₹2,000',c:'var(--red)',d:'14 Mar'}].map((tx,i,arr)=>(
          <div key={i}>
            {i>0&&<div style={{height:1,background:'var(--b)',margin:'0 12px'}}/>}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 12px'}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <div style={{width:36,height:36,borderRadius:10,background:'var(--panel2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{tx.icon}</div>
                <div><div style={{fontSize:12,fontWeight:700}}>{tx.n}</div><div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>{tx.s}</div></div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:13,color:tx.c,fontFamily:'var(--mono)',fontWeight:700}}>{tx.a}</div>
                <div style={{fontSize:9,color:'var(--td)'}}>{tx.d}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
