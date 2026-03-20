import { useState, useCallback } from 'react';
import { TAB_MAP } from '../constants';

export function useNavigation() {
  const [history, setHistory] = useState(['home']);

  const page      = history[history.length - 1];
  const activeTab = TAB_MAP[page] || 'home';

  const navigate  = useCallback(p  => { setHistory(h => h[h.length - 1] === p ? h : [...h, p]); }, []);
  const goBack    = useCallback(()  => setHistory(h => h.length <= 1 ? h : h.slice(0, -1)), []);
  const navToTab  = useCallback(id => { setHistory([id]); }, []);

  return { page, activeTab, navigate, goBack, navToTab };
}
