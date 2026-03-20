export const THEMES = {
  dark:{bg:'#020a05',bg2:'#040e07',bg3:'#071209',panel:'#091a0c',panel2:'#0c2212',g:'#00ff41',g2:'#00cc33',glow:'0 0 20px #00ff4150,0 0 40px #00ff4120',gold:'#ffd700',red:'#ff3b5c',cyan:'#00e5ff',orange:'#ff7a00',text:'#c8ffd4',td:'#2a5a34',tm:'#5a9a6a',b:'#0f2a18',bb:'#00ff4125',nav:'rgba(2,10,5,0.97)',header:'rgba(2,10,5,0.95)',card:'#091a0c',modal:'rgba(0,0,0,0.9)'},
  light:{bg:'#f0fff4',bg2:'#e8f5ec',bg3:'#dff0e4',panel:'#ffffff',panel2:'#f0fff4',g:'#00a028',g2:'#008020',glow:'0 0 20px #00a02830',gold:'#b8860b',red:'#dc143c',cyan:'#007a8a',orange:'#d4600a',text:'#0a2010',td:'#4a8a5a',tm:'#2a6a3a',b:'#c0e8c8',bb:'#00a02830',nav:'rgba(240,255,244,0.97)',header:'rgba(240,255,244,0.95)',card:'#ffffff',modal:'rgba(0,0,0,0.6)'}
};

export const ALL_SERVICES = [
  {iconKey:'cutpay',    label:'CUTPay',      page:'cutpay',           color:'#00e5ff'},
  {iconKey:'bank',      label:'Bank',        page:'bank',             color:'#00cc88'},
  {iconKey:'upi',       label:'CUTBAR UPI',  page:'cutbarupi',        color:'#9945ff'},
  {iconKey:'market',    label:'Markets',     page:'market',           color:'#00e5ff'},
  {iconKey:'trade',     label:'Trade',       page:'trade',            color:'#ffd700'},
  {iconKey:'updown',    label:'Up/Down',     page:'updown',           color:'#00e5ff'},
  {iconKey:'game',      label:'cutPlay',     page:'cutplay',          color:'#ff7a00'},
  {iconKey:'sword',     label:'Last Stand',  page:'laststand',        color:'#9945ff'},
  {iconKey:'trophy',    label:'Tournaments', page:'tournaments',      color:'#ffd700'},
  {iconKey:'token',     label:'CUTBAR',      page:'token',            color:'#00ff41'},
  {iconKey:'p2p',       label:'P2P',         page:'p2p',              color:'#00ff41'},
  {iconKey:'stake',     label:'Staking',     page:'stake_tournament', color:'#00cc88'},
  {iconKey:'earn',      label:'Earn',        page:'earn',             color:'#ffd700'},
  {iconKey:'wallet',    label:'Wallet',      page:'wallet',           color:'#00e5ff'},
  {iconKey:'nft',       label:'NFT',         page:'cutpay',           color:'#9945ff'},
  {iconKey:'ai',        label:'cutAI',       page:'chat',             color:'#00ff41'},
  {iconKey:'insurance', label:'Insurance',   page:'cutpay',           color:'#9945ff'},
  {iconKey:'loan',      label:'Loans',       page:'cutpay',           color:'#ff7a00'},
  {iconKey:'news',      label:'News',        page:'news',             color:'#ff3b5c'},
  {iconKey:'tax',       label:'Tax Reports', page:'cutpay',           color:'#ffd700'},
  {iconKey:'gift',      label:'Referrals',   page:'earn',             color:'#ff7a00'},
  {iconKey:'support',   label:'Support',     page:'support',          color:'#00cc88'},
  {iconKey:'about',     label:'About',       page:'about',            color:'#00cc88'},
  {iconKey:'send',      label:'Send',        page:'send',             color:'#00e5ff'},
];

export const CORE_ACTIONS = [
  {iconKey:'cutpay', label:'Pay',     page:'bank',   color:'#00e5ff', sub:'Send & receive'},
  {iconKey:'trade',  label:'Trade',   page:'trade',  color:'#ffd700', sub:'Buy & sell'},
  {iconKey:'earn',   label:'Yield',   page:'earn',   color:'#00ff41', sub:'Earn + Stake'},
  {iconKey:'game',   label:'Arena',   page:'fun',    color:'#ff7a00', sub:'Play & win'},
  {iconKey:'wallet', label:'Wallet',  page:'wallet', color:'#9945ff', sub:'Assets'},
  {iconKey:'market', label:'Markets', page:'market', color:'#00cc88', sub:'100+ coins'},
];

export const NAV6 = [
  {id:'home',   icon:'🏠', label:'Home'},
  {id:'market', icon:'📈', label:'Market'},
  {id:'trade',  icon:'⇅',  label:'Trade'},
  {id:'bank',   icon:'💳', label:'Pay'},
  {id:'fun',    icon:'⚔️', label:'Arena'},
  {id:'wallet', icon:'◈',  label:'Wallet'},
];
export const NAV_LEFT  = NAV6.slice(0, 3);
export const NAV_RIGHT = NAV6.slice(3);

export const TAB_MAP = {
  home:'home', market:'market', trade:'trade', swap:'trade',
  bank:'bank', fun:'fun', cutplay:'fun', updown:'fun', tournaments:'fun',
  stake_tournament:'fun', laststand:'fun', finance:'fun',
  cutpay:'bank', cutbarupi:'bank',
  about:'home', news:'home', wallet:'wallet', receive:'wallet',
  send:'wallet', p2p:'wallet', chat:'home', settings:'home',
  support:'home', token:'wallet', account:'wallet', earn:'fun',
  yield:'fun',
};

export const GKO  = 'https://api.coingecko.com/api/v3';
export const BWSS = 'wss://stream.binance.com:9443/stream';
export const ALT  = 'https://api.alternative.me/fng/';
export const RSS  = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/cryptocurrency&count=8';

export const SVC_ICONS = {
  cutpay:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  bank:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
  upi:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  market:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  trade:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  updown:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>,
  game:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4m-2-2v4"/><circle cx="16" cy="10" r="1" fill="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/></svg>,
  sword:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/></svg>,
  trophy:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  token:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  p2p:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  stake:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  ai:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/><circle cx="7.5" cy="14.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="14.5" r="1.5" fill="currentColor"/></svg>,
  insurance:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  loan:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  news:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>,
  about:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  send:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  earn:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  wallet:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  nft:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  gift:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
  tax:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  support: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
};
