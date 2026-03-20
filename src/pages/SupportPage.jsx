import { useState } from 'react';
import { BackBar, R, C, Txt, Bx, Btn } from '../components/primitives';

export default function SupportPage({ toast, onBack }) {
  const [msg,setMsg]=useState('');
  return(
    <div className="fu">
      <BackBar title="Customer Service" onBack={onBack}/>
      <div style={{margin:'0 14px 12px',background:'linear-gradient(135deg,#091a0c,#040e07)',border:'1px solid var(--bb)',borderRadius:14,padding:16,textAlign:'center'}}>
        <div style={{fontSize:36,marginBottom:8}}>🤝</div>
        <Txt size={15} weight={800} color="var(--g)" style={{display:'block',marginBottom:4}}>24/7 Support</Txt>
        <Txt size={12} color="var(--td)" style={{lineHeight:1.6}}>Average response: 2 hours</Txt>
        <R gap={9} justify="center" style={{marginTop:12}}><Bx color="green">● Online</Bx><Bx color="gold">Avg 2hr</Bx></R>
      </div>
      <C gap={9} style={{padding:'0 14px 12px'}}>
        {[['📧','Email Support','support@cutbar.in',()=>window.location.href='mailto:support@cutbar.in'],['💬','Telegram','@cutbar',()=>window.open('https://t.me/cutbar','_blank')],['🐦','Twitter / X','@cutbar',()=>window.open('https://x.com/cutbar','_blank')]].map(([ic,lb,sub,fn])=>(
          <div key={lb} onClick={fn} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,padding:'13px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:22}}>{ic}</span>
            <C gap={2} style={{flex:1}}><Txt size={13} weight={700}>{lb}</Txt><Txt size={11} color="var(--td)" mono={true}>{sub}</Txt></C>
            <Txt size={14} color="var(--td)">›</Txt>
          </div>
        ))}
      </C>
      <div style={{padding:'0 14px 14px'}}>
        <Txt size={10} color="var(--td)" mono={true} style={{letterSpacing:2,display:'block',marginBottom:8,textTransform:'uppercase'}}>Submit a Ticket</Txt>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Describe your issue..." rows={4} style={{background:'var(--panel)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--body)',fontSize:13,borderRadius:10,padding:'12px 14px',width:'100%',outline:'none',resize:'none',marginBottom:10}}/>
        <Btn v="primary" onClick={()=>{toast('✅ Ticket submitted!');setMsg('');}}>SUBMIT TICKET</Btn>
      </div>
    </div>
  );
}
