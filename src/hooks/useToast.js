import { useState, useRef, useCallback } from 'react';

export function useToast() {
  const [toastMsg, setToastMsg] = useState('');
  const timerRef = useRef(null);

  const toast = useCallback(msg => {
    setToastMsg(msg);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToastMsg(''), 3000);
  }, []);

  return { toastMsg, toast };
}
