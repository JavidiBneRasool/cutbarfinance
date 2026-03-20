import { BackBar } from '../components/primitives';

export default function ComingSoonPage({ onBack }) {
  return (
    <div className="fu">
      <BackBar title="Coming Soon" onBack={onBack}/>
      <div style={{textAlign:'center',padding:'60px 20px'}}>
        <span style={{fontSize:48,display:'block',marginBottom:16}}>🚧</span>
        <span style={{fontSize:18,fontWeight:800,color:'var(--g)',display:'block',marginBottom:8}}>Phase 3 — In Progress</span>
        <span style={{fontSize:13,color:'var(--td)',lineHeight:1.8,display:'block'}}>BankPage, WalletPage, AccountPage, CutPlay and game engines are being extracted next.</span>
      </div>
    </div>
  );
}
