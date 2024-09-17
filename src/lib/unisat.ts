export interface UnisatAPI {
  getAccounts: () => Promise<string[]>;
  requestAccounts: () => Promise<string[]>;
  getNetwork: () => Promise<string>;
  getPublicKey: () => Promise<string>;
  getBalance: () => Promise<{ confirmed: number; unconfirmed: number; total: number }>;
  signMessage: (message: string, type: 'ecdsa' | 'bip322-simple') => Promise<string>;
  signPsbt: (psbtHex: string) => Promise<string>;
  getBitcoinUtxos: () => Promise<{ txid: string; vout: number; satoshis: number; scriptPk: string }[]>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void; // Added removeListener method
}