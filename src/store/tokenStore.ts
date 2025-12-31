import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DeployedToken, TokenConfig, WalletConnection } from '../types/token';

interface TokenState {
  // Wallet
  wallet: WalletConnection;
  rpcUrl: string;

  // Deployed tokens
  deployedTokens: DeployedToken[];

  // Current token being created
  currentConfig: TokenConfig | null;

  // Actions
  setWallet: (wallet: WalletConnection) => void;
  setRpcUrl: (url: string) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  addDeployedToken: (token: DeployedToken) => void;
  removeDeployedToken: (id: string) => void;
  updateTokenVerification: (address: string, verified: boolean) => void;
  setCurrentConfig: (config: TokenConfig | null) => void;
}

const defaultConfig: TokenConfig = {
  standard: 'ERC20',
  name: '',
  symbol: '',
  decimals: 18,
  initialSupply: '1000000',
  maxSupply: '',
  mintable: false,
  burnable: false,
  pausable: false,
  permit: false,
  votes: false,
  flashMint: false,
  snapshots: false,
  ownable: true,
  roles: false,
};

export const useTokenStore = create<TokenState>()(
  persist(
    (set, get) => ({
      wallet: {
        connected: false,
        address: null,
        chainId: null,
        balance: '0',
      },
      rpcUrl: 'http://localhost:8545',
      deployedTokens: [],
      currentConfig: null,

      setWallet: (wallet) => set({ wallet }),
      setRpcUrl: (url) => set({ rpcUrl: url }),

      connectWallet: async () => {
        const { rpcUrl } = get();

        try {
          // Simulate wallet connection (in real app, would use MetaMask or similar)
          const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_chainId',
              params: [],
              id: 1,
            }),
          });

          const data = await response.json();
          const chainId = parseInt(data.result, 16);

          set({
            wallet: {
              connected: true,
              address: '0x0000000000000000000000000000000000000000', // Placeholder
              chainId,
              balance: '0',
            },
          });
        } catch (err) {
          console.error('Failed to connect wallet:', err);
        }
      },

      disconnectWallet: () => {
        set({
          wallet: {
            connected: false,
            address: null,
            chainId: null,
            balance: '0',
          },
        });
      },

      addDeployedToken: (token) => {
        set((state) => ({
          deployedTokens: [token, ...state.deployedTokens],
        }));
      },

      removeDeployedToken: (id) => {
        set((state) => ({
          deployedTokens: state.deployedTokens.filter((t) => t.id !== id),
        }));
      },

      updateTokenVerification: (address, verified) => {
        set((state) => ({
          deployedTokens: state.deployedTokens.map((t) =>
            t.address === address ? { ...t, verified } : t
          ),
        }));
      },

      setCurrentConfig: (config) => set({ currentConfig: config }),
    }),
    {
      name: 'novacoin-token-dashboard',
      partialize: (state) => ({
        rpcUrl: state.rpcUrl,
        deployedTokens: state.deployedTokens,
      }),
    }
  )
);

export { defaultConfig };
