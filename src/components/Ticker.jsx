import { useMemo } from 'react';
import { R, Txt, CoinIcon } from './primitives';

export default function Ticker({ coins, bp }) {
  const items = useMemo(() => {
    const base = coins.slice(0, 12).map(c => {
      const live = bp[`${c.symbol.toUpperCase()}USDT`];
      return { ...c, lp:(live&&live.price)||c.current_price||0, lc:(live&&live.change)||c.price_change_percentage_24h||0 };
    });
    return [
      { symbol:'CUTBAR', name:'CUTBAR', lp:0, lc:0, image:'🐑', isFake:true, notListed:true },
      ...base,
      { symbol:'CUTBAR', name:'CUTBAR', lp:0, lc:0, image:'🐑', isFake:true, notListed:true },
      ...base,
    ];
  }, [coins, bp]);

  return (
    <div style={{ overflow:'hidden', background:'rgba(0,255,65,.02)', borderBottom:'1px solid var(--b)', padding:'5px 0', flexShrink:0 }}>
      <div style={{ display:'flex', gap:28, width:'max-content', padding:'0 14px', animation:'ticker 40s linear infinite' }}>
        {items.map((t, i) => (
          <R key={i} gap={5} style={{ whiteSpace:'nowrap', alignItems:'center' }}>
            {t.isFake ? <span style={{ fontSize:11 }}>🐑</span> : <CoinIcon coin={t} size={14} radius={3} />}
            <Txt size={10} color="var(--td)" mono={true}>{t.symbol.toUpperCase()}</Txt>
            {t.notListed
              ? <Txt size={9} color="var(--td)" mono={true} style={{ opacity:.55 }}>Pre-Launch</Txt>
              : <>
                  <Txt size={10} color="var(--text)" mono={true} weight={600}>${t.lp<1?(t.lp||0).toFixed(4):t.lp.toLocaleString('en',{maximumFractionDigits:2})}</Txt>
                  <Txt size={10} color={t.lc>=0?'var(--g)':'var(--red)'} mono={true}>{t.lc>=0?'+':''}{(t.lc||0).toFixed(1)}%</Txt>
                </>
            }
          </R>
        ))}
      </div>
    </div>
  );
}
