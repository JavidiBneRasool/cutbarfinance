import { SVC_ICONS } from '../../constants';
import { useState } from 'react';

export const R = ({ children, gap = 8, align = 'center', justify = 'flex-start', wrap = false, style = {} }) =>
  <div style={{ display:'flex', alignItems:align, justifyContent:justify, gap, flexWrap:wrap?'wrap':'nowrap', ...style }}>{children}</div>;

export const C = ({ children, gap = 8, style = {} }) =>
  <div style={{ display:'flex', flexDirection:'column', gap, ...style }}>{children}</div>;

export const Txt = ({ children, size = 14, color = 'var(--text)', weight = 500, mono = false, style = {} }) =>
  <span style={{ fontSize:size, color, fontWeight:weight, fontFamily:mono?'var(--mono)':'var(--body)', lineHeight:1.4, ...style }}>{children}</span>;

export const Div = ({ m = '0 14px' }) =>
  <div style={{ height:1, background:'var(--b)', margin:m }} />;

export function Spin() {
  return <div style={{ width:16, height:16, border:'2px solid var(--b)', borderTop:'2px solid var(--g)', borderRadius:'50%', animation:'spin .7s linear infinite' }} />;
}

export function Bx({ children, color = 'green', style = {} }) {
  const m = {
    green:  { bg:'rgba(0,255,65,.1)',   c:'var(--g)',      b:'rgba(0,255,65,.22)' },
    gold:   { bg:'rgba(255,215,0,.1)',  c:'var(--gold)',   b:'rgba(255,215,0,.22)' },
    red:    { bg:'rgba(255,59,92,.1)',  c:'var(--red)',    b:'rgba(255,59,92,.22)' },
    cyan:   { bg:'rgba(0,229,255,.1)',  c:'var(--cyan)',   b:'rgba(0,229,255,.22)' },
    orange: { bg:'rgba(255,122,0,.1)',  c:'var(--orange)', b:'rgba(255,122,0,.22)' },
  };
  const c = m[color] || m.green;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'2px 8px', borderRadius:20, fontSize:10, fontFamily:'var(--mono)', fontWeight:700, background:c.bg, color:c.c, border:`1px solid ${c.b}`, ...style }}>
      {children}
    </span>
  );
}

export function Btn({ children, v = 'primary', onClick, style = {}, disabled = false }) {
  const base = { display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px 18px', borderRadius:11, border:'none', cursor:disabled?'not-allowed':'pointer', fontFamily:'var(--display)', fontSize:14, fontWeight:700, width:'100%', opacity:disabled?0.5:1, transition:'all .18s' };
  const vs = {
    primary: { ...base, background:'linear-gradient(135deg,var(--g2),var(--g))', color:'#000', boxShadow:'0 4px 18px rgba(0,255,65,.22)' },
    gold:    { ...base, background:'linear-gradient(135deg,#aa7700,var(--gold))', color:'#000' },
    outline: { ...base, background:'transparent', color:'var(--g)', border:'1px solid var(--bb)' },
    red:     { ...base, background:'linear-gradient(135deg,#aa0022,var(--red))', color:'#fff' },
    ghost:   { ...base, background:'rgba(0,255,65,.06)', color:'var(--g)', border:'1px solid var(--b)' },
    cyan:    { ...base, background:'linear-gradient(135deg,#006677,var(--cyan))', color:'#000' },
  };
  return <button style={vs[v]||vs.primary} onClick={onClick} disabled={disabled}>{children}</button>;
}

export function Input({ label, placeholder, value, onChange, type = 'text', suffix, style = {} }) {
  return (
    <C gap={5} style={style}>
      {label && <Txt size={10} color="var(--td)" mono={true} style={{ letterSpacing:1, textTransform:'uppercase' }}>{label}</Txt>}
      <div style={{ position:'relative' }}>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          style={{ background:'var(--bg3)', border:'1px solid var(--b)', color:'var(--text)', fontFamily:'var(--mono)', fontSize:13, borderRadius:9, padding:`11px ${suffix?'48px':14}px 11px 14px`, width:'100%', outline:'none', transition:'border-color .2s' }}
          onFocus={e => { e.target.style.borderColor='var(--g2)'; e.target.style.boxShadow='0 0 0 2px rgba(0,255,65,.08)'; }}
          onBlur={e  => { e.target.style.borderColor='var(--b)';  e.target.style.boxShadow='none'; }}
        />
        {suffix && <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'var(--td)', fontFamily:'var(--mono)', fontSize:11 }}>{suffix}</span>}
      </div>
    </C>
  );
}

export function BackBar({ title, onBack, right }) {
  return (
    <div style={{ display:'flex', alignItems:'center', padding:'10px 14px 8px', gap:10, background:'var(--bg)', minWidth:0, borderBottom:'1px solid var(--b)' }}>
      <div onClick={onBack}
        style={{ width:34, height:34, borderRadius:10, background:'rgba(0,0,0,.18)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, transition:'all .2s' }}
        onMouseEnter={e => { e.currentTarget.style.background='rgba(0,255,65,.12)'; e.currentTarget.style.borderColor='rgba(0,255,65,.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.background='rgba(0,0,0,.18)';    e.currentTarget.style.borderColor='rgba(255,255,255,.08)'; }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span style={{ flex:1, fontSize:16, fontWeight:700, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', minWidth:0, fontFamily:'var(--body)' }}>{title}</span>
      {right && <div style={{ flexShrink:0 }}>{right}</div>}
    </div>
  );
}

export function CoinIcon({ coin, size = 34, radius = 9 }) {
  const [err, setErr] = useState(false);
  const src = coin && coin.image || coin && coin.thumb || (coin && coin.id ? `https://assets.coingecko.com/coins/images/1/thumb/${coin.id}.png` : null);
  if (!err && src && src.startsWith('http')) {
    return <img src={src} alt={coin && coin.symbol || ''} style={{ width:size, height:size, borderRadius:radius, flexShrink:0, objectFit:'cover' }} onError={() => setErr(true)} />;
  }
  const colors = { btc:'#f7931a', eth:'#8d95d0', sol:'#14f195', bnb:'#f0b90b', ada:'#0033ad', dot:'#e6007a', matic:'#8247e5', avax:'#e84142', usdt:'#26a17b', usdc:'#2775ca', xrp:'#346aa9', link:'#2a5ada' };
  const syml = coin && coin.symbol ? coin.symbol.toLowerCase() : '';
  const bg   = colors[syml] || '#333';
  const letter = (coin && coin.symbol || '?')[0].toUpperCase();
  return (
    <div style={{ width:size, height:size, borderRadius:radius, background:`${bg}22`, border:`1px solid ${bg}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*.45, fontWeight:800, color:bg, flexShrink:0, fontFamily:'var(--display)' }}>
      {letter}
    </div>
  );
}

export function SvcIcon({ k, color, size = 22 }) {
  
  const ic = SVC_ICONS[k];
  if (!ic) return <span style={{ fontSize:size }}>{k}</span>;
  return <div style={{ width:size, height:size, color }}>{ic}</div>;
}
