/**
 * services/firebase.js
 * ─────────────────────────────────────────────────────────────
 * Centralized Firebase configuration for CUTBAR Finance.
 *
 * SECURITY NOTE:
 * - These are PUBLIC Firebase config keys (not secret keys).
 * - Actual security is enforced via Firebase Security Rules.
 * - Never put private service account keys here.
 * - Firestore rules must restrict read/write to authenticated users only.
 *
 * FUTURE:
 * - Auth: phone OTP, email/password, Google OAuth
 * - Firestore: user profiles, exchange accounts, bank accounts, transactions
 * - Storage: KYC documents, avatars (encrypted at rest)
 * - Functions: server-side trade execution, KYC verification webhooks
 * ─────────────────────────────────────────────────────────────
 */

export const FIREBASE_CONFIG = {
  apiKey:            'AIzaSyAXcODKQsw_IgRX2kma70AV-qPyKEBg2vI',
  authDomain:        'cutbar-app.firebaseapp.com',
  projectId:         'cutbar-app',
  storageBucket:     'cutbar-app.firebasestorage.app',
  messagingSenderId: '813571297078',
  appId:             '1:813571297078:web:11700c3db2db5726ad6d97',
};

/**
 * Lazy-load Firebase from CDN (avoids bundle size hit).
 * Called once at app start or when BankPage mounts.
 */
export function loadFirebase() {
  return new Promise((resolve, reject) => {
    if (window._fbLoaded) return resolve(window._fbAuth);
    const s1 = document.createElement('script');
    s1.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js';
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js';
      s2.onload = () => {
        if (!window.firebase.apps.length) window.firebase.initializeApp(FIREBASE_CONFIG);
        window._fbAuth = window.firebase.auth();
        window._fbAuth.useDeviceLanguage();
        window._fbLoaded = true;
        resolve(window._fbAuth);
      };
      s2.onerror = reject;
      document.head.appendChild(s2);
    };
    s1.onerror = reject;
    document.head.appendChild(s1);
  });
}
