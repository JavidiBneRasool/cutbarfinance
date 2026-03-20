/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from 'react';
import { BackBar, Btn, Input, R, C, Txt, Bx } from '../components/primitives';
import { UPI_SVGS, COUNTRIES } from '../data/paymentData';

// ── Firebase Phone OTP ──
function PhoneInput({ onVerified }) {
  const [country,    setCountry]    = useState(COUNTRIES[0]);
  const [phone,      setPhone]      = useState('');
  const [otp,        setOtp]        = useState('');
  const [showDD,     setShowDD]     = useState(false);
  const [step,       setStep]       = useState('phone');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [timer,      setTimer]      = useState(0);
  const [confirmObj, setConfirmObj] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (window._fbLoaded) return;
    const s1 = document.createElement('script');
    s1.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js';
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js';
      s2.onload = () => {
        if (!window.firebase.apps.length) {
          window.firebase.initializeApp({
            apiKey:'AIzaSyAXcODKQsw_IgRX2kma70AV-qPyKEBg2vI',
            authDomain:'cutbar-app.firebaseapp.com',
            projectId:'cutbar-app',
            storageBucket:'cutbar-app.firebasestorage.app',
            messagingSenderId:'813571297078',
            appId:'1:813571297078:web:11700c3db2db5726ad6d97',
          });
        }
        window._fbAuth = window.firebase.auth();
        window._fbAuth.useDeviceLanguage();
        window._fbLoaded = true;
      };
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const validatePhone = (num) => {
    const digits = num.replace(/[^0-9]/g, '');
    if (!digits) return 'Phone number required';
    if (digits.length !== country.digits) return `${country.name} needs ${country.digits} digits (got ${digits.length})`;
    return '';
  };

  const startTimer = () => {
    setTimer(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; }), 1000);
  };

  const handleSend = () => {
    const err = validatePhone(phone);
    if (err) { setError(err); return; }
    if (!window._fbLoaded || !window._fbAuth) { setError('Firebase loading... try again in 2 seconds'); return; }
    setError(''); setLoading(true);
    if (!window._recaptcha) {
      const el = document.getElementById('fb-recaptcha');
      if (el) el.innerHTML = '';
      window._recaptcha = new window.firebase.auth.RecaptchaVerifier('fb-recaptcha', { size: 'invisible', callback: () => {} });
    }
    window._fbAuth.signInWithPhoneNumber(country.dial + phone, window._recaptcha)
      .then(result => { setConfirmObj(result); setStep('otp'); setLoading(false); startTimer(); })
      .catch(e => {
        setLoading(false); window._recaptcha = null;
        let msg = 'Failed to send OTP. Try again.';
        if (e.code === 'auth/invalid-phone-number') msg = 'Invalid phone number.';
        if (e.code === 'auth/too-many-requests') msg = 'Too many attempts. Wait 10 mins.';
        if (e.code === 'auth/quota-exceeded') msg = 'SMS quota exceeded.';
        setError(msg);
      });
  };

  const handleVerify = () => {
    if (otp.length !== 6) { setError('Enter 6-digit OTP'); return; }
    if (!confirmObj) { setError('Please send OTP first'); return; }
    setError(''); setLoading(true);
    confirmObj.confirm(otp)
      .then(() => { setStep('done'); setLoading(false); if (onVerified) onVerified(country.dial + phone); })
      .catch(e => { setLoading(false); setError(e.code === 'auth/code-expired' ? 'OTP expired. Resend.' : 'Wrong OTP. Try again.'); });
  };

  if (step === 'done') return (
    <div style={{background:'rgba(0,255,65,.08)',border:'1px solid rgba(0,255,65,.3)',borderRadius:10,padding:14,textAlign:'center'}}>
      <div style={{fontSize:28,marginBottom:6}}>✅</div>
      <span style={{fontSize:14,color:'var(--g)',fontFamily:'var(--body)',fontWeight:700,display:'block'}}>Phone Verified!</span>
      <span style={{fontSize:11,color:'var(--td)',fontFamily:'var(--mono)',display:'block',marginTop:4}}>{country.dial} {phone}</span>
    </div>
  );

  if (step === 'otp') return (
    <div>
      <div style={{background:'rgba(0,255,65,.08)',border:'1px solid rgba(0,255,65,.22)',borderRadius:10,padding:12,marginBottom:12}}>
        <span style={{fontSize:12,color:'var(--g)',display:'block',marginBottom:2}}>OTP sent to {country.dial} {phone}</span>
        <span style={{fontSize:11,color:'var(--td)',fontFamily:'var(--mono)'}}>Enter the 6-digit code from SMS</span>
      </div>
      <div style={{marginBottom:6}}>
        <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:1,textTransform:'uppercase',display:'block',marginBottom:6}}>Enter OTP</span>
        <input type="tel" inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/[^0-9]/g,''))}
          placeholder="••••••" style={{background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:22,borderRadius:9,padding:'11px 14px',width:'100%',letterSpacing:6,outline:'none',textAlign:'center'}}/>
      </div>
      {error && <div style={{fontSize:11,color:'var(--red)',fontFamily:'var(--mono)',marginBottom:8}}>⚠ {error}</div>}
      <Btn v="primary" onClick={handleVerify} disabled={loading || otp.length !== 6}>{loading ? 'Verifying...' : 'VERIFY OTP'}</Btn>
      <div style={{textAlign:'center',marginTop:10}}>
        <span onClick={() => timer === 0 && handleSend()} style={{fontSize:11,color: timer > 0 ? 'var(--td)' : 'var(--g)',fontFamily:'var(--mono)',cursor: timer > 0 ? 'default' : 'pointer'}}>
          {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
        </span>
      </div>
      <div id="fb-recaptcha"/>
    </div>
  );

  return (
    <div>
      <div style={{display:'flex',gap:8,marginBottom:8}}>
        <div onClick={() => setShowDD(!showDD)} style={{background:'var(--bg3)',border:'1px solid var(--b)',borderRadius:9,padding:'11px 12px',cursor:'pointer',display:'flex',alignItems:'center',gap:6,flexShrink:0,position:'relative',minWidth:90}}>
          <span style={{fontSize:16}}>{country.flag}</span>
          <span style={{fontSize:12,color:'var(--text)',fontFamily:'var(--mono)',fontWeight:600}}>{country.dial}</span>
          <span style={{fontSize:10,color:'var(--td)'}}>▾</span>
        </div>
        <input type="tel" inputMode="numeric" placeholder={`${country.digits}-digit number`} value={phone}
          onChange={e => setPhone(e.target.value.replace(/[^0-9]/g,'').slice(0, country.digits))}
          style={{flex:1,background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:14,borderRadius:9,padding:'11px 14px',outline:'none'}}/>
      </div>
      {showDD && (
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:10,overflow:'hidden',marginBottom:10,maxHeight:200,overflowY:'auto'}}>
          {COUNTRIES.map(c => (
            <div key={c.code} onClick={() => { setCountry(c); setShowDD(false); }}
              style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',cursor:'pointer',borderBottom:'1px solid var(--b)'}}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,65,.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{fontSize:18}}>{c.flag}</span>
              <span style={{fontSize:13,flex:1,color:'var(--text)'}}>{c.name}</span>
              <span style={{fontSize:12,color:'var(--td)',fontFamily:'var(--mono)'}}>{c.dial}</span>
            </div>
          ))}
        </div>
      )}
      {error && <div style={{fontSize:11,color:'var(--red)',fontFamily:'var(--mono)',marginBottom:8}}>⚠ {error}</div>}
      <Btn v="primary" onClick={handleSend} disabled={loading || phone.length === 0}>{loading ? 'Sending OTP...' : 'SEND OTP'}</Btn>
      <div id="fb-recaptcha"/>
    </div>
  );
}

