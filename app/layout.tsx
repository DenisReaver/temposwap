'use client';

import './globals.css';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const config = createConfig({
  chains: [
    {
      id: 4217,
      name: 'Tempo Mainnet',
      nativeCurrency: {
        name: 'Tempo',
        symbol: 'TEMPO',
        decimals: 18,
      },
      rpcUrls: {
        default: { http: ['https://rpc.tempo.xyz'] },
      },
      blockExplorers: {
        default: { name: 'Tempo Explorer', url: 'https://explore.mainnet.tempo.xyz' },
      },
    },
  ],
  transports: {
    4217: http('https://rpc.tempo.xyz'),
  },
  connectors: [
    injected(),
  ],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-black">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}