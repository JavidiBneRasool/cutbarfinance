/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { useTheme }      from './hooks/useTheme';
import { useToast }      from './hooks/useToast';
import { useNavigation } from './hooks/useNavigation';
import { useMarket, useTrend, useGlobal, useBinance, useFG, useNews } from './hooks/useMarket';
import AppHeader      from './components/AppHeader';
import BottomNav      from './components/BottomNav';
import Drawer         from './components/Drawer';
import ProfilePanel   from './components/ProfilePanel';
import PulsePanel     from './components/PulsePanel';
import SmartPromptBar from './components/SmartPromptBar';
import Ticker         from './components/Ticker';
import AppRouter      from './router/AppRouter';

export default function CUTBAR() {
  const [theme,       setTheme]      = useState('dark');
  const [drawer,      setDrawer]     = useState(false);
  const [profile,     setProfile]    = useState(false);
  const [pulse,       setPulse]      = useState(false);

  const [userProfile, setUserProfile] = useState({
    name:'Khachi', username:'Khachi', email:'user@gmail.com',
    phone:'+91 9876543210', bio:'CUTBAR holder & Web3 enthusiast 🐑',
    avatar:null, kyc:'verified', kycLevel:2, joined:'2026',
    country:'IN', currency:'USD', language:'EN',
    referralCode:'CUTBAR-IBNE', totalReferrals:7, portfolioPrivate:false,
  });

  useTheme(theme);

  const { toastMsg, toast }                          = useToast();
  const { page, activeTab, navigate, goBack, navToTab } = useNavigation();

  const { coins, load, ts, go } = useMarket();
  const trend  = useTrend();
  const global = useGlobal();
  const bp     = useBinance();
  const fg     = useFG();
  const { posts, load: nLoad } = useNews();

  return (
    <>
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',backgroundImage:'linear-gradient(rgba(0,255,65,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,65,.018) 1px,transparent 1px)',backgroundSize:'36px 36px'}}/>
      <div style={{background:'var(--bg)',minHeight:'100vh',maxWidth:480,margin:'0 auto',position:'relative',paddingBottom:60}}>

        <AppHeader userProfile={userProfile} onAvatarClick={()=>setProfile(true)} onMenuClick={()=>setDrawer(true)}/>
        <Ticker coins={coins} bp={bp}/>

        <div style={{position:'relative',zIndex:1}}>
          <div style={{paddingTop:8}}>
            <SmartPromptBar coins={coins} bp={bp} fg={fg} page={page} navigate={navigate}/>
          </div>
          <AppRouter
            page={page} navigate={navigate} goBack={goBack} toast={toast}
            coins={coins} bp={bp} load={load} ts={ts} go={go}
            trend={trend} global={global} fg={fg}
            posts={posts} nLoad={nLoad}
            theme={theme} setTheme={setTheme}
            userProfile={userProfile} setUserProfile={setUserProfile}
          />
        </div>

        <BottomNav activeTab={activeTab} navToTab={navToTab} onPulse={()=>setPulse(true)}/>
        <Drawer       open={drawer}  onClose={()=>setDrawer(false)}  navigate={navigate}/>
        <PulsePanel   open={pulse}   onClose={()=>setPulse(false)}   navigate={navigate} coins={coins} bp={bp} fg={fg} page={page}/>
        <ProfilePanel open={profile} onClose={()=>setProfile(false)} navigate={navigate} theme={theme} setTheme={setTheme} userProfile={userProfile} setUserProfile={setUserProfile}/>

        {/* Toast */}
        <div style={{position:'fixed',top:68,left:'50%',transform:'translateX(-50%)',zIndex:999,background:'var(--panel2)',border:'1px solid var(--bb)',borderRadius:10,padding:'8px 16px',fontFamily:'var(--mono)',fontSize:11,color:'var(--g)',boxShadow:'0 0 20px rgba(0,255,65,.3)',whiteSpace:'nowrap',transition:'opacity .3s',opacity:toastMsg?1:0,pointerEvents:'none'}}>{toastMsg}</div>

      </div>
    </>
  );
}
