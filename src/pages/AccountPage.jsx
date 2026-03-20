import { useState, useRef } from 'react';
import { BackBar } from '../components/primitives';

export default function AccountPage({ toast, onBack, theme, setTheme, userProfile, setUserProfile }) {
  const [screen,  setScreen]  = useState('home');
  const [form,    setForm]    = useState({...userProfile});
  const [toggles, setToggles] = useState({notif:true,biometric:true,price_alerts:false,email_notif:true,sms:false,tfa:false});
  const fileRef = useRef(null);
  const up = userProfile || {};

  const Toggle = ({on, onTap}) => (
    <div onClick={onTap} style={{width:46,height:25,borderRadius:12,background:on?'var(--g)':'var(--b)',position:'relative',cursor:'pointer',transition:'background .3s',border:'1px solid var(--bb)',flexShrink:0}}>
      <div style={{position:'absolute',top:3,left:on?21:3,width:17,height:17,borderRadius:'50%',background:on?'#000':'var(--td)',transition:'left .3s'}}/>
    </div>
  );

  const Row = ({ic, lb, sub, fn, right}) => (
    <div onClick={fn} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 14px',cursor:fn?'pointer':'default',transition:'background .15s'}}
      onMouseEnter={e=>fn&&(e.currentTarget.style.background='rgba(0,255,65,.03)')}
      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
      <span style={{fontSize:20,width:28,textAlign:'center',flexShrink:0}}>{ic}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>{lb}</div>
        {sub&&<div style={{fontSize:11,color:'var(--td)'}}>{sub}</div>}
      </div>
      {right||<span style={{fontSize:16,color:'var(--td)',flexShrink:0}}>›</span>}
    </div>
  );

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5*1024*1024) { toast('⚠️ Max photo size is 5MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => { setUserProfile(p => ({...p, avatar:ev.target.result})); toast('✅ Profile photo updated!'); };
    reader.readAsDataURL(file);
  };

  // ── SECURITY ──
  if (screen === 'security') return (
    <div className="fu">
      <BackBar title="Security" onBack={()=>setScreen('home')}/>
      <div style={{display:'flex',flexDirection:'column',gap:10,padding:'0 14px 24px'}}>
        <div style={{background:'rgba(0,255,65,.05)',border:'1px solid rgba(0,255,65,.15)',borderRadius:12,padding:'12px 14px',display:'flex',gap:10,alignItems:'center',marginBottom:2}}>
          <span style={{fontSize:22}}>🛡️</span>
          <div><div style={{fontSize:13,fontWeight:700,color:'var(--g)'}}>Security Score: Strong</div><div style={{fontSize:11,color:'var(--td)'}}>Enable 2FA for maximum protection</div></div>
        </div>
        {[{k:'biometric',ic:'🔐',lb:'Biometric Lock',sub:'Fingerprint / Face ID to open app'},{k:'tfa',ic:'🛡️',lb:'Two-Factor Auth (2FA)',sub:'Required for withdrawals over ₹10,000'}].map(s=>(
          <div key={s.k} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,padding:'13px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <div style={{display:'flex',gap:10,alignItems:'center',flex:1}}>
              <span style={{fontSize:20,flexShrink:0}}>{s.ic}</span>
              <div><div style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>{s.lb}</div><div style={{fontSize:11,color:'var(--td)'}}>{s.sub}</div></div>
            </div>
            <Toggle on={toggles[s.k]} onTap={()=>setToggles(p=>({...p,[s.k]:!p[s.k]}))}/>
          </div>
        ))}
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,overflow:'hidden'}}>
          {[
            {ic:'🔑',lb:'Change Password',sub:'Last changed: Never',fn:()=>toast('🔑 Password reset link sent to email')},
            {ic:'📱',lb:'Authenticator App',sub:'Google/Microsoft Authenticator',fn:()=>toast('📲 Scan QR code with your authenticator app')},
            {ic:'🔑',lb:'Passkey / WebAuthn',sub:'Login without password',fn:()=>toast('🔑 Passkey setup initiated')},
            {ic:'📋',lb:'Active Sessions',sub:'View all logged-in devices',fn:()=>toast('📋 2 active sessions found')},
            {ic:'🚨',lb:'Revoke All Sessions',sub:'Force logout everywhere',fn:()=>toast('⚠️ All sessions revoked')},
          ].map((it,i,arr)=>(
            <div key={it.lb}>{i>0&&<div style={{height:1,background:'var(--b)',margin:'0 14px'}}/>}<Row ic={it.ic} lb={it.lb} sub={it.sub} fn={it.fn}/></div>
          ))}
        </div>
        <div style={{background:'rgba(255,59,92,.05)',border:'1px solid rgba(255,59,92,.15)',borderRadius:13,overflow:'hidden'}}>
          <Row ic="🗝️" lb="Login History" sub="Last 30 days of sign-in activity" fn={()=>toast('📋 Login history: 3 events')}/>
        </div>
      </div>
    </div>
  );

  // ── NOTIFICATIONS ──
  if (screen === 'notifications') return (
    <div className="fu">
      <BackBar title="Notifications" onBack={()=>setScreen('home')}/>
      <div style={{display:'flex',flexDirection:'column',gap:10,padding:'0 14px 24px'}}>
        {[{k:'notif',ic:'🔔',lb:'Push Notifications',sub:'Price alerts, trade fills, live game results'},{k:'email_notif',ic:'📧',lb:'Email Notifications',sub:'Monthly reports, security alerts, newsletters'},{k:'sms',ic:'📱',lb:'SMS Alerts',sub:'OTP, critical security alerts only'},{k:'price_alerts',ic:'📊',lb:'Price Alerts',sub:'Custom trigger: BTC crosses $70K, etc.'}].map(s=>(
          <div key={s.k} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,padding:'13px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <div style={{display:'flex',gap:10,alignItems:'center',flex:1}}>
              <span style={{fontSize:20,flexShrink:0}}>{s.ic}</span>
              <div><div style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>{s.lb}</div><div style={{fontSize:11,color:'var(--td)'}}>{s.sub}</div></div>
            </div>
            <Toggle on={toggles[s.k]} onTap={()=>setToggles(p=>({...p,[s.k]:!p[s.k]}))}/>
          </div>
        ))}
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,overflow:'hidden'}}>
          <Row ic="⏰" lb="Quiet Hours" sub="No notifications 11 PM – 7 AM" fn={()=>toast('⏰ Quiet hours configured')}/>
          <div style={{height:1,background:'var(--b)',margin:'0 14px'}}/>
          <Row ic="🏷️" lb="Notification Categories" sub="Manage by type: trades, games, news" fn={()=>toast('🏷️ Category settings opened')}/>
        </div>
      </div>
    </div>
  );

  // ── KYC VERIFICATION ──
  if (screen === 'verification') return (
    <div className="fu">
      <BackBar title="Identity & KYC" onBack={()=>setScreen('home')}/>
      <div style={{display:'flex',flexDirection:'column',gap:10,padding:'0 14px 24px'}}>
        <div style={{background:'rgba(0,255,65,.08)',border:'1px solid rgba(0,255,65,.25)',borderRadius:13,padding:14,display:'flex',gap:12,alignItems:'center'}}>
          <span style={{fontSize:32}}>✅</span>
          <div><div style={{fontSize:15,fontWeight:800,color:'var(--g)'}}>Identity Verified</div><div style={{fontSize:11,color:'var(--td)'}}>KYC Level 2 · Full access · All features unlocked</div></div>
        </div>
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,overflow:'hidden'}}>
          {[{lb:'Email',val:up.email||'—',verified:true},{lb:'Phone',val:up.phone||'—',verified:true},{lb:'Aadhaar KYC',val:'XXXX XXXX 4321',verified:true},{lb:'PAN Card',val:'ABCDE1234F',verified:true},{lb:'Address',val:'Verified via bank statement',verified:true},{lb:'Face ID',val:'Liveness check passed',verified:true}].map((v,i,arr)=>(
            <div key={v.lb}>
              {i>0&&<div style={{height:1,background:'var(--b)',margin:'0 14px'}}/>}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 14px'}}>
                <div><div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:2}}>{v.lb}</div><div style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{v.val}</div></div>
                <span style={{fontSize:10,color:v.verified?'var(--g)':'var(--orange)',background:v.verified?'rgba(0,255,65,.1)':'rgba(255,122,0,.1)',padding:'3px 8px',borderRadius:20,fontFamily:'var(--mono)',fontWeight:700,border:`1px solid ${v.verified?'rgba(0,255,65,.2)':'rgba(255,122,0,.2)'}`}}>{v.verified?'✓ Done':'Pending'}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,padding:'12px 14px'}}>
          <div style={{fontSize:11,color:'var(--td)',marginBottom:8}}>Withdrawal Limits</div>
          {[['Daily Crypto','$10,000'],['Daily Fiat','₹50,000'],['Monthly','₹5,00,000'],['P2P','Unlimited']].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'4px 0'}}>
              <span style={{fontSize:12,color:'var(--td)',fontFamily:'var(--mono)'}}>{k}</span>
              <span style={{fontSize:12,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={()=>toast('🆙 Upgrade to Level 3 — coming soon')} style={{padding:'12px',borderRadius:11,border:'1px solid var(--bb)',background:'rgba(0,255,65,.08)',color:'var(--g)',fontFamily:'var(--display)',fontSize:13,fontWeight:700,cursor:'pointer',width:'100%'}}>Upgrade to Level 3 →</button>
      </div>
    </div>
  );

  // ── PREFERENCES ──
  if (screen === 'preferences') return (
    <div className="fu">
      <BackBar title="Preferences" onBack={()=>setScreen('home')}/>
      <div style={{display:'flex',flexDirection:'column',gap:10,padding:'0 14px 24px'}}>
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,overflow:'hidden'}}>
          <div style={{padding:'13px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid var(--b)'}}>
            <div style={{display:'flex',gap:10,alignItems:'center'}}><span style={{fontSize:20}}>{theme==='dark'?'🌙':'☀️'}</span><div><div style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>{theme==='dark'?'Dark':'Light'} Mode</div><div style={{fontSize:11,color:'var(--td)'}}>Tap to switch</div></div></div>
            <Toggle on={theme==='dark'} onTap={()=>setTheme(t=>t==='dark'?'light':'dark')}/>
          </div>
          {[{ic:'💱',lb:'Display Currency',sub:'USD / INR / EUR / GBP',val:up.currency||'USD',fn:()=>toast('💱 Currency picker — USD selected')},{ic:'🌍',lb:'Language',sub:'English · اردو · हिन्दी · العربية',val:up.language||'EN',fn:()=>toast('🌍 Language picker — EN selected')},{ic:'📊',lb:'Default Chart',sub:'TradingView theme and interval',val:'1D',fn:()=>toast('📊 Chart preference saved')},{ic:'👁️',lb:'Portfolio Privacy',sub:'Hide balances on home screen',toggle:true,tOn:up.portfolioPrivate,fn:()=>setUserProfile(p=>({...p,portfolioPrivate:!p.portfolioPrivate}))}].map((it,i)=>(
            <div key={it.lb} style={{borderBottom:i<3?'1px solid var(--b)':'none'}}>
              <div onClick={it.fn} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 14px',cursor:'pointer'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(0,255,65,.03)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <span style={{fontSize:20,width:28,textAlign:'center',flexShrink:0}}>{it.ic}</span>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>{it.lb}</div><div style={{fontSize:11,color:'var(--td)'}}>{it.sub}</div></div>
                {it.toggle?<Toggle on={it.tOn} onTap={it.fn}/>:<span style={{fontSize:11,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700,marginRight:4}}>{it.val} ›</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── REFERRAL ──
  if (screen === 'referral') return (
    <div className="fu">
      <BackBar title="Refer & Earn" onBack={()=>setScreen('home')}/>
      <div style={{display:'flex',flexDirection:'column',gap:12,padding:'0 14px 24px'}}>
        <div style={{background:'linear-gradient(135deg,rgba(0,255,65,.1),rgba(0,229,255,.05))',border:'1px solid var(--bb)',borderRadius:16,padding:20,textAlign:'center'}}>
          <div style={{fontSize:40,marginBottom:10}}>🎁</div>
          <div style={{fontSize:20,fontWeight:800,color:'var(--g)',marginBottom:4}}>Refer & Earn 500 CUTBAR</div>
          <div style={{fontSize:12,color:'var(--td)',lineHeight:1.7,marginBottom:16}}>Invite friends to CUTBAR. Both you and your friend earn 500 CUTBAR tokens when they complete KYC.</div>
          <div style={{background:'var(--bg3)',border:'1px solid var(--bb)',borderRadius:10,padding:'12px 16px',marginBottom:12,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:16,fontWeight:800,color:'var(--g)',fontFamily:'var(--mono)',letterSpacing:1}}>{up.referralCode||'CUTBAR-USER'}</span>
            <button onClick={()=>toast('📋 Referral code copied!')} style={{padding:'6px 12px',borderRadius:8,background:'var(--g)',color:'#000',border:'none',cursor:'pointer',fontSize:11,fontWeight:700}}>Copy</button>
          </div>
          <button onClick={()=>toast('📤 Share link copied!')} style={{padding:'12px 24px',borderRadius:11,background:'linear-gradient(135deg,var(--g2),var(--g))',color:'#000',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,width:'100%'}}>📤 Share Referral Link</button>
        </div>
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,padding:'14px'}}>
          <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:2,marginBottom:10}}>YOUR STATS</div>
          {[['Total Referrals',(up.totalReferrals||0)+' friends'],['Earned',((up.totalReferrals||0)*500)+' CUTBAR'],['Pending','0 CUTBAR'],['Next Milestone','10 referrals → 1000 bonus']].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--b)'}}>
              <span style={{fontSize:12,color:'var(--td)'}}>{k}</span>
              <span style={{fontSize:12,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── EDIT PROFILE ──
  if (screen === 'edit_profile') return (
    <div className="fu">
      <BackBar title="Edit Profile" onBack={()=>setScreen('home')}/>
      <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handlePhotoUpload}/>
      <div style={{display:'flex',flexDirection:'column',gap:12,padding:'0 14px 24px'}}>
        <div style={{textAlign:'center',padding:'20px 0 8px'}}>
          <div style={{position:'relative',display:'inline-block'}}>
            <div style={{width:84,height:84,borderRadius:'50%',overflow:'hidden',border:'3px solid var(--g)',background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto'}}>
              {form.avatar?<img src={form.avatar} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:40,lineHeight:1}}>🦝</span>}
            </div>
            <div onClick={()=>fileRef.current?.click()} style={{position:'absolute',bottom:0,right:0,width:28,height:28,borderRadius:'50%',background:'var(--g)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:14,border:'2px solid var(--bg)'}}>📷</div>
          </div>
          <div style={{marginTop:8}}>
            <button onClick={()=>fileRef.current?.click()} style={{padding:'6px 16px',borderRadius:20,background:'rgba(0,255,65,.1)',border:'1px solid rgba(0,255,65,.25)',color:'var(--g)',fontSize:11,fontWeight:700,cursor:'pointer',marginRight:8}}>Upload Photo</button>
            {form.avatar&&<button onClick={()=>{setForm(p=>({...p,avatar:null}));setUserProfile(p=>({...p,avatar:null}));toast('🗑️ Photo removed');}} style={{padding:'6px 16px',borderRadius:20,background:'rgba(255,59,92,.1)',border:'1px solid rgba(255,59,92,.25)',color:'var(--red)',fontSize:11,fontWeight:700,cursor:'pointer'}}>Remove</button>}
          </div>
          <div style={{fontSize:10,color:'var(--td)',marginTop:6,fontFamily:'var(--mono)'}}>JPG / PNG / WEBP · Max 5MB</div>
        </div>
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,overflow:'hidden'}}>
          {[{k:'name',lb:'Full Name',ph:'Your full name',t:'text'},{k:'username',lb:'Username',ph:'@username',t:'text'},{k:'email',lb:'Email Address',ph:'you@email.com',t:'email'},{k:'phone',lb:'Phone Number',ph:'+91 XXXXX XXXXX',t:'tel'},{k:'bio',lb:'Bio',ph:'Short bio about yourself',t:'text'}].map((f,i,arr)=>(
            <div key={f.k} style={{borderBottom:i<arr.length-1?'1px solid var(--b)':'none',padding:'12px 14px'}}>
              <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:1,textTransform:'uppercase',marginBottom:5}}>{f.lb}</div>
              <input value={form[f.k]||''} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} type={f.t}
                style={{background:'transparent',border:'none',color:'var(--text)',fontFamily:'var(--body)',fontSize:14,width:'100%',outline:'none',padding:0}}/>
            </div>
          ))}
        </div>
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,padding:'12px 14px'}}>
          <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:1,textTransform:'uppercase',marginBottom:5}}>Gender</div>
          <div style={{display:'flex',gap:8}}>
            {['Male','Female','Non-binary','Prefer not to say'].map(g=>(
              <button key={g} onClick={()=>setForm(p=>({...p,gender:g}))} style={{flex:1,padding:'7px 4px',borderRadius:8,border:`1px solid ${form.gender===g?'var(--g)':'var(--b)'}`,background:form.gender===g?'rgba(0,255,65,.12)':'var(--bg3)',color:form.gender===g?'var(--g)':'var(--td)',fontSize:9,fontWeight:700,cursor:'pointer',minWidth:0}}>{g.split(' ')[0]}</button>
            ))}
          </div>
        </div>
        <button onClick={()=>{setUserProfile(p=>({...p,...form}));toast('✅ Profile saved!');setScreen('home');}}
          style={{padding:'14px',borderRadius:11,border:'none',cursor:'pointer',fontFamily:'var(--display)',fontSize:14,fontWeight:700,background:'linear-gradient(135deg,var(--g2),var(--g))',color:'#000',width:'100%'}}>SAVE CHANGES</button>
      </div>
    </div>
  );

  // ── PRIVACY ──
  if (screen === 'privacy') return (
    <div className="fu">
      <BackBar title="Privacy & Data" onBack={()=>setScreen('home')}/>
      <div style={{display:'flex',flexDirection:'column',gap:10,padding:'0 14px 24px'}}>
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,overflow:'hidden'}}>
          {[{ic:'👁️',lb:'Portfolio Visibility',sub:'Public / Private',fn:()=>toast('👁️ Updated'),toggle:true,tOn:!up.portfolioPrivate},{ic:'📍',lb:'Location Data',sub:'Used for fraud detection only',fn:()=>toast('📍 Saved'),toggle:true,tOn:true},{ic:'🍪',lb:'Analytics Cookies',sub:'Help improve app experience',fn:()=>toast('🍪 Saved'),toggle:true,tOn:true}].map((it,i,arr)=>(
            <div key={it.lb} style={{borderBottom:i<arr.length-1?'1px solid var(--b)':'none',display:'flex',alignItems:'center',gap:12,padding:'13px 14px',cursor:'pointer'}} onClick={it.fn}>
              <span style={{fontSize:20,width:28,textAlign:'center',flexShrink:0}}>{it.ic}</span>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>{it.lb}</div><div style={{fontSize:11,color:'var(--td)'}}>{it.sub}</div></div>
              <Toggle on={it.tOn} onTap={it.fn}/>
            </div>
          ))}
        </div>
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,overflow:'hidden'}}>
          <Row ic="📥" lb="Download My Data" sub="Get a copy of all your CUTBAR data" fn={()=>toast('📥 Data export request sent to your email')}/>
          <div style={{height:1,background:'var(--b)',margin:'0 14px'}}/>
          <Row ic="🗑️" lb="Delete All Data" sub="Permanent — cannot be undone" fn={()=>toast('⚠️ Contact support to delete all data')}/>
        </div>
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,overflow:'hidden'}}>
          <Row ic="📋" lb="Privacy Policy" sub="How we use your data" fn={()=>window.open('https://cutbar.in/privacy','_blank')}/>
          <div style={{height:1,background:'var(--b)',margin:'0 14px'}}/>
          <Row ic="📜" lb="Terms of Service" sub="Platform usage agreement" fn={()=>window.open('https://cutbar.in/terms','_blank')}/>
        </div>
      </div>
    </div>
  );

  // ── HOME ──
  return (
    <div className="fu">
      <BackBar title="Account" onBack={onBack}/>
      <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handlePhotoUpload}/>

      {/* Profile hero */}
      <div style={{margin:'0 14px 16px',background:'linear-gradient(135deg,var(--panel),var(--panel2))',border:'1px solid var(--bb)',borderRadius:18,padding:18}}>
        <div style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:12}}>
          <div style={{position:'relative',flexShrink:0}} onClick={()=>fileRef.current?.click()}>
            <div style={{width:64,height:64,borderRadius:'50%',overflow:'hidden',border:'3px solid var(--g)',background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
              {up.avatar?<img src={up.avatar} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:32,lineHeight:1}}>🦝</span>}
            </div>
            <div style={{position:'absolute',bottom:0,right:0,width:22,height:22,borderRadius:'50%',background:'var(--g)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,border:'2px solid var(--bg)',cursor:'pointer'}}>📷</div>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:17,fontWeight:800,color:'var(--text)',marginBottom:2}}>{up.name||'User'}</div>
            <div style={{fontSize:11,color:'var(--td)',fontFamily:'var(--mono)',marginBottom:2}}>@{up.username||'user'}</div>
            <div style={{fontSize:11,color:'var(--td)',marginBottom:6}}>{up.email||''}</div>
            <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
              {up.kyc==='verified'&&<span style={{fontSize:9,background:'rgba(0,255,65,.1)',color:'var(--g)',borderRadius:10,padding:'2px 7px',fontFamily:'var(--mono)',border:'1px solid rgba(0,255,65,.2)'}}>✓ KYC Level {up.kycLevel||1}</span>}
              <span style={{fontSize:9,background:'rgba(0,229,255,.1)',color:'var(--cyan)',borderRadius:10,padding:'2px 7px',fontFamily:'var(--mono)',border:'1px solid rgba(0,229,255,.2)'}}>📅 Joined {up.joined||'2026'}</span>
            </div>
          </div>
          <button onClick={()=>setScreen('edit_profile')} style={{padding:'7px 13px',borderRadius:9,background:'rgba(0,255,65,.1)',border:'1px solid rgba(0,255,65,.2)',cursor:'pointer',fontSize:12,color:'var(--g)',fontWeight:700,flexShrink:0}}>Edit</button>
        </div>
        {up.bio&&<div style={{fontSize:12,color:'var(--tm)',lineHeight:1.5,borderTop:'1px solid var(--b)',paddingTop:10}}>{up.bio}</div>}
      </div>

      <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',padding:'0 16px 8px',letterSpacing:3}}>IDENTITY & ACCESS</div>
      <div style={{margin:'0 14px 14px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,overflow:'hidden'}}>
        {[{ic:'👤',lb:'Edit Profile',sub:'Name, photo, bio, DOB, gender',fn:()=>setScreen('edit_profile')},{ic:'🛡️',lb:'Security',sub:'Password, 2FA, passkey, sessions',fn:()=>setScreen('security')},{ic:'✅',lb:'KYC & Verification',sub:'Identity docs, withdrawal limits',fn:()=>setScreen('verification')},{ic:'🔏',lb:'Privacy & Data',sub:'Visibility, cookies, data export',fn:()=>setScreen('privacy')}].map((it,i,arr)=>(
          <div key={it.lb}>{i>0&&<div style={{height:1,background:'var(--b)',margin:'0 14px'}}/>}<Row ic={it.ic} lb={it.lb} sub={it.sub} fn={it.fn}/></div>
        ))}
      </div>

      <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',padding:'0 16px 8px',letterSpacing:3}}>PERSONALIZATION</div>
      <div style={{margin:'0 14px 14px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,overflow:'hidden'}}>
        {[{ic:theme==='dark'?'🌙':'☀️',lb:`${theme==='dark'?'Dark':'Light'} Mode`,sub:'Tap to switch',fn:()=>setTheme(t=>t==='dark'?'light':'dark'),right:<Toggle on={theme==='dark'} onTap={()=>setTheme(t=>t==='dark'?'light':'dark')}/>},{ic:'🔔',lb:'Notifications',sub:'Push, email, SMS, price alerts',fn:()=>setScreen('notifications')},{ic:'⚙️',lb:'Preferences',sub:'Currency, language, chart, privacy',fn:()=>setScreen('preferences')},{ic:'📄',lb:'Documents & Tax Reports',sub:'Annual statement, Form 26AS',fn:()=>toast('📄 Tax documents requested — sent to email')}].map((it,i,arr)=>(
          <div key={it.lb}>{i>0&&<div style={{height:1,background:'var(--b)',margin:'0 14px'}}/>}<Row ic={it.ic} lb={it.lb} sub={it.sub} fn={it.fn} right={it.right}/></div>
        ))}
      </div>

      <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',padding:'0 16px 8px',letterSpacing:3}}>GROW</div>
      <div style={{margin:'0 14px 14px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,overflow:'hidden'}}>
        {[{ic:'🎁',lb:'Refer & Earn',sub:`${up.totalReferrals||0} referrals · Earn 500 CUTBAR/friend`,fn:()=>setScreen('referral')},{ic:'💰',lb:'Earn / Staking',sub:'Up to 18.66% APR on your assets',fn:()=>toast('💰 Earn & Staking — coming Phase 5')},{ic:'🏆',lb:'Rewards & Achievements',sub:'Track badges, milestones, streaks',fn:()=>toast('🏆 Rewards hub — coming Phase 5')}].map((it,i,arr)=>(
          <div key={it.lb}>{i>0&&<div style={{height:1,background:'var(--b)',margin:'0 14px'}}/>}<Row ic={it.ic} lb={it.lb} sub={it.sub} fn={it.fn}/></div>
        ))}
      </div>

      <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',padding:'0 16px 8px',letterSpacing:3}}>SUPPORT</div>
      <div style={{margin:'0 14px 14px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,overflow:'hidden'}}>
        {[{ic:'💬',lb:'Customer Support',sub:'24/7 · Average response 2 hours',fn:()=>toast('💬 Support chat opened')},{ic:'📤',lb:'Send Feedback',sub:'Help us improve CUTBAR',fn:()=>toast('📤 Feedback form opened')},{ic:'⭐',lb:'Rate the App',sub:'We appreciate your support!',fn:()=>toast('⭐ Thank you for the love! 🐑')},{ic:'📱',lb:'App Version',sub:'CUTBAR v4.2 · BSC · BEP-20',fn:null,right:<span style={{fontSize:11,color:'var(--td)',fontFamily:'var(--mono)'}}>v4.2</span>}].map((it,i,arr)=>(
          <div key={it.lb}>{i>0&&<div style={{height:1,background:'var(--b)',margin:'0 14px'}}/>}<Row ic={it.ic} lb={it.lb} sub={it.sub} fn={it.fn} right={it.right}/></div>
        ))}
      </div>

      <div style={{margin:'0 14px 28px',background:'rgba(255,59,92,.04)',border:'1px solid rgba(255,59,92,.12)',borderRadius:14,overflow:'hidden'}}>
        <div onClick={()=>toast('👋 See you soon!')} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 14px',cursor:'pointer',borderBottom:'1px solid rgba(255,59,92,.1)'}}>
          <span style={{fontSize:20}}>🚪</span>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:'var(--red)'}}>Sign Out</div><div style={{fontSize:11,color:'var(--td)'}}>You can sign back in anytime</div></div>
        </div>
        <div onClick={()=>toast('⚠️ Account deletion requires email confirmation. Check inbox.')} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 14px',cursor:'pointer'}}>
          <span style={{fontSize:20}}>🗑️</span>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:'var(--red)'}}>Delete Account</div><div style={{fontSize:11,color:'var(--td)'}}>Permanently removes all data</div></div>
        </div>
      </div>
    </div>
  );
}
