import { BackBar, Btn } from '../components/primitives';

export default function StakeTournamentPage({ onBack, toast }) {
  return (
    <div className="fu">
      <BackBar title="Staking Rewards 🌾" onBack={onBack}/>
      <div style={{display:'flex',flexDirection:'column',gap:14,padding:14}}>
        <div style={{textAlign:'center',padding:'20px 0'}}>
          <span style={{fontSize:40,display:'block',marginBottom:12}}>🌾</span>
          <span style={{fontSize:18,fontWeight:800,color:'var(--g)',display:'block',fontFamily:'var(--display)',letterSpacing:.5,marginBottom:8}}>STAKE & EARN</span>
          <span style={{fontSize:13,color:'var(--tm)',lineHeight:1.8,display:'block'}}>Lock CUTBAR tokens for weekly pools. Highest staker wins 2x APY bonus. Launching Phase 4!</span>
        </div>
        <Btn v="outline" onClick={()=>toast('📧 Notify me when live!')}>NOTIFY ME</Btn>
      </div>
    </div>
  );
}
