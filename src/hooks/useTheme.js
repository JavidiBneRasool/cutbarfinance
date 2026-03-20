import { useEffect } from 'react';
import { THEMES } from '../constants';

export function useTheme(theme) {
  useEffect(() => {
    const T = THEMES[theme] || THEMES.dark;
    let el = document.getElementById('cb-css');
    if (!el) {
      el = document.createElement('style');
      el.id = 'cb-css';
      document.head.appendChild(el);
    }
    el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=JetBrains+Mono:wght@400;600;700&display=swap');
    html,body{background:${T.bg}!important;color:${T.text}!important;margin:0!important;padding:0!important;font-family:'DM Sans',sans-serif!important;}
    #root{background:${T.bg}!important;min-height:100vh!important;color:${T.text}!important;display:block!important;}
    html{--bg:${T.bg};--bg2:${T.bg2};--bg3:${T.bg3};--panel:${T.panel};--panel2:${T.panel2};--g:${T.g};--g2:${T.g2};--glow:${T.glow};--gold:${T.gold};--red:${T.red};--cyan:${T.cyan};--orange:${T.orange};--text:${T.text};--td:${T.td};--tm:${T.tm};--b:${T.b};--bb:${T.bb};--nav:${T.nav};--header:${T.header};--card:${T.card};--modal:${T.modal};--mono:'JetBrains Mono',monospace;--display:'DM Sans',sans-serif;--body:'DM Sans',sans-serif;}
    *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
    input,select,textarea{color-scheme:${theme};}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
    @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
    @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
    @keyframes pulseBreathe{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.4);opacity:.25}}
    @keyframes popIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:none}}
    .fu{animation:fadeUp .3s ease both;}
    .sl{animation:slideL .3s cubic-bezier(.16,1,.3,1);}
    @keyframes slideL{from{transform:translateX(100%)}to{transform:none}}
    ::-webkit-scrollbar{width:3px;height:3px;}
    ::-webkit-scrollbar-thumb{background:${T.bb};border-radius:2px;}
    ::-webkit-scrollbar-track{background:transparent;}
    `;
    document.documentElement.style.cssText = `background:${T.bg};color:${T.text};`;
    if (document.body)
      document.body.style.cssText = `background:${T.bg}!important;color:${T.text}!important;margin:0;padding:0;min-height:100vh;`;
  }, [theme]);
}