// ── BankPage ──
export default function BankPage({ toast, onBack, navigate, initialScreen = 'home' }) {
  const [screen,  setScreen]  = useState(initialScreen);
  const [amt,     setAmt]     = useState('');
  const [kycStep, setKycStep] = useState(0);
  const [form,    setForm]    = useState({ name:'', phone:'', aadhaar:'', pan:'' });
  const ni = v => { if (v === '.' && amt.includes('.')) return; if (amt.length > 8) return; setAmt(a => a + v); };

  // ── OPEN ACCOUNT FLOW ──
  if (screen === 'open_account') {
    const steps = ['Personal Info', 'KYC Documents', 'Set MPIN', 'Done!'];
    return (
      <div className="fu">
        <BackBar title="Open CUTBAR Bank Account" onBack={() => kycStep === 0 ? setScreen('home') : setKycStep(k => k - 1)}/>
        <div style={{padding:'0 14px 14px'}}>
          <R gap={0} style={{marginBottom:20}}>
            {steps.map((s, i) => (
              <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                <div style={{width:28,height:28,borderRadius:'50%',background:i<=kycStep?'var(--g)':'var(--b)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:i<=kycStep?'#000':'var(--td)',border:`2px solid ${i<=kycStep?'var(--g)':'var(--b)'}`,transition:'all .3s',position:'relative',zIndex:1}}>
                  {i < kycStep ? '✓' : i + 1}
                </div>
                <Txt size={8} color={i <= kycStep ? 'var(--g)' : 'var(--td)'} weight={700} style={{textAlign:'center'}}>{s}</Txt>
              </div>
            ))}
          </R>

          {kycStep === 0 && (
            <C gap={12}>
              <div style={{background:'linear-gradient(135deg,rgba(0,255,65,.08),rgba(0,255,65,.02))',border:'1px solid var(--bb)',borderRadius:12,padding:12}}>
                <R gap={10} style={{marginBottom:8}}>
                  <span style={{fontSize:24}}>🏦</span>
                  <C gap={2}><Txt size={14} weight={800} color="var(--g)">CUTBAR Bank</Txt><Txt size={10} color="var(--td)">Free · Instant · Secure · 500 CUTBAR Bonus</Txt></C>
                </R>
                <R gap={8} style={{flexWrap:'wrap'}}>
                  {['Zero Balance','Instant UPI','Free IMPS','500 CUTBAR Bonus'].map(f=>(
                    <span key={f} style={{fontSize:10,background:'rgba(0,255,65,.12)',color:'var(--g)',borderRadius:20,padding:'2px 8px',fontFamily:'var(--mono)',border:'1px solid rgba(0,255,65,.2)'}}>✓ {f}</span>
                  ))}
                </R>
              </div>
              <C gap={4}>
                <Txt size={10} color="var(--td)" mono={true} style={{letterSpacing:1,textTransform:'uppercase'}}>Full Name (as per Aadhaar)</Txt>
                <div style={{position:'relative'}}>
                  <input placeholder="Enter your full name" value={form.name}
                    onChange={e=>{const v=e.target.value.replace(/[^a-zA-Z\s]/g,'');setForm(p=>({...p,name:v,nameErr:v.trim().split(' ').length<2?'Enter full name (first + last)':''}));}}
                    style={{background:'var(--bg3)',border:`1px solid ${form.nameErr?'var(--red)':form.name.trim().split(' ').length>=2?'var(--g)':'var(--b)'}`,color:'var(--text)',fontFamily:'var(--body)',fontSize:14,borderRadius:9,padding:'11px 40px 11px 14px',width:'100%'}}/>
                  {form.name.trim().split(' ').length>=2&&<span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'var(--g)',fontSize:16}}>✓</span>}
                </div>
                {form.nameErr&&<span style={{fontSize:11,color:'var(--red)',fontFamily:'var(--mono)'}}>⚠ {form.nameErr}</span>}
              </C>
              <C gap={4}>
                <Txt size={10} color="var(--td)" mono={true} style={{letterSpacing:1,textTransform:'uppercase'}}>Date of Birth</Txt>
                <input type="date" value={form.dob||''} max={new Date(Date.now()-18*365.25*24*60*60*1000).toISOString().split('T')[0]} min="1920-01-01"
                  onChange={e=>{const v=e.target.value;const age=Math.floor((Date.now()-new Date(v))/(365.25*24*60*60*1000));setForm(p=>({...p,dob:v,dobErr:age<18?'You must be 18 or older':''}));}}
                  style={{background:'var(--bg3)',border:`1px solid ${form.dobErr?'var(--red)':form.dob&&!form.dobErr?'var(--g)':'var(--b)'}`,color:form.dob?'var(--text)':'var(--td)',fontFamily:'var(--mono)',fontSize:13,borderRadius:9,padding:'11px 14px',width:'100%',colorScheme:'dark'}}/>
                {form.dobErr&&<span style={{fontSize:11,color:'var(--red)',fontFamily:'var(--mono)'}}>⚠ {form.dobErr}</span>}
                {form.dob&&!form.dobErr&&<span style={{fontSize:11,color:'var(--g)',fontFamily:'var(--mono)'}}>✓ Age verified</span>}
              </C>
              <C gap={4}>
                <Txt size={10} color="var(--td)" mono={true} style={{letterSpacing:1,textTransform:'uppercase'}}>Email Address</Txt>
                <input type="email" placeholder="you@example.com" value={form.email||''}
                  onChange={e=>setForm(p=>({...p,email:e.target.value}))}
                  style={{background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:13,borderRadius:9,padding:'11px 14px',width:'100%'}}/>
              </C>
              <C gap={4} style={{position:'relative'}}>
                <Txt size={10} color="var(--td)" mono={true} style={{letterSpacing:1,textTransform:'uppercase'}}>Mobile Number Verification</Txt>
                <PhoneInput onVerified={phone=>{setForm(p=>({...p,phone,phoneVerified:true}));toast('✅ Phone number verified!');}}/>
              </C>
              {form.phoneVerified&&(
                <Btn v="primary" onClick={()=>{
                  if(!form.name||form.nameErr){toast('⚠️ Enter valid full name');return;}
                  if(!form.dob||form.dobErr){toast('⚠️ Enter valid date of birth');return;}
                  if(!form.email){toast('⚠️ Enter email address');return;}
                  setKycStep(1);
                }}>CONTINUE TO KYC →</Btn>
              )}
            </C>
          )}

          {kycStep === 1 && (
            <C gap={12}>
              <div style={{background:'rgba(255,215,0,.06)',border:'1px solid rgba(255,215,0,.2)',borderRadius:12,padding:12}}>
                <Txt size={11} color="var(--gold)" mono={true} style={{display:'block',marginBottom:4}}>📋 KYC REQUIRED BY RBI</Txt>
                <Txt size={11} color="var(--td)">As per RBI guidelines, KYC verification is mandatory for all bank accounts.</Txt>
              </div>
              <Input label="Aadhaar Number" placeholder="XXXX XXXX XXXX" value={form.aadhaar} onChange={e=>setForm(p=>({...p,aadhaar:e.target.value}))}/>
              <Input label="PAN Number" placeholder="ABCDE1234F" value={form.pan} onChange={e=>setForm(p=>({...p,pan:e.target.value}))}/>
              <C gap={5}>
                <Txt size={10} color="var(--td)" mono={true} style={{letterSpacing:1,textTransform:'uppercase'}}>Upload Aadhaar Front</Txt>
                <div onClick={()=>toast('📷 Camera/Gallery access required')} style={{background:'var(--bg3)',border:'2px dashed var(--b)',borderRadius:10,padding:'20px',textAlign:'center',cursor:'pointer'}}>
                  <Txt size={22} style={{display:'block',marginBottom:6}}>📷</Txt>
                  <Txt size={12} color="var(--td)">Tap to upload or capture</Txt>
                </div>
              </C>
              <Btn v="primary" onClick={()=>{if(!form.aadhaar||!form.pan){toast('⚠️ Please fill all KYC fields');return;}setKycStep(2);}}>VERIFY KYC →</Btn>
            </C>
          )}

          {kycStep === 2 && (
            <C gap={12}>
              <div style={{textAlign:'center',padding:'10px 0'}}>
                <Txt size={40} style={{display:'block',marginBottom:8}}>🔐</Txt>
                <Txt size={15} weight={800} color="var(--g)" style={{display:'block',marginBottom:4}}>Set Your MPIN</Txt>
                <Txt size={12} color="var(--td)" style={{lineHeight:1.6}}>6-digit secure PIN for all transactions.</Txt>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k,i)=>(
                  <div key={i} onClick={()=>k&&toast(k==='⌫'?'⌫':'● PIN digit entered')} style={{background:k?'var(--panel)':'transparent',border:k?'1px solid var(--b)':'none',borderRadius:10,padding:15,textAlign:'center',fontFamily:'var(--display)',fontSize:20,color:k==='⌫'?'var(--red)':'var(--text)',cursor:k?'pointer':'default'}}>{k}</div>
                ))}
              </div>
              <Btn v="primary" onClick={()=>setKycStep(3)}>SET MPIN →</Btn>
            </C>
          )}

          {kycStep === 3 && (
            <C gap={16} align="center" style={{padding:'20px 0'}}>
              <div style={{width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,var(--g2),var(--g))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,boxShadow:'0 0 40px rgba(0,255,65,.4)'}}>✓</div>
              <Txt size={22} weight={800} color="var(--g)" style={{fontFamily:'var(--display)',letterSpacing:.5}}>ACCOUNT OPENED!</Txt>
              <Txt size={13} color="var(--tm)" style={{textAlign:'center',lineHeight:1.7,maxWidth:280}}>Your CUTBAR Bank account is active. UPI ID: <strong style={{color:'var(--g)'}}>user@cutbar</strong></Txt>
              <C gap={8} style={{width:'100%'}}>
                {[['🏦','Account Number','CUTBAR'+Math.floor(Math.random()*999999999)],['💳','IFSC Code','CUTB0001001'],['📲','UPI ID','user@cutbar'],['🐑','CUTBAR Reward','500 CUTBAR credited!']].map(([ic,k,v])=>(
                  <R key={k} justify="space-between" style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:10,padding:'11px 13px'}}>
                    <R gap={10}><span style={{fontSize:18}}>{ic}</span><Txt size={12} color="var(--td)">{k}</Txt></R>
                    <Txt size={11} color="var(--g)" mono={true} weight={700}>{v}</Txt>
                  </R>
                ))}
              </C>
              <Btn v="primary" onClick={()=>{toast('🎉 Welcome to CUTBAR Bank!');setScreen('home');setKycStep(0);}}>GO TO BANK HOME →</Btn>
            </C>
          )}
        </div>
      </div>
    );
  }

  // ── UPI PAY ──
  if (screen === 'upi_pay') return (
    <div className="fu">
      <BackBar title="UPI Pay" onBack={() => setScreen('home')}/>
      <div style={{padding:'0 14px 14px'}}>
        <div style={{textAlign:'center',fontFamily:'var(--display)',fontSize:52,color:'var(--g)',textShadow:'0 0 20px rgba(0,255,65,.5)',letterSpacing:.5,margin:'10px 0 16px'}}>
          <span style={{fontSize:24,verticalAlign:'super'}}>₹</span>{amt||'0'}
        </div>
        <input placeholder="UPI ID / Phone / Name" style={{background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:13,borderRadius:9,padding:'11px 14px',width:'100%',marginBottom:12}}/>
        <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,textTransform:'uppercase',display:'block',marginBottom:10}}>Pay with</span>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
          {[
            {name:'CutPay',icon:'🐑',color:'#00ff41',sub:'CUTBAR native pay'},
            {name:'GPay',icon:UPI_SVGS.gpay,color:'#4285F4',sub:'Google Pay UPI'},
            {name:'PhonePe',icon:UPI_SVGS.phonepe,color:'#5f259f',sub:'PhonePe UPI'},
            {name:'Paytm',icon:UPI_SVGS.paytm,color:'#00baf2',sub:'Paytm UPI'},
            {name:'Amazon Pay',icon:UPI_SVGS.amazonpay,color:'#F79C34',sub:'Amazon Pay UPI'},
            {name:'UPI QR',icon:'📷',color:'#ff7a00',sub:'Scan any QR code'},
          ].map(p=>(
            <div key={p.name} onClick={()=>toast(`Opening ${p.name}...`)}
              style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,padding:14,cursor:'pointer',display:'flex',flexDirection:'column',gap:7}}>
              <div style={{height:24,display:'flex',alignItems:'center'}}>{typeof p.icon==='string'?<span style={{fontSize:22}}>{p.icon}</span>:p.icon}</div>
              <span style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>{p.name}</span>
              <span style={{fontSize:10,color:'var(--td)'}}>{p.sub}</span>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
          {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k=>(
            <div key={k} onClick={()=>k==='⌫'?setAmt(a=>a.slice(0,-1)):ni(k)}
              style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:11,padding:14,textAlign:'center',fontFamily:'var(--display)',fontSize:20,color:k==='⌫'?'var(--red)':'var(--text)',cursor:'pointer',userSelect:'none'}}>{k}</div>
          ))}
          <div onClick={()=>{toast('✅ ₹'+amt+' Paid via UPI!');setScreen('home');setAmt('');}}
            style={{gridColumn:'1/-1',background:'linear-gradient(135deg,var(--g2),var(--g))',borderRadius:11,padding:14,textAlign:'center',fontFamily:'var(--display)',fontSize:15,color:'#000',cursor:'pointer',letterSpacing:.5}}>PAY NOW ➤</div>
        </div>
      </div>
    </div>
  );

  // ── SEND MONEY ──
  if (screen === 'send') return (
    <div className="fu">
      <BackBar title="Send Money" onBack={() => setScreen('home')}/>
      <div style={{margin:'0 14px 12px',textAlign:'center',fontFamily:'var(--display)',fontSize:52,color:'var(--g)',textShadow:'var(--glow)',letterSpacing:.5}}>
        <span style={{fontSize:24,verticalAlign:'super'}}>₹</span>{amt||'0'}
      </div>
      <div style={{margin:'0 14px 12px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:12,padding:14}}>
        <span style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:1,display:'block',marginBottom:6,textTransform:'uppercase'}}>To</span>
        <input placeholder="UPI ID / Phone / Account number" style={{background:'var(--bg3)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:13,borderRadius:9,padding:'11px 14px',width:'100%',outline:'none'}}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,margin:'0 14px 14px'}}>
        {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k=>(
          <div key={k} onClick={()=>k==='⌫'?setAmt(a=>a.slice(0,-1)):ni(k)} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:11,padding:15,textAlign:'center',fontFamily:'var(--display)',fontSize:21,color:k==='⌫'?'var(--red)':'var(--text)',cursor:'pointer',userSelect:'none'}}>{k}</div>
        ))}
        <div onClick={()=>{toast('✅ ₹'+amt+' Sent! Ref: CUTBAR'+Math.floor(Math.random()*9999999));setScreen('home');setAmt('');}}
          style={{gridColumn:'1/-1',background:'linear-gradient(135deg,var(--g2),var(--g))',borderRadius:11,padding:15,textAlign:'center',fontFamily:'var(--display)',fontSize:15,color:'#000',cursor:'pointer',letterSpacing:.5,boxShadow:'0 4px 18px rgba(0,255,65,.22)'}}>PAY NOW ➤</div>
      </div>
    </div>
  );

  // ── HOME ──
  const upiApps = [
    {key:'gpay',      label:'Google Pay', svg:UPI_SVGS.gpay,      sub:'UPI · Instant · Free'},
    {key:'phonepe',   label:'PhonePe',    svg:UPI_SVGS.phonepe,   sub:'UPI · Instant · Free'},
    {key:'paytm',     label:'Paytm',      svg:UPI_SVGS.paytm,     sub:'UPI · Instant · Free'},
    {key:'amazonpay', label:'Amazon Pay', svg:UPI_SVGS.amazonpay, sub:'UPI · Instant · Free'},
    {key:'upi',       label:'UPI Direct', svg:UPI_SVGS.upi,       sub:'UPI · Instant · Free'},
  ];
  const cardMethods = [
    {key:'visa',      label:'Visa',          sub:'Credit / Debit',     svg:UPI_SVGS.visa},
    {key:'master',    label:'Mastercard',    sub:'Credit / Debit',     svg:UPI_SVGS.master},
    {key:'rupay',     label:'RuPay',         sub:'Debit Card',         svg:UPI_SVGS.rupay},
    {key:'digirupee', label:'Digital Rupee', sub:'RBI · e₹ CBDC',      svg:UPI_SVGS.digirupee},
    {key:'netbank',   label:'Bank Transfer', sub:'NEFT · IMPS · RTGS', svg:UPI_SVGS.netbank},
  ];

  return (
    <div className="fu">
      <BackBar title="Bank & Payments" onBack={onBack}/>
      <div onClick={()=>navigate('cutpay')} style={{margin:'0 14px 12px',background:'linear-gradient(135deg,rgba(0,229,255,.1),rgba(0,229,255,.03))',border:'1px solid rgba(0,229,255,.3)',borderRadius:14,padding:'13px 16px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <span style={{fontSize:24}}>💳</span>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:'var(--cyan)'}}>CUTPay — Payment OS</div>
            <div style={{fontSize:11,color:'var(--td)'}}>Send money · FD · Loans · Insurance · Scan & Pay</div>
          </div>
        </div>
        <span style={{fontSize:16,color:'var(--cyan)'}}>›</span>
      </div>
      <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',padding:'2px 16px 10px',letterSpacing:3,textTransform:'uppercase'}}>UPI Payment Apps</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,margin:'0 14px 14px'}}>
        {upiApps.map(m=>(
          <div key={m.key} onClick={()=>toast(`Opening ${m.label}...`)} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,padding:'14px 12px',cursor:'pointer',display:'flex',flexDirection:'column',gap:8}}>
            <div style={{height:32,display:'flex',alignItems:'center'}}>{m.svg}</div>
            <div style={{fontSize:13,fontWeight:700}}>{m.label}</div>
            <div style={{fontSize:10,color:'var(--td)'}}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)',padding:'2px 16px 10px',letterSpacing:3,textTransform:'uppercase'}}>Cards & Banking</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,margin:'0 14px 14px'}}>
        {cardMethods.map(m=>(
          <div key={m.key} onClick={()=>toast(`${m.label} selected`)} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,padding:'14px 12px',cursor:'pointer',display:'flex',flexDirection:'column',gap:8}}>
            <div style={{height:32,display:'flex',alignItems:'center'}}>{m.svg}</div>
            <div style={{fontSize:13,fontWeight:700}}>{m.label}</div>
            <div style={{fontSize:10,color:'var(--td)'}}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div style={{margin:'0 14px 20px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <Btn v="primary" onClick={()=>setScreen('send')}>Send Money</Btn>
        <Btn v="outline" onClick={()=>setScreen('open_account')}>Open Account</Btn>
      </div>
    </div>
  );
}
