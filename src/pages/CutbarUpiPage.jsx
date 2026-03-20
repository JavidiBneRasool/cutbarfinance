import { useState } from 'react';
import { BackBar, Btn, Input, Bx } from '../components/primitives';

export default function CutbarUpiPage({ toast, onBack }) {
  const [screen,  setScreen]  = useState('home');
  const [upiAmt,  setUpiAmt]  = useState('');
  const [upiTo,   setUpiTo]   = useState('');
  const [upiBank, setUpiBank] = useState('');

  const UPI_SERVICES = [
    {icon:()=><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="#1a1a2e"/><rect x="6" y="8" width="20" height="16" rx="3" stroke="#00e5ff" strokeWidth="1.5" fill="none"/><path d="M6 13h20" stroke="#00e5ff" strokeWidth="1.5"/><rect x="9" y="17" width="5" height="3" rx="1" fill="#00e5ff"/></svg>, label:'Link Bank Account', sub:'Add your bank to CUTBAR UPI', fn:()=>setScreen('link_bank')},
    {icon:()=><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="#1a1a2e"/><circle cx="16" cy="16" r="8" stroke="#00ff41" strokeWidth="1.5" fill="none"/><text x="16" y="20" textAnchor="middle" fontSize="10" fill="#00ff41" fontWeight="bold">@</text></svg>, label:'Create UPI ID', sub:'user@cutbar — set your UPI handle', fn:()=>setScreen('create_upi')},
    {icon:()=><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="#1a1a2e"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="#ffd700" strokeWidth="1.5" fill="none"/><rect x="17" y="9" width="6" height="6" rx="1" stroke="#ffd700" strokeWidth="1.5" fill="none"/><rect x="9" y="17" width="6" height="6" rx="1" stroke="#ffd700" strokeWidth="1.5" fill="none"/><rect x="19" y="19" width="4" height="4" rx="0.5" fill="#ffd700"/></svg>, label:'Scan Any QR', sub:'GPay · PhonePe · Paytm · All UPI', fn:()=>setScreen('scan_qr')},
    {icon:()=><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="#1a1a2e"/><circle cx="16" cy="13" r="5" stroke="#ff7a00" strokeWidth="1.5" fill="none"/><path d="M9 26c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#ff7a00" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>, label:'Send to Mobile', sub:'Pay anyone by phone number', fn:()=>setScreen('send_mobile')},
    {icon:()=><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="#1a1a2e"/><path d="M10 16h12M16 10l6 6-6 6" stroke="#9945ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, label:'Send to UPI ID', sub:'Transfer to any UPI address', fn:()=>setScreen('send_upi')},
    {icon:()=><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="#1a1a2e"/><rect x="7" y="11" width="18" height="12" rx="2" stroke="#00cc88" strokeWidth="1.5" fill="none"/><path d="M11 16h10M11 19h6" stroke="#00cc88" strokeWidth="1.5" strokeLinecap="round"/></svg>, label:'Send to Bank', sub:'NEFT · IMPS · RTGS · Self transfer', fn:()=>setScreen('send_bank')},
  ];

  if(screen==='scan_qr') return(
    <div className="fu"><BackBar title="Scan & Pay" onBack={()=>setScreen('home')}/>
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:24}}>
      <div style={{background:'white',borderRadius:20,padding:20,marginBottom:20,boxShadow:'0 0 40px rgba(0,255,65,.3)'}}>
        <svg width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="white"/>{[0,1,2,3,4,5,6].map(r=>[0,1,2,3,4,5,6].map(c=><rect key={r+'-'+c} x={12+c*26} y={12+r*26} width={22} height={22} fill={(r<3&&c<3)||(r<3&&c>3)||(r>3&&c<3)?'#00a028':'#111'} rx={3}/>))}<text x="100" y="190" textAnchor="middle" fontSize="10" fill="#00a028" fontFamily="monospace" fontWeight="bold">user@cutbar</text></svg>
      </div>
      <div style={{fontSize:18,fontWeight:800,color:'var(--g)',fontFamily:'var(--display)',letterSpacing:.5,marginBottom:4}}>user@cutbar</div>
      <div style={{fontSize:12,color:'var(--td)',marginBottom:16}}>Scan with any UPI app</div>
      <div style={{display:'flex',gap:8,marginBottom:20}}>{['GPay','PhonePe','Paytm','BHIM','Any UPI'].map(a=><Bx key={a} color="green">{a}</Bx>)}</div>
      <div style={{width:'100%',background:'var(--panel)',border:'1px solid var(--bb)',borderRadius:14,padding:14}}>
        <Input label="Request specific amount (optional)" placeholder="₹0.00" value={upiAmt} onChange={e=>setUpiAmt(e.target.value.replace(/\D/g,''))} suffix="₹" style={{marginBottom:10}}/>
        <Btn v="primary" onClick={()=>toast('📤 QR link copied to clipboard!')}>📤 Share QR Link</Btn>
      </div>
    </div></div>
  );

  // Reusable send form
  const SendForm=({title,placeholder})=>(
    <div className="fu"><BackBar title={title} onBack={()=>setScreen('home')}/>
    <div style={{display:'flex',flexDirection:'column',gap:12,padding:14}}>
      <div style={{background:'linear-gradient(135deg,rgba(0,255,65,.08),rgba(0,229,255,.04))',border:'1px solid var(--bb)',borderRadius:14,padding:14}}>
        <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>LINKED BALANCE</span><span style={{fontSize:13,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700}}>₹12,450.00</span></div>
      </div>
      <Input label={placeholder} placeholder={placeholder} value={upiTo} onChange={e=>setUpiTo(e.target.value)}/>
      <Input label="Amount ₹" placeholder="0.00" value={upiAmt} onChange={e=>setUpiAmt(e.target.value.replace(/\D/g,''))} suffix="₹"/>
      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{[100,200,500,1000,2000,5000].map(a=><div key={a} onClick={()=>setUpiAmt(String(a))} style={{padding:'6px 12px',borderRadius:8,background:upiAmt===String(a)?'rgba(0,255,65,.15)':'var(--bg3)',border:'1px solid '+(upiAmt===String(a)?'var(--bb)':'var(--b)'),color:upiAmt===String(a)?'var(--g)':'var(--td)',fontSize:11,fontFamily:'var(--mono)',cursor:'pointer',fontWeight:700}}>₹{a}</div>)}</div>
      <Btn v="primary" disabled={!upiAmt||!upiTo} onClick={()=>{toast('💸 ₹'+upiAmt+' sent to '+upiTo+' via CUTBAR UPI!');setScreen('home');}}>💸 PAY ₹{upiAmt||'0'}</Btn>
    </div></div>
  );

  if(screen==='send_mobile') return <SendForm title="Send to Mobile Number" placeholder="Enter 10-digit mobile number"/>;
  if(screen==='send_upi')    return <SendForm title="Send to UPI ID" placeholder="Enter UPI ID (eg: name@upi)"/>;

  if(screen==='send_bank') return(
    <div className="fu"><BackBar title="Send to Bank Account" onBack={()=>setScreen('home')}/>
    <div style={{display:'flex',flexDirection:'column',gap:12,padding:14}}>
      <Input label="Account Number" placeholder="Enter bank account number" value={upiTo} onChange={e=>setUpiTo(e.target.value)}/>
      <Input label="IFSC Code" placeholder="e.g. SBIN0001234" value={upiBank} onChange={e=>setUpiBank(e.target.value.toUpperCase())}/>
      <Input label="Amount ₹" placeholder="0.00" value={upiAmt} onChange={e=>setUpiAmt(e.target.value.replace(/\D/g,''))} suffix="₹"/>
      <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:10,padding:12}}>
        <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:6}}>TRANSFER MODE</div>
        <div style={{display:'flex',gap:6}}>{['IMPS (Instant)','NEFT','RTGS'].map(m=><div key={m} style={{flex:1,padding:'7px',textAlign:'center',borderRadius:8,background:'var(--bg3)',border:'1px solid var(--b)',fontSize:10,color:'var(--td)',cursor:'pointer',fontFamily:'var(--mono)'}}>{m}</div>)}</div>
      </div>
      <Btn v="primary" disabled={!upiAmt||!upiTo} onClick={()=>{toast('🏦 ₹'+upiAmt+' sent to bank account via IMPS!');setScreen('home');}}>🏦 SEND TO BANK</Btn>
    </div></div>
  );

  if(screen==='link_bank') return(
    <div className="fu"><BackBar title="Link Bank Account" onBack={()=>setScreen('home')}/>
    <div style={{display:'flex',flexDirection:'column',gap:10,padding:14}}>
      <div style={{background:'linear-gradient(135deg,rgba(0,255,65,.08),rgba(0,255,65,.02))',border:'1px solid var(--bb)',borderRadius:14,padding:14}}>
        <div style={{fontSize:14,fontWeight:800,color:'var(--g)',marginBottom:4}}>Link Your Bank</div>
        <div style={{fontSize:11,color:'var(--td)'}}>Connect any Indian bank to your CUTBAR UPI ID</div>
      </div>
      {['SBI','HDFC','ICICI','Axis','Kotak','PNB','BOB','Canara','IDFC','Yes Bank'].map(b=>(
        <div key={b} onClick={()=>toast('🏦 '+b+' linking initiated — verify via netbanking or debit card')} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:11,cursor:'pointer'}}>
          <span style={{fontSize:13,fontWeight:700}}>{b}</span>
          <span style={{fontSize:12,color:'var(--g)'}}>Link →</span>
        </div>
      ))}
    </div></div>
  );

  if(screen==='create_upi') return(
    <div className="fu"><BackBar title="Create UPI ID" onBack={()=>setScreen('home')}/>
    <div style={{display:'flex',flexDirection:'column',gap:12,padding:14}}>
      <div style={{background:'var(--panel)',border:'1px solid var(--bb)',borderRadius:14,padding:16,textAlign:'center'}}>
        <div style={{fontSize:32,fontWeight:800,color:'var(--g)',fontFamily:'var(--display)',letterSpacing:.5,marginBottom:4}}>user@cutbar</div>
        <div style={{fontSize:11,color:'var(--td)'}}>Your CUTBAR UPI ID · Accepted everywhere</div>
        <div style={{display:'flex',gap:6,justifyContent:'center',marginTop:10}}><Bx color="green">✓ NPCI Registered</Bx><Bx color="cyan">✓ All Banks</Bx></div>
      </div>
      <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:12,padding:14}}>
        <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:8}}>CUSTOMISE YOUR UPI ID</div>
        <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--bg3)',border:'1px solid var(--b)',borderRadius:9,padding:'10px 14px'}}>
          <input style={{flex:1,background:'transparent',border:'none',color:'var(--text)',fontFamily:'var(--mono)',fontSize:14,outline:'none'}} placeholder="yourchoice"/>
          <span style={{fontSize:12,color:'var(--td)',fontFamily:'var(--mono)'}}>@cutbar</span>
        </div>
      </div>
      <Btn v="primary" onClick={()=>toast('✅ UPI ID created! Your ID: user@cutbar')}>✅ CONFIRM UPI ID</Btn>
    </div></div>
  );

  // HOME
  return(
    <div className="fu">
      <BackBar title="CUTBAR UPI 📱" onBack={onBack} right={<Bx color="green" style={{fontSize:9}}>✓ NPCI</Bx>}/>
      <div style={{margin:'6px 14px 16px',background:'linear-gradient(135deg,#050f28,#020a14)',border:'1px solid rgba(0,229,255,.3)',borderRadius:18,padding:20,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 80% 20%,rgba(0,229,255,.12),transparent 60%)',pointerEvents:'none'}}/>
        <div style={{fontSize:9,color:'rgba(0,229,255,.6)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:8}}>UPI MONEY TRANSFER</div>
        <div style={{fontSize:22,fontWeight:800,color:'var(--g)',fontFamily:'var(--display)',letterSpacing:.5,marginBottom:2}}>user@cutbar</div>
        <div style={{fontSize:11,color:'rgba(0,229,255,.7)',marginBottom:14}}>Linked · SBI ₹12,450 · HDFC ₹8,200</div>
        <div style={{display:'flex',gap:6}}><Bx color="cyan">✓ GPay</Bx><Bx color="cyan">✓ PhonePe</Bx><Bx color="cyan">✓ Paytm</Bx><Bx color="green">✓ All UPI</Bx></div>
      </div>
      <div style={{padding:'0 14px 20px'}}>
        <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:14}}>UPI SERVICES</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14}}>
          {UPI_SERVICES.map((s,i)=>(
            <div key={i} onClick={s.fn} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,cursor:'pointer'}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(0,229,255,.08)',border:'1px solid rgba(0,229,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(0,229,255,.15)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(0,229,255,.08)'}>
                {s.icon()}
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:11,fontWeight:700,color:'var(--text)',lineHeight:1.3}}>{s.label}</div>
                <div style={{fontSize:9,color:'var(--td)',marginTop:1}}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:'0 14px 14px'}}>
        <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:10}}>RECENT UPI TRANSACTIONS</div>
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,overflow:'hidden'}}>
          {[{n:'VeerBhat_Pro',u:'veer@sbi',a:'+₹5,000',c:'var(--g)',d:'Today'},{n:'Online Order',u:'merchant@paytm',a:'-₹1,299',c:'var(--red)',d:'Yesterday'},{n:'Self Transfer',u:'user@hdfc',a:'-₹10,000',c:'var(--td)',d:'15 Mar'}].map((t,i)=>(
            <div key={i}>{i>0&&<div style={{height:1,background:'var(--b)',margin:'0 12px'}}/>}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 14px'}}>
                <div style={{display:'flex',gap:10,alignItems:'center'}}>
                  <div style={{width:36,height:36,borderRadius:10,background:'rgba(0,229,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>💸</div>
                  <div><div style={{fontSize:12,fontWeight:700}}>{t.n}</div><div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>{t.u}</div></div>
                </div>
                <div style={{textAlign:'right'}}><div style={{fontSize:13,color:t.c,fontFamily:'var(--mono)',fontWeight:700}}>{t.a}</div><div style={{fontSize:9,color:'var(--td)'}}>{t.d}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
