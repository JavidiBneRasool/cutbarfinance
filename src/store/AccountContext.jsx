/**
 * store/AccountContext.jsx
 * ─────────────────────────────────────────────────────────────
 * Manages the three separate CUTBAR account types.
 * Each operates independently with its own balance, limits, rules.
 *
 * PHASE 6+ IMPLEMENTATION:
 * - exchangeAccount: REST API to CUTBAR exchange backend
 * - web3Wallet: ethers.js / web3.js + local encrypted keystore
 * - bankAccount: Firebase Firestore + CUTBAR Banking API
 * ─────────────────────────────────────────────────────────────
 */

import { createContext, useContext, useState } from 'react';

const AccountContext = createContext(null);

const EMPTY_EXCHANGE = {
  connected: false, uid: null,
  balances: {}, openOrders: [], tradeHistory: [],
};

const EMPTY_WEB3 = {
  connected: false, address: null, network: 'BSC',
  balances: {}, txHistory: [], isHardwareWallet: false,
};

const EMPTY_BANK = {
  connected: false, accountNumber: null, upiId: null,
  kycLevel: 0, balance: 0, transactions: [],
  fd: [], rd: [], loans: [], insurance: [],
};

export function AccountProvider({ children }) {
  const [exchangeAccount, setExchangeAccount] = useState(EMPTY_EXCHANGE);
  const [web3Wallet,       setWeb3Wallet]       = useState(EMPTY_WEB3);
  const [bankAccount,      setBankAccount]      = useState(EMPTY_BANK);

  return (
    <AccountContext.Provider value={{
      exchangeAccount, setExchangeAccount,
      web3Wallet,      setWeb3Wallet,
      bankAccount,     setBankAccount,
    }}>
      {children}
    </AccountContext.Provider>
  );
}

export const useAccounts = () => useContext(AccountContext);
