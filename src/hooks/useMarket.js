import { useState, useEffect, useCallback } from 'react';
import { GKO, BWSS, ALT, RSS } from '../constants';

export function useMarket() {
  const [coins, setCoins] = useState([]);
  const [load,  setLoad]  = useState(true);
  const [ts,    setTs]    = useState(null);

  const go = useCallback(function () {
    fetch(GKO + '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h,7d')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) { setCoins(d); setTs(new Date()); } })
      .catch(function () {})
      .finally(function () { setLoad(false); });
  }, []);

  useEffect(function () {
    go();
    const t = setInterval(go, 60000);
    return function () { clearInterval(t); };
  }, [go]);

  return { coins, load, ts, go };
}

export function useTrend() {
  const [data, setData] = useState({ trending: [] });
  useEffect(() => {
    fetch(GKO + '/search/trending')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && d.coins) setData({ trending: d.coins.map(c => c.item) }); })
      .catch(() => {});
  }, []);
  return data;
}

export function useGlobal() {
  const [g, setG] = useState(null);
  useEffect(() => {
    const fg = () =>
      fetch(`${GKO}/global`)
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d && d.data) setG(d.data); })
        .catch(() => {});
    fg();
    const t = setInterval(fg, 120000);
    return () => clearInterval(t);
  }, []);
  return g;
}

export function useBinance(syms = ['btcusdt','ethusdt','solusdt','bnbusdt','adausdt','dotusdt','maticusdt','avaxusdt']) {
  const [p, setP] = useState({});
  useEffect(() => {
    const streams = syms.map(s => `${s}@ticker`).join('/');
    let ws;
    try {
      ws = new WebSocket(`${BWSS}?streams=${streams}`);
      ws.onmessage = e => {
        try {
          const { data } = JSON.parse(e.data);
          if (data) setP(prev => ({ ...prev, [data.s]: { price: +data.c, change: +data.P, high: +data.h, low: +data.l, vol: +data.v } }));
        } catch {}
      };
    } catch {}
    return () => { try { ws && ws.close(); } catch {} };
  }, []); // eslint-disable-line
  return p;
}

export function useFG() {
  const [d, setD] = useState(null);
  useEffect(() => {
    fetch(ALT)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && d.data[0]) setD(d.data[0]); })
      .catch(() => {});
  }, []);
  return d;
}

export function useNews() {
  const [posts, setPosts] = useState([]);
  const [load,  setLoad]  = useState(true);
  useEffect(() => {
    fetch(RSS)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && d.items) setPosts(d.items); })
      .catch(() => {})
      .finally(() => setLoad(false));
  }, []);
  return { posts, load };
}
