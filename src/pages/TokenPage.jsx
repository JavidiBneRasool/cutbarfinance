import { BackBar, Btn, Bx } from '../components/primitives';

export default function TokenPage({ toast, onBack }) {
  return(
    <div className="fu">
      <BackBar title="CUTBAR Token" onBack={onBack}/>
      <div style={{padding:'0 20px 20px',textAlign:'center'}}>
        <span style={{fontSize:56,display:'block',marginBottom:10,animation:'float 3s ease-in-out infinite'}}>🐑</span>
        <span style={{fontFamily:'var(--display)',fontSize:32,color:'var(--g)',letterSpacing:.5,display:'block',marginBottom:6,textShadow:'0 0 20px rgba(0,255,65,.5)'}}>CUTBAR</span>
        <div style={{display:'flex',gap:6,justifyContent:'center',flexWrap:'wrap',marginBottom:16}}>
          <Bx color="green">CUTBAR</Bx>
          <Bx color="gold">BEP-20</Bx>
          <Bx color="cyan">BSC</Bx>
        </div>
        <div style={{background:'linear-gradient(135deg,rgba(0,255,65,.08),rgba(0,255,65,.02))',border:'1px solid rgba(0,255,65,.22)',borderRadius:14,padding:16,marginBottom:16,textAlign:'left'}}>
          {[['Price','$0.00 (Pre-Launch)'],['Status','Not Yet Listed'],['Market Cap','—'],['Holders','—'],['Total Supply','100,000,000'],['Decimals','18'],['Network','BSC (BEP-20)'],['Symbol','CUTBAR']].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',marginBottom:8,paddingBottom:8,borderBottom:'1px solid rgba(0,255,65,.08)'}}>
              <span style={{fontSize:12,color:'var(--td)',fontFamily:'var(--mono)'}}>{k}</span>
              <span style={{fontSize:12,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
        <span style={{fontSize:13,color:'var(--tm)',lineHeight:1.8,display:'block',marginBottom:16}}>
          <strong style={{color:'var(--g)'}}>CUTBAR</strong> is a Kashmiri word for a <strong style={{color:'var(--gold)'}}>male sheep</strong> — symbolizing resilience and strength. Built on BSC by KHAN from Kashmir 🌿
        </span>
        <div style={{background:'var(--panel)',border:'1px solid var(--b)',borderRadius:14,padding:16,marginBottom:16,textAlign:'left'}}>
          <div style={{fontSize:9,color:'var(--td)',fontFamily:'var(--mono)',letterSpacing:3,marginBottom:12}}>TOKENOMICS · 100M TOTAL SUPPLY</div>
          {[['🌱 Ecosystem & Development','40%'],['🔒 Liquidity Pool (Locked)','25%'],['👥 Community & Rewards','20%'],['🏢 Team (2yr vesting)','10%'],['🔥 Burn Reserve','5%']].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',marginBottom:8,alignItems:'center'}}>
              <span style={{fontSize:12,color:'var(--text)'}}>{k}</span>
              <span style={{fontSize:12,color:'var(--g)',fontFamily:'var(--mono)',fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <Btn v="primary" onClick={()=>window.open('https://pancakeswap.finance','_blank')}>🥞 Buy on PancakeSwap</Btn>
          <Btn v="outline"  onClick={()=>window.open('https://bscscan.com','_blank')}>🔍 View on BSCScan</Btn>
          <Btn v="ghost"    onClick={()=>window.open('https://cutbar.in/whitepaper','_blank')}>📄 Read Whitepaper</Btn>
        </div>
      </div>
    </div>
  );
}
