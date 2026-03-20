/**
 * features/games/gameHelpers.js
 * Shared constants, card deck utils, and cricket commentary for all game engines.
 */

export const AVATARS_G = {
  'VeerBhat_Pro':'🦁','Khachi':'🐑','SatoshiAlpha':'🦊',
  'CryptoKhan':'🐯','MoonBet99':'🌙','You':'😎',
};

export const CARD_SUITS = ['♠','♥','♦','♣'];
export const CARD_VALS  = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
export const CARD_RANK  = {2:0,3:1,4:2,5:3,6:4,7:5,8:6,9:7,10:8,J:9,Q:10,K:11,A:12};

export const LC_SUITS = ['♠','♥','♦','♣'];
export const LC_VALS  = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
export const LC_RANK  = Object.fromEntries(LC_VALS.map((v,i)=>[v,i+1]));

export function drawRandCard() {
  const s=CARD_SUITS[Math.floor(Math.random()*4)];
  const v=CARD_VALS[Math.floor(Math.random()*13)];
  return {s,v,r:CARD_RANK[v]};
}
export function lcDraw() {
  const v=LC_VALS[Math.floor(Math.random()*13)];
  const s=LC_SUITS[Math.floor(Math.random()*4)];
  return {v,s,r:LC_RANK[v],key:v+s+Math.random()};
}
export function lcDeal5() { return Array.from({length:5},()=>lcDraw()); }
export function mkShuffledDeck() {
  const d=CARD_SUITS.flatMap(s=>CARD_VALS.map(v=>({s,v,r:CARD_RANK[v]})));
  for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}
  return d;
}
export function tNow() {
  return new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
}

// ── Cricket commentary pools (used by DiceCricketGame + EightBallGame) ──
export const CRICKET_COMMENTARY = {
  DOT:["Tight line and length. Batsman plays it straight back — dot ball.","Nipped back off the pitch, bat goes up in defence. Nothing doing.","Maiden-quality delivery. Beaten outside off. No run.","Pushed to mid-off, quick fielder pounces. Dot.","Full and straight. Yorker-length. Batsman digs it out. Dot ball.","Short of a length, no room to swing. Defended firmly. Dot.","Floated up outside off, watchful push — straight to cover. Dot.","Back of a hand slower ball. Batsman reads it late. Stopped dead.","Drifts in late, trapped on the pad — umpire signals dot.","Ripper of a delivery. Goes right through the gate! Somehow dot."],
  1:["Slight push for a single. Easy run.","Rolled off the pads to fine leg — one taken.","Driven firmly but straight to cover. Batsmen scramble one.","Quick single. Fielder fumbles! They get home.","Pushed wide of mid-on, a casual stroll for one.","Top-edged, drops safely — batsmen complete a single.","Squirted off the edge to third man. Single.","Soft clip off the hip — comfortable single to square leg.","Nudged past short leg. Single. Banter in the middle.","Floated down leg. Glanced away for a quick single."],
  2:["Driven to long-off and they come back for two!","Cracking shot to covers — raced away, batsmen run hard. Two.","Flat-batted to deep extra cover. Two comfortable runs.","Reverse sweep finds the boundary rope short. Two taken.","Edged through gully — they pinch two!","Good running! Mid-wicket boundary cut off. Two runs.","Pulled hard, fielder dives — saves the boundary. Two.","Swept fine, slides away — two to backward square leg.","Inside edge to fine leg. Two in a flash.","Planted down the ground, direct hit would've been out. Two."],
  4:["Like a tracer bullet through the covers — FOUR! Magnificent!","Crashing drive! Split the gap at extra cover. FOUR!","Slashed over point! Races away. FOUR runs!","Flicked off the pads through midwicket. FOUR!","Perfect timing. Just bisected mid-off and extra cover. FOUR!","Cut ferociously past point — FOUR! The crowd erupts!","Driven on the up through cover — that's a boundary!","Glanced fine — keeper dives but can't stop it. FOUR!","Sweetest of drives! Barely a sound off the bat. FOUR!","Reverse sweep! Beats short third man. FOUR!"],
  6:["That was a HUGE SIX! Into the stands! You predicted it!","MAXIMUM! Towering hit over long-on. Ridiculous power!","Back of a length and he's LAUNCHED it! SIX!","Switch hit! Over deep cover — SIX! Genius batting!","Helium-infused! That's gone for a monstrous SIX!","Slog sweep! Over deep square leg — SIX!","Drills it straight back over the bowler. SIX! Don't mess.","Inside out over extra cover — exceptional SIX!","Reverse slog to cow corner! SIX! Unconventional but brilliant!","Gets under it, flat-batted swing — SIX over mid-wicket!"],
  WICKET:["Inswinging yorker! Stumps broken! WICKET!","Caught in the deep! Mistimed loft — OUT!","Bowled! Went through the gate. TIMBER!","LBW! Plumb in front — finger goes up. OUT!","Caught behind! Thin edge. Keeper ecstatic. WICKET!","Stumped! Down the track and missed — OUT!","Run out! Direct hit! Didn't even dive. GONE!","Top-edged and taken at fine leg! WICKET!","Hit wicket! Backed into his stumps in despair. OUT!","Caught at slip! Beautiful away-swinger. Gone!"],
};

export const PREDICTION_RESULT_MSG = {
  DOT:{c:["Rock solid defence. You called it!","Nothing doing — just as you predicted.","Dots win matches. You knew."],w:["Thought it'd be quiet. Cricket had other ideas.","That dot slipped away! Try again.","Even dots can surprise. Lesson learned."]},
  1:{c:["One run — steady accumulation. Your read was exact.","Quick single! You called the rotation.","Captain's cricket. You think like a pro."],w:["Thought it'd trickle for one — it didn't.","Single evaded your read this time.","Cricket whispered differently today."]},
  2:{c:["Two runs! Great placement — you nailed it.","Running between wickets — sharp read!","Good cricket, good prediction. Two runs."],w:["Looked like two, turned out otherwise.","You thought two — cricket said no.","Tricky call. The field moved differently."]},
  4:{c:["Like a tracer bullet through the covers — FOUR! You saw it coming!","Boundary! Your prediction split the field perfectly.","FOUR! Instinct over analysis — brilliant call."],w:["Went close to four but the fielder was sharp.","Almost a boundary prediction — the rope disagreed.","Thought the boundary was on — it wasn't this time."]},
  6:{c:["SIX! You called the maximum! Supernatural read!","Into the stands — your prediction was airborne!","MAXIMUM predicted, maximum delivered. LEGEND!"],w:["Aimed for the clouds — didn't quite get there.","Almost six, but the fielder's fingertips stopped it.","You called the big one — cricket blinked first."]},
  WICKET:{c:["You called the wicket before it fell! Cold-blooded read!","GONE! Just like you predicted. Terrifying accuracy.","The stumps are shattered — you saw this coming!"],w:["Wicket was in the air — but it survived this ball.","Thought the batter was gone — they survived.","Close! Almost a wicket — your instinct was close."]},
};

export function getCricketCommentary(outcome) {
  const pool=CRICKET_COMMENTARY[outcome]||CRICKET_COMMENTARY.DOT;
  return pool[Math.floor(Math.random()*pool.length)];
}
export function getPredictionMsg(outcome, correct) {
  const pool=PREDICTION_RESULT_MSG[outcome]?.[correct?'c':'w']||[];
  return pool[Math.floor(Math.random()*pool.length)]||'';
}
