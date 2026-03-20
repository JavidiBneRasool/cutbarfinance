/**
 * store/AuthContext.jsx
 * ─────────────────────────────────────────────────────────────
 * Global authentication state for CUTBAR Finance.
 *
 * ARCHITECTURE NOTE — Three separate account types:
 *
 * 1. EXCHANGE ACCOUNT  (like Binance / KuCoin / OKX)
 *    - Spot trading, futures, orderbook
 *    - Authenticated via email + 2FA
 *    - Stored: Firestore users/{uid}/exchange
 *
 * 2. WEB3 WALLET  (like MetaMask / TrustWallet / Binance Wallet)
 *    - Non-custodial BSC/ETH/SOL wallet
 *    - Authenticated via seed phrase (never stored on server)
 *    - Private key encrypted locally (device-side)
 *    - Stored: encrypted localStorage + optional Firestore backup
 *
 * 3. BANK ACCOUNT  (CUTBAR FINANCE BANK)
 *    - UPI, IMPS, NEFT, RTGS, International, Business, FD, RD, Insurance
 *    - Authenticated via phone OTP (Firebase Auth) + KYC
 *    - Stored: Firestore users/{uid}/bank
 *
 * All three can be linked under one CUTBAR profile (uid),
 * but they operate with separate balances, limits, and audit trails.
 *
 * PHASE 6 IMPLEMENTATION:
 * - Replace placeholder state with real Firebase Auth listener
 * - Add JWT session management
 * - Add device fingerprinting for fraud prevention
 * ─────────────────────────────────────────────────────────────
 */

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { uid, email, phone, displayName, avatar }
  const [loading, setLoading] = useState(false);

  // Phase 6: replace with Firebase onAuthStateChanged listener
  const signIn  = async (credentials) => { /* TODO: Firebase signIn */ };
  const signOut = async () => { setUser(null); };
  const signUp  = async (data) => { /* TODO: Firebase createUser + Firestore profile */ };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
