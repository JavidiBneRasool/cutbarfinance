import { BackBar, Btn } from '../components/primitives';

export default function TournamentsPage({ onBack, toast }) {
  return (
    <div className="fu">
      <BackBar title="Trading Tournaments 🏆" onBack={onBack}/>
      <div style={{display:'flex',flexDirection:'column',gap:14,padding:14}}>
        <div style={{textAlign:'center',padding:'20px 0'}}>
          <span style={{fontSize:40,display:'block',marginBottom:12}}>🏆</span>
          <span style={{fontSize:18,fontWeight:800,color:'var(--gold)',display:'block',fontFamily:'var(--display)',letterSpacing:.5,marginBottom:8}}>WEEKLY TOURNAMENTS</span>
          <span style={{fontSize:13,color:'var(--tm)',lineHeight:1.8,display:'block'}}>Compete against CUTBAR traders. Top 3 profit % wins the CUTBAR prize pool. Next tournament starts Monday!</span>
        </div>
        <Btn v="gold" onClick={()=>toast('📧 Registered! Check email.')}>REGISTER NOW</Btn>
      </div>
    </div>
  );
}
