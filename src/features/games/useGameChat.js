import { useState, useCallback } from 'react';
import { tNow } from './gameHelpers';
import { GIFTS } from './gifts';

export function useGameChat(initialMsgs = [], myBalance = 5000) {
  const [chat,    setChat]    = useState(initialMsgs);
  const [balance, setBalance] = useState(myBalance);

  const addChat = useCallback((u, m, sys = false) => {
    setChat(c => [...c, {u, m, t: tNow(), sys}]);
  }, []);

  const handleSend = useCallback((text) => {
    if (!text.trim()) return;
    const lower = text.toLowerCase().trim();

    if (lower.startsWith('/tip ')) {
      const parts = text.split(/\s+/);
      const amt = parseInt(parts[1]);
      const target = (parts[2]||'').replace('@','');
      if (!target || isNaN(amt) || amt <= 0) { addChat('🔒','⚠️ Usage: /tip 50 @User',false); return; }
      if (balance < amt) { addChat('🔒','⚠️ Insufficient CUTBAR',false); return; }
      setBalance(b => b - amt);
      addChat('💸',`${amt} CUTBAR tipped to ${target} 💸`,true);
      addChat('🔒',`✅ You tipped ${amt} CUTBAR to ${target}`,false);
      return;
    }

    if (lower.startsWith('/rain ')) {
      const amt = parseInt(text.split(/\s+/)[1]);
      if (isNaN(amt) || amt <= 0) { addChat('🔒','⚠️ Usage: /rain 500',false); return; }
      if (balance < amt) { addChat('🔒','⚠️ Insufficient CUTBAR',false); return; }
      setBalance(b => b - amt);
      const count = 5; const share = Math.floor(amt/count);
      addChat('🌧',`🌧 Rain of ${amt} CUTBAR — ${share} each for ${count} users!`,true);
      addChat('🔒',`✅ Rain sent! ${amt} CUTBAR split among ${count}`,false);
      return;
    }

    if (lower.startsWith('/gift ')) {
      const parts = text.split(/\s+/);
      const giftKey = (parts[1]||'').toUpperCase();
      const target = (parts[2]||'').replace('@','');
      const gift = GIFTS[giftKey];
      if (!gift || !target) {
        const keys = Object.entries(GIFTS).map(([k,g]) => `${g.emoji}${k.toLowerCase()}`).join(' ');
        addChat('🔒',`⚠️ Usage: /gift rose @User  |  ${keys}`,false);
        return;
      }
      if (balance < gift.cost) { addChat('🔒',`⚠️ Need ${gift.cost.toLocaleString()} CUTBAR for ${gift.name}`,false); return; }
      setBalance(b => b - gift.cost);
      addChat(gift.emoji,`${gift.emoji} You gifted ${target} a ${gift.name} worth ${gift.cost.toLocaleString()} CUTBAR ❤️`,true);
      return;
    }

    addChat('You', text);
  }, [balance, addChat]);

  return { chat, addChat, handleSend, balance };
}
