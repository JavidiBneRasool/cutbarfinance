import { useState } from 'react';
import { BackBar, R, C, Txt } from '../components/primitives';

export default function SettingsPage({ theme, setTheme, toast, onBack }) {
  const [toggles,setToggles]=useState({0:true,1:true,2:false,3:false,4:false});
  const settings=[['🔔','Notifications','Push alerts for price moves'],['🔐','Biometric Lock','Fingerprint / Face ID'],['📊','Price Alerts','Custom price triggers'],['🌐','Currency','USD / INR / EUR'],['🔒','2FA','Two-factor auth']];
  const Toggle=({on,onTap})=>(
    <div onClick={onTap} style={{width:46,height:25,borderRadius:12,background:on?'var(--g)':'var(--b)',position:'relative',cursor:'pointer',transition:'background .3s',border:'1px solid var(--bb)',flexShrink:0}}>
      <div style={{position:'absolute',top:3,left:on?21:3,width:17,height:17,borderRadius:'50%',background:on?'#000':'var(--td)',transition:'left .3s'}}/>
    </div>
  );
  return(
    <div className="fu">
      <BackBar title="Settings" onBack={onBack}/>
      <div style={{margin:'0 14px 12px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,overflow:'hidden'}}>
        <div style={{padding:14,borderBottom:'1px solid var(--b)'}}>
          <R justify="space-between" align="center">
            <R gap={12}><span style={{fontSize:20}}>{theme==='dark'?'🌙':'☀️'}</span><C gap={2}><Txt size={14} weight={700}>{theme==='dark'?'Dark':'Light'} Mode</Txt><Txt size={11} color="var(--td)">Tap to switch</Txt></C></R>
            <Toggle on={theme==='dark'} onTap={()=>setTheme(t=>t==='dark'?'light':'dark')}/>
          </R>
        </div>
        {settings.map(([ic,lb,sub],i)=>(
          <div key={i} style={{padding:14,borderBottom:i<settings.length-1?'1px solid var(--b)':'none'}}>
            <R justify="space-between" align="center">
              <R gap={12}><span style={{fontSize:19}}>{ic}</span><C gap={2}><Txt size={13} weight={700}>{lb}</Txt><Txt size={11} color="var(--td)">{sub}</Txt></C></R>
              <Toggle on={!!toggles[i]} onTap={()=>setToggles(p=>({...p,[i]:!p[i]}))}/>
            </R>
          </div>
        ))}
      </div>
      <Txt size={10} color="var(--td)" mono={true} style={{textAlign:'center',display:'block',padding:'8px 0 20px',letterSpacing:2}}>CUTBAR v4.2 · BSC · cutbar.in</Txt>
    </div>
  );
}
