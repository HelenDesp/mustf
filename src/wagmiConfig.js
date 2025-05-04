import { configureChains, createConfig } from 'wagmi';
import { base } from '@wagmi/core/chains';
import { publicProvider } from '@wagmi/core/providers/public';
import { injected, walletConnect } from '@wagmi/connectors';

// Configure chains & providers
const { chains, publicClient } = configureChains(
  [base],
  [publicProvider()]
);

// Create wagmi config with Injected (MetaMask) and WalletConnect v2
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    injected({ chains, options: { name: 'Injected' } }),
    walletConnect({
      chains,
      options: {
        projectId: '4a489f38e57beea61afffc11e3d21ffe',
      },
    }),
  ],
  publicClient,
});
