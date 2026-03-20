import { useState } from 'react';

// ── GIFT_MSGS — exact from original App.js ──────────────────
const GIFT_MSGS={
  ROSE:    [(f)=>`🌹 ${f} sent you a Rose — "A rose for a radiant soul 🌹"`,
            (f)=>`🌹 ${f} gifted you a Rose — "Beauty deserves beauty 🌸"`,
            (f)=>`🌹 ${f} gave you a Rose — "Quietly saying: you're appreciated 🌹"`],
  CHILLY:  [(f)=>`🌶️ ${f} sent you a Chilly — "Too hot to handle? Thought so 😏"`,
            (f)=>`🌶️ ${f} gifted you a Chilly — "Things are heating up in here 🌶"`,
            (f)=>`🌶️ ${f} gave you a Chilly — "Spicy plays deserve spicy gifts 🔥"`],
  CROWN:   [(f)=>`👑 ${f} crowned you — "Royalty recognises royalty 👑"`,
            (f)=>`👑 ${f} sent you a Crown — "You played like a king today 🏆"`,
            (f)=>`👑 ${f} crowned you — "The room bows down 👑"`],
  ROCKET:  [(f)=>`🚀 ${f} sent you a Rocket — "To the moon and beyond! 🌙"`,
            (f)=>`🚀 ${f} gifted a Rocket — "Strap in, you're going places 🚀"`,
            (f)=>`🚀 ${f} launched a Rocket at you — "WAGMI 🚀🌕"`],
  TROPHY:  [(f)=>`🏆 ${f} sent you a Trophy — "You earned every bit of this 🏆"`,
            (f)=>`🏆 ${f} gifted a Trophy — "Hall of fame material right here 🥇"`,
            (f)=>`🏆 ${f} gave you a Trophy — "A champion's gift for a champion 🏆"`],
  SHEEP:   [(f)=>`🐑 ${f} sent you a CUTBAR Sheep — "The CUTBAR mascot — iconic 🐑"`,
            (f)=>`🐑 ${f} gifted a Sheep — "Baa-rilliant moves out there 🐑"`,
            (f)=>`🐑 ${f} gave you a Sheep — "Rare. Wooly. Unstoppable. 🐑"`],
  PIG:     [(f)=>`🐷 ${f} sent you a Pig — "Messy plays, aren't we? 🐷"`,
            (f)=>`🐷 ${f} gifted a Pig — "Rolling in pots like a pro 🐷"`,
            (f)=>`🐷 ${f} gave you a Pig — "Oink oink… you know what you did 🐷"`],
  DOG:     [(f)=>`🐶 ${f} gifted you a Dog — "Loyal to the pot until the end 🐶"`,
            (f)=>`🐶 ${f} sent a Dog — "Man's best card-picker 🐾"`,
            (f)=>`🐶 ${f} gave you a Dog — "Faithful plays deserve faithful friends 🐶"`],
  LIGHTNING:[(f)=>`⚡ ${f} struck you with Lightning — "Fast. Powerful. Unstoppable ⚡"`,
             (f)=>`⚡ ${f} sent Lightning — "Charged up and ready to win ⚡"`,
             (f)=>`⚡ ${f} electrified you — "You lit up the whole room ⚡"`],
  FIRE:    [(f)=>`🔥 ${f} sent you Fire — "You're on fire and everyone can see it 🔥"`,
            (f)=>`🔥 ${f} gifted Fire — "This player is simply unplayable 🔥"`,
            (f)=>`🔥 ${f} gave you Fire — "The heat you bring is unreal 🔥"`],
  RING:    [(f)=>`💍 ${f} sent you a Ring — "A circle of trust and respect 💍"`,
            (f)=>`💍 ${f} gifted a Ring — "Rare and precious, just like your luck 💍"`,
            (f)=>`💍 ${f} gave you a Ring — "Bound by the game, sealed by this ring 💍"`],
  DIAMOND: [(f)=>`💎 ${f} sent you a Diamond — "Rare. Precious. Unbreakable 💎"`,
            (f)=>`💎 ${f} gifted a Diamond — "Only diamonds for diamond hands 💎"`,
            (f)=>`💎 ${f} gave you a Diamond — "The most elite gift in the room 💎"`],
};

