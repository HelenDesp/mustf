import { configureChains, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

// Configure chains & providers
const { chains, publicClient } = configureChains(
  [base],
  [publicProvider()]
);

// Create wagmi config with Injected (MetaMask) and WalletConnect v2
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: { projectId: '4a489f38e57beea61afffc11e3d21ffe' },
    }),
  ],
  publicClient,
});
