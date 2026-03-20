export default function PulsePanel({ open, onClose, navigate, coins, bp, fg, page }) {
  if (!open) return null;
  const btc = bp['BTCUSDT'];
  const eth = bp['ETHUSDT'];
  const CTX_ACTIONS = {
    home: [
      { icon:'📈', label:'Buy BTC',    sub:btc?`$${btc.price.toLocaleString('en',{maximumFractionDigits:0})}`:'Live price', page:'trade',  color:'#ffd700' },
      { icon:'💰', label:'Earn 18%',   sub:'APY on idle funds',   page:'earn',   color:'#00ff41' },
      { icon:'⚔️', label:'Join Arena', sub:'127 players live',    page:'fun',    color:'#ff7a00' },
      { icon:'🔥', label:'Trending',   sub:'Top movers now',      page:'market', color:'#ff3b5c' },
      { icon:'🤖', label:'Ask AI',     sub:'cutAI assistant',     page:'chat',   color:'#9945ff' },
      { icon:'🐑', label:'CUTBAR',     sub:'Pre-launch token',    page:'token',  color:'#00ff41' },
    ],
    market: [
      { icon:'₿',  label:'Bitcoin',      sub:btc?`$${btc.price.toLocaleString('en',{maximumFractionDigits:0})}`:'BTC live', page:'trade', color:'#f7931a' },
      { icon:'Ξ',  label:'Ethereum',     sub:eth?`$${eth.price.toLocaleString('en',{maximumFractionDigits:0})}`:'ETH live', page:'trade', color:'#8d95d0' },
      { icon:'📈', label:'Top Gainers',  sub:'Sort by 24h gains',  page:'market', color:'#00ff41' },
      { icon:'📉', label:'Top Losers',   sub:'Biggest drops',      page:'market', color:'#ff3b5c' },
      { icon:'🆕', label:'New Listings', sub:'Fresh launches',     page:'market', color:'#00e5ff' },
      { icon:'⭐', label:'Watchlist',    sub:'Your saved coins',   page:'market', color:'#ffd700' },
    ],
    trade: [
      { icon:'🟢', label:'Quick Buy',  sub:'Market order BTC',  page:'trade',  color:'#00ff41' },
      { icon:'🔴', label:'Quick Sell', sub:'Close position',    page:'trade',  color:'#ff3b5c' },
      { icon:'⇄',  label:'Convert',   sub:'Swap any pair',     page:'swap',   color:'#ffd700' },
      { icon:'📊', label:'Chart',      sub:'Full TradingView',  page:'trade',  color:'#00e5ff' },
      { icon:'📋', label:'Order Book', sub:'Live depth',        page:'trade',  color:'#9945ff' },
      { icon:'🔮', label:'Up/Down',    sub:'Predict in 10s',   page:'updown', color:'#00e5ff' },
    ],
    bank: [
      { icon:'⬡',  label:'Scan & Pay', sub:'QR code payment',     page:'cutpay',    color:'#00e5ff' },
      { icon:'📤', label:'Send Money',  sub:'UPI / bank transfer', page:'bank',      color:'#00ff41' },
      { icon:'📥', label:'Request',     sub:'Get paid via UPI',    page:'cutbarupi', color:'#9945ff' },
      { icon:'💳', label:'CUTPay',      sub:'Payment gateway',     page:'cutpay',    color:'#00e5ff' },
      { icon:'📱', label:'UPI Setup',   sub:'user@cutbar',         page:'cutbarupi', color:'#ff7a00' },
      { icon:'🏦', label:'Bank A/C',    sub:'Linked accounts',     page:'bank',      color:'#00cc88' },
    ],
    fun: [
      { icon:'🔮', label:'Up/Down',     sub:'Fast prediction', page:'updown',          color:'#00e5ff' },
      { icon:'🃏', label:'LowCardOut',  sub:'12 players live', page:'cutplay',          color:'#ff7a00' },
      { icon:'🏆', label:'Tournament',  sub:'2d 4h left',      page:'tournaments',      color:'#ffd700' },
      { icon:'🎲', label:'Dice Cricket',sub:'8 online now',    page:'cutplay',          color:'#00e5ff' },
      { icon:'⚔️', label:'Last Stand',  sub:'Battle royale',  page:'laststand',        color:'#9945ff' },
      { icon:'🌾', label:'Stake',       sub:'Earn APY',        page:'stake_tournament', color:'#00cc88' },
    ],
    wallet: [
      { icon:'＋',  label:'Add Funds', sub:'Deposit crypto/fiat', page:'wallet', color:'#00ff41' },
      { icon:'📤', label:'Send',       sub:'Withdraw assets',     page:'send',   color:'#ff7a00' },
      { icon:'⇄',  label:'Swap',      sub:'Convert any pair',    page:'swap',   color:'#ffd700' },
      { icon:'💰', label:'Earn',       sub:'18.66% APY',          page:'earn',   color:'#00ff41' },
      { icon:'🤝', label:'P2P',        sub:'Trade peer-to-peer',  page:'p2p',    color:'#9945ff' },
      { icon:'📊', label:'Portfolio',  sub:'View analytics',      page:'wallet', color:'#00e5ff' },
    ],
  };
  const actions = CTX_ACTIONS[page] || CTX_ACTIONS.home;
  const QUICK = [
    { icon:'⬡',  label:'Scan QR',   action:() => onClose() },
    { icon:'₿',  label:'Buy BTC',   action:() => { navigate('trade'); onClose(); } },
    { icon:'⚔️', label:'Join Game', action:() => { navigate('cutplay'); onClose(); } },
    { icon:'💰', label:'Earn',      action:() => { navigate('earn'); onClose(); } },
  ];
  const PAGE_LABELS = { home:'Home', market:'Market', trade:'Trade', bank:'Pay', fun:'Arena', wallet:'Wallet' };
  return (
    <div onClick={e => { if (e.target===e.currentTarget) onClose(); }} style={{ position:'fixed', inset:0, zIndex:600, background:'rgba(0,0,0,.65)', backdropFilter:'blur(8px)' }}>
      <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:480, background:'var(--panel)', borderRadius:'24px 24px 0 0', border:'1px solid var(--bb)', borderBottom:'none', animation:'slideUp .32s cubic-bezier(.16,1,.3,1)', overflow:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 0' }}>
          <div style={{ width:36, height:4, borderRadius:2, background:'var(--b)' }} />
        </div>
        <div style={{ padding:'10px 20px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--b)' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--g)', animation:'pulse 1.5s infinite' }} />
              <span style={{ fontSize:14, fontWeight:800, color:'var(--text)', fontFamily:'var(--display)', letterSpacing:.5 }}>PULSE</span>
              <span style={{ fontSize:9, color:'var(--td)', fontFamily:'var(--mono)', background:'var(--bg3)', border:'1px solid var(--b)', borderRadius:20, padding:'2px 8px' }}>{PAGE_LABELS[page]||'Home'} context</span>
            </div>
            <div style={{ fontSize:10, color:'var(--td)', fontFamily:'var(--mono)' }}>Command center · Context-aware actions</div>
          </div>
          <div onClick={onClose} style={{ width:30, height:30, borderRadius:8, background:'var(--bg3)', border:'1px solid var(--b)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:12, color:'var(--td)' }}>✕</div>
        </div>
        <div style={{ padding:'14px 16px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          {actions.map((a, i) => (
            <div key={i} onClick={() => { navigate(a.page); onClose(); }}
              style={{ padding:'12px 10px', borderRadius:14, background:`${a.color}0e`, border:`1px solid ${a.color}28`, cursor:'pointer', transition:'all .15s', textAlign:'center' }}
              onMouseEnter={e => { e.currentTarget.style.background=`${a.color}1a`; e.currentTarget.style.transform='scale(1.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.background=`${a.color}0e`; e.currentTarget.style.transform='none'; }}>
              <div style={{ fontSize:22, marginBottom:5 }}>{a.icon}</div>
              <div style={{ fontSize:11, fontWeight:800, color:'var(--text)', lineHeight:1.2, marginBottom:2 }}>{a.label}</div>
              <div style={{ fontSize:8, color:'var(--td)', fontFamily:'var(--mono)', lineHeight:1.3 }}>{a.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ padding:'0 16px 12px', borderTop:'1px solid var(--b)', marginTop:4, paddingTop:12 }}>
          <div style={{ fontSize:8, color:'var(--td)', fontFamily:'var(--mono)', letterSpacing:2, marginBottom:10 }}>QUICK ACTIONS</div>
          <div style={{ display:'flex', gap:8 }}>
            {QUICK.map((q, i) => (
              <div key={i} onClick={q.action} style={{ flex:1, padding:'9px 6px', borderRadius:12, background:'var(--bg3)', border:'1px solid var(--b)', cursor:'pointer', textAlign:'center', transition:'all .15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='var(--bb)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='var(--b)'}>
                <div style={{ fontSize:16, marginBottom:3 }}>{q.icon}</div>
                <div style={{ fontSize:8, fontWeight:700, color:'var(--td)', fontFamily:'var(--mono)' }}>{q.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding:'0 16px 28px' }}>
          <div style={{ height:3, borderRadius:2, background:'linear-gradient(90deg,var(--red),var(--gold),var(--g))', opacity:.4, marginBottom:6 }} />
          <div style={{ fontSize:9, color:'var(--td)', fontFamily:'var(--mono)', textAlign:'center' }}>The PULSE sees all · Powered by live market data</div>
        </div>
      </div>
    </div>
  );
}