export function pickGiftMsg(key,from){
  const arr=GIFT_MSGS[key]||[(f)=>`🎁 ${f} sent you a gift`];
  return arr[Math.floor(Math.random()*arr.length)](from);
}

// ── GIFTS — exact from original App.js ──────────────────────
export const GIFTS={
  ROSE:      {emoji:'🌹', name:'Rose',      cost:100,     tier:'common',  msg:(f)=>pickGiftMsg('ROSE',f)},
  CHILLY:    {emoji:'🌶️', name:'Chilly',    cost:250,     tier:'common',  msg:(f)=>pickGiftMsg('CHILLY',f)},
  FIRE:      {emoji:'🔥', name:'Fire',      cost:500,     tier:'common',  msg:(f)=>pickGiftMsg('FIRE',f)},
  ROCKET:    {emoji:'🚀', name:'Rocket',    cost:1000,    tier:'rare',    msg:(f)=>pickGiftMsg('ROCKET',f)},
  SHEEP:     {emoji:'🐑', name:'Sheep',     cost:1500,    tier:'rare',    msg:(f)=>pickGiftMsg('SHEEP',f)},
  PIG:       {emoji:'🐷', name:'Pig',       cost:2000,    tier:'rare',    msg:(f)=>pickGiftMsg('PIG',f)},
  LIGHTNING: {emoji:'⚡', name:'Lightning', cost:3000,    tier:'rare',    msg:(f)=>pickGiftMsg('LIGHTNING',f)},
  DOG:       {emoji:'🐶', name:'Dog',       cost:5000,    tier:'epic',    msg:(f)=>pickGiftMsg('DOG',f)},
  TROPHY:    {emoji:'🏆', name:'Trophy',    cost:7500,    tier:'epic',    msg:(f)=>pickGiftMsg('TROPHY',f)},
  CROWN:     {emoji:'👑', name:'Crown',     cost:10000,   tier:'epic',    msg:(f)=>pickGiftMsg('CROWN',f)},
  RING:      {emoji:'💍', name:'Ring',      cost:25000,   tier:'legendary',msg:(f)=>pickGiftMsg('RING',f)},
  DIAMOND:   {emoji:'💎', name:'Diamond',   cost:1000000, tier:'legendary',msg:(f)=>pickGiftMsg('DIAMOND',f)},
};

