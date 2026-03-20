import { R, Txt, Bx, Spin } from '../components/primitives';
import { BackBar } from '../components/primitives';

const FALLBACK=[{title:'Bitcoin Surges Past $67K — Institutional Buying at Record Levels',pubDate:'2026-03-16',categories:['Bitcoin','Markets'],description:'Major institutions added over $2.3B in BTC exposure this week.'},{title:'CUTBAR Token Up 12% — Community Grows to 1,284 Holders',pubDate:'2026-03-16',categories:['CUTBAR','BSC'],description:'The CUTBAR ecosystem token records strong gains as the app launches.'},{title:'DeFi TVL Crosses $120 Billion Milestone',pubDate:'2026-03-15',categories:['DeFi'],description:'Total value locked in DeFi protocols crosses $120B for the first time in 2026.'},{title:'BNB Smart Chain Records 10M Daily Transactions',pubDate:'2026-03-15',categories:['BSC'],description:'BSC sets new records with low gas fees and fast transaction speeds.'},{title:'P2P Crypto Regulations in India: New Guidelines',pubDate:'2026-03-14',categories:['India','Regulation'],description:'New RBI guidelines for P2P crypto trading platforms issued.'}];

export default function NewsPage({ posts, load, onBack }) {
  const news=posts.length>0?posts:FALLBACK;
  return(
    <div className="fu">
      <BackBar title="Crypto News" onBack={onBack} right={<R gap={5}><Bx color="green" style={{fontSize:8}}>● Medium</Bx></R>}/>
      {load?<R justify="center" style={{padding:32,gap:10}}><Spin/><Txt size={12} color="var(--td)" mono={true}>Loading from Medium...</Txt></R>
      :news.map((p,i)=>(
        <div key={i} onClick={()=>p.link&&p.link!=='#'?window.open(p.link,'_blank'):null} style={{margin:'0 14px 10px',background:'var(--panel)',border:'1px solid var(--b)',borderRadius:13,overflow:'hidden',cursor:'pointer'}}>
          {p.thumbnail&&p.thumbnail!=='null'&&<img src={p.thumbnail} alt="" style={{width:'100%',height:130,objectFit:'cover'}} onError={e=>e.target.style.display='none'}/>}
          <div style={{padding:13}}>
            <R gap={6} style={{marginBottom:7,flexWrap:'wrap'}}>
              {(p.categories||[]).slice(0,3).map(c=><Bx key={c} color="green" style={{fontSize:8}}>{c}</Bx>)}
              <Txt size={9} color="var(--td)" mono={true} style={{marginLeft:'auto'}}>{new Date(p.pubDate||Date.now()).toLocaleDateString('en',{month:'short',day:'numeric'})}</Txt>
            </R>
            <Txt size={13} weight={700} style={{display:'block',lineHeight:1.5,marginBottom:5}}>{p.title}</Txt>
            <Txt size={11} color="var(--tm)" style={{display:'block',lineHeight:1.6}}>{(p.description||'').replace(/<[^>]*>/g,'').slice(0,110)}...</Txt>
            <Txt size={10} color="var(--g)" mono={true} style={{display:'block',marginTop:7}}>Read on Medium →</Txt>
          </div>
        </div>
      ))}
    </div>
  );
}
