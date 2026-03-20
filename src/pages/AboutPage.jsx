import { useState } from 'react';
import { BackBar } from '../components/primitives';

const FAQS=[{q:'What is CUTBAR?',a:'CUTBAR is a BEP-20 token on Binance Smart Chain focused on low fees, security, and cross-chain capabilities. The name is a Kashmiri word for male sheep 🐑 — symbolizing resilience.'},{q:'How do I buy CUTBAR?',a:'You can buy CUTBAR on PancakeSwap by connecting your wallet and swapping BNB for CUTBAR. Always verify the contract address on BSCScan.'},{q:'Is the project audited?',a:'Yes. Our smart contracts are fully audited and verified on BSCScan. Liquidity is locked and community-overseen.'},{q:'How can I earn with CUTBAR?',a:'By holding, staking, participating in liquidity pools, playing cutPlay games, winning trading tournaments, and engaging in reward programs.'},{q:'What makes CUTBAR different?',a:'Our strong cultural roots, transparent operations, fully functional DeFi ecosystem, and focus on real-world adoption set us apart from the noise.'},{q:'What is CUTBAR Finance?',a:'CUTBAR Finance is the full DeFi ecosystem: CUTPay (banking), cutPlay (games), cutTrade, cutScan, cutBot, cutInsure, cutLoan, and more — all in one app.'},{q:'What is CUTPay?',a:'CUTPay is the payment OS under CUTBAR Finance. Send money via UPI, open savings/FD/RD accounts, get instant loans, buy insurance, and scan QR codes.'}];