// ── GiftMarketplace — exact from original App.js ─────────────
export function GiftMarketplace({open, onClose, onSend, balance}) {
  const [selectedGift, setSelectedGift] = useState(null);
  const [targetUser, setTargetUser] = useState('');
  if(!open) return null;
  const TIERS = {common:{label:'Common',color:'#aaa'},rare:{label:'Rare',color:'#00e5ff'},epic:{label:'Epic',color:'#9945ff'},legendary:{label:'Legendary',color:'#ffd700'}};

  const byTier = Object.entries(GIFTS).reduce((acc,[k,g])=>{
    if(!acc[g.tier]) acc[g.tier]=[];
    acc[g.tier].push({key:k,...g});
    return acc;
  },{});

  const handleSend = () => {
    if(!selectedGift) return;
    if(!targetUser.trim()) return;
    onSend(`/gift ${selectedGift.key.toLowerCase()} @${targetUser.replace('@','')}`);
    onClose();
  };

  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}}
      style={{position:'fixed',inset:0,zIndex:600,background:'rgba(0,0,0,.75)',backdropFilter:'blur(6px)'}}>
      <div style={{
        position:'absolute',bottom:0,left:'50%',transform:'translateX(-50%)',
        width:'100%',maxWidth:480,background:'var(--panel)',
        borderRadius:'20px 20px 0 0',borderTop:'1px solid var(--bb)',
        maxHeight:'88vh',display:'flex',flexDirection:'column',
        animation:'slideUp .28s cubic-bezier(.16,1,.3,1)',
      }}>
        {/* Handle */}
        <div style={{display:'flex',justifyContent:'center',padding:'10px 0 0'}}>
          <div style={{width:36,height:4,borderRadius:2,background:'var(--b)'}}/>
        </div>
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 18px 12px',borderBottom:'1px solid var(--b)'}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:'var(--text)'}}>🎁 Gift Marketplace</div>
            <div style={{fontSize:10,color:'var(--td)',fontFamily:'var(--mono)'}}>Balance: 🐑 {balance.toLocaleString()} CUTBAR</div>
          </div>
          <div onClick={onClose} style={{width:28,height:28,borderRadius:8,background:'rgba(255,255,255,.06)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:13,color:'var(--td)'}}>✕</div>
        </div>

        {/* Gift grid by tier */}
        <div style={{flex:1,overflowY:'auto',padding:'10px 14px'}}>
          {['common','rare','epic','legendary'].map(tier=>{
            const gifts = byTier[tier]||[];
            if(!gifts.length) return null;
            const tc = TIERS[tier];
            return (
              <div key={tier} style={{marginBottom:16}}>
                <div style={{fontSize:9,fontWeight:700,color:tc.color,fontFamily:'var(--mono)',letterSpacing:2,marginBottom:8,textTransform:'uppercase'}}>
                  {tc.label}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                  {gifts.map(g=>{
                    const isSelected = selectedGift?.key===g.key;
                    const canAfford = balance >= g.cost;
                    return (
                      <div key={g.key}
                        onClick={()=>canAfford&&setSelectedGift(isSelected?null:g)}
                        style={{
                          borderRadius:12,padding:'12px 8px',
                          background:isSelected?tc.color+'18':'var(--bg3)',
                          border:`2px solid ${isSelected?tc.color:canAfford?'var(--b)':'rgba(255,255,255,.04)'}`,
                          cursor:canAfford?'pointer':'not-allowed',
                          opacity:canAfford?1:.45,
                          textAlign:'center',
                          transition:'all .15s',
                        }}>
                        <div style={{fontSize:28,marginBottom:4}}>{g.emoji}</div>
                        <div style={{fontSize:11,fontWeight:700,color:'var(--text)',marginBottom:2}}>{g.name}</div>
                        <div style={{fontSize:9,color:tc.color,fontFamily:'var(--mono)',fontWeight:700}}>
                          🐑 {g.cost>=1000000?'1M':g.cost>=1000?(g.cost/1000)+'K':g.cost}
                        </div>
                        {isSelected&&<div style={{marginTop:4,fontSize:8,color:tc.color,fontFamily:'var(--mono)'}}>✓ Selected</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected gift + send form */}
        {selectedGift&&(
          <div style={{padding:'12px 14px',borderTop:'1px solid var(--b)',background:'var(--bg3)'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
              <span style={{fontSize:24}}>{selectedGift.emoji}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>{selectedGift.name}</div>
                <div style={{fontSize:10,color:TIERS[selectedGift.tier].color,fontFamily:'var(--mono)'}}>
                  🐑 {selectedGift.cost.toLocaleString()} CUTBAR · {TIERS[selectedGift.tier].label}
                </div>
              </div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <input
                value={targetUser}
                onChange={e=>setTargetUser(e.target.value)}
                placeholder="Username (without @)"
                style={{flex:1,background:'var(--bg)',border:'1px solid var(--b)',color:'var(--text)',fontFamily:'var(--body)',fontSize:13,borderRadius:10,padding:'9px 12px',outline:'none'}}
                onFocus={e=>e.target.style.borderColor='var(--g)'}
                onBlur={e=>e.target.style.borderColor='var(--b)'}
              />
              <button
                onClick={handleSend}
                disabled={!targetUser.trim()}
                style={{padding:'9px 16px',borderRadius:10,border:'none',cursor:targetUser.trim()?'pointer':'not-allowed',background:targetUser.trim()?`linear-gradient(135deg,${TIERS[selectedGift.tier].color}99,${TIERS[selectedGift.tier].color})`:'var(--b)',color:'#000',fontSize:12,fontWeight:700,flexShrink:0,opacity:targetUser.trim()?1:.5}}>
                Send 🎁
              </button>
            </div>
          </div>
        )}
        {!selectedGift&&(
          <div style={{padding:'12px 14px',borderTop:'1px solid var(--b)',textAlign:'center'}}>
            <span style={{fontSize:11,color:'var(--td)',fontFamily:'var(--mono)'}}>Tap a gift to select it, then choose who to send it to</span>
          </div>
        )}
      </div>
    </div>
  );
}