export default function AboutPage({ toast, onBack }) {
  const [tab,setTab]=useState('faq');const [open,setOpen]=useState(null);
  return(
    <div className="fu">
      <BackBar title="About CUTBAR 🐑" onBack={onBack}/>
      <div style={{display:'flex',gap:0,margin:'0 14px 14px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:12,overflow:'hidden'}}>
        {[['faq','FAQ'],['why','Why CUTBAR'],['coin','Coin Info'],['community','Community']].map(([t,l])=>(
          <div key={t} onClick={()=>setTab(t)} style={{flex:1,padding:'10px 4px',textAlign:'center',background:tab===t?'rgba(0,255,65,.1)':'transparent',borderBottom:tab===t?'2px solid var(--g)':'2px solid transparent',cursor:'pointer',fontSize:10,fontWeight:700,color:tab===t?'var(--g)':'var(--td)',fontFamily:'var(--body)',transition:'all .2s'}}>{l}</div>
        ))}
      </div>
      {tab==='faq'&&<div style={{display:'flex',flexDirection:'column',gap:8,padding:'0 14px 14px'}}>
        {FAQS.map((f,i)=>(
          <div key={i} style={{background:'var(--panel)',border:`1px solid ${open===i?'var(--bb)':'var(--b)'}`,borderRadius:12,overflow:'hidden',cursor:'pointer'}} onClick={()=>setOpen(open===i?null:i)}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px'}}>
              <span style={{fontSize:13,fontWeight:700,flex:1}}>{f.q}</span>
              <span style={{fontSize:14,color:'var(--g)',fontWeight:800,marginLeft:8}}>{open===i?'−':'+'}</span>
            </div>
            {open===i&&<div style={{padding:'0 14px 12px',fontSize:12,color:'var(--tm)',lineHeight:1.7,borderTop:'1px solid var(--b)'}}>{f.a}</div>}
          </div>
        ))}
      </div>}
      {tab==='why'&&<div style={{padding:'0 14px 14px'}}>
        <div style={{background:'linear-gradient(135deg,rgba(0,255,65,.08),rgba(0,255,65,.02))',border:'1px solid var(--bb)',borderRadius:14,padding:16,marginBottom:12}}>
          <div style={{fontSize:15,fontWeight:800,color:'var(--g)',marginBottom:8,fontFamily:'var(--display)',letterSpacing:1}}>Why Choose CUTBAR?</div>
          <div style={{fontSize:12,color:'var(--tm)',lineHeight:1.8}}>In a market full of noise, CUTBAR is a clear, grounded voice. We deliver:</div>
        </div>
        {[['⚡','Ultra-low fees','On every transaction across the ecosystem'],['🌐','Fast transfers','Cross-chain capabilities with BSC as base'],['🔍','Transparent tokenomics','Audited contracts, locked liquidity, public records'],['🐑','Cultural roots','Community-driven mission with real-world adoption'],['🔮','Future-ready','Global payment integrations in active development']].map(([ic,t,d])=>(
          <div key={t} style={{display:'flex',gap:12,padding:'12px 0',borderBottom:'1px solid var(--b)'}}>
            <span style={{fontSize:22,flexShrink:0}}>{ic}</span>
            <div><div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{t}</div><div style={{fontSize:11,color:'var(--td)'}}>{d}</div></div>
          </div>
        ))}
      </div>}
      {tab==='coin'&&<div style={{padding:'0 14px 14px'}}>
        <div style={{background:'var(--panel)',border:'1px solid var(--bb)',borderRadius:14,padding:16,marginBottom:12}}>
          <div style={{fontSize:15,fontWeight:800,color:'var(--g)',marginBottom:12,fontFamily:'var(--display)',letterSpacing:.5}}>CUTBAR COIN OVERVIEW</div>
          {[['Ticker','CUTBAR'],['Blockchain','Binance Smart Chain (BEP-20)'],['Supply Cap','100,000,000 CUTBAR'],['Current Price','$0.00 (Pre-Launch)'],['Market Cap','—'],['Security','Audited · Locked liquidity']].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--b)'}}>
              <span style={{fontSize:11,color:'var(--td)'}}>{k}</span>
              <span style={{fontSize:11,color:'var(--text)',fontWeight:700,fontFamily:'var(--mono)',textAlign:'right',maxWidth:'60%'}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{background:'rgba(255,59,92,.06)',border:'1px solid rgba(255,59,92,.2)',borderRadius:12,padding:12}}>
          <div style={{fontSize:11,color:'var(--red)',fontWeight:700,marginBottom:4}}>⚠️ Disclaimer</div>
          <div style={{fontSize:10,color:'var(--td)',lineHeight:1.7}}>CUTBAR is a decentralized project. Investments involve risk. Always DYOR before investing.</div>
        </div>
      </div>}
      {tab==='community'&&<div style={{padding:'0 14px 14px'}}>
        <div style={{textAlign:'center',padding:'20px 0 16px'}}>
          <div style={{fontSize:48,marginBottom:8}}>🐑</div>
          <div style={{fontSize:18,fontWeight:800,color:'var(--g)',fontFamily:'var(--display)',letterSpacing:.5,marginBottom:8}}>JOIN THE COMMUNITY</div>
          <div style={{fontSize:12,color:'var(--tm)',lineHeight:1.7}}>We are stronger together. Follow, share, and build with us.</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {[{icon:'✈️',n:'Telegram',sub:'Join our official channel',c:'#229ED9',fn:()=>toast('📱 t.me/cutbar')},{icon:'🐦',n:'Twitter / X',sub:'Latest updates & alpha',c:'#1DA1F2',fn:()=>toast('🐦 @cutbar')},{icon:'📝',n:'Medium',sub:'Articles & whitepaper',c:'#00AB6C',fn:()=>toast('📝 medium.com/cutbar')},{icon:'🔍',n:'BSCScan',sub:'View contract & transactions',c:'#ffd700',fn:()=>toast('🔍 bscscan.com → CUTBAR')}].map(s=>(
            <div key={s.n} onClick={s.fn} style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:12,padding:'12px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:40,height:40,borderRadius:11,background:s.c+'20',border:'1px solid '+s.c+'30',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{s.icon}</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{s.n}</div><div style={{fontSize:11,color:'var(--td)'}}>{s.sub}</div></div>
              <span style={{fontSize:16,color:'var(--td)'}}>›</span>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
}
