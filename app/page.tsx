'use client';

import { useState } from 'react';
import SwapPathToOther from '@/components/SwapPathToOther';
import SwapOtherToPath from '@/components/SwapOtherToPath';

export default function Home() {
  const [direction, setDirection] = useState<'path-to-stable' | 'stable-to-path'>('path-to-stable');

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-bold tracking-tighter mb-2">TempoSwap</h1>
          <p className="text-gray-400 text-lg">Fast stablecoin swaps on Tempo</p>
        </div>

        {/* Переключатель направлений */}
        <div className="flex bg-zinc-900 rounded-2xl p-1 mb-8 shadow-inner">
          <button
            onClick={() => setDirection('path-to-stable')}
            className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
              direction === 'path-to-stable'
                ? 'bg-white text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            pathUSD → Stable
          </button>
          <button
            onClick={() => setDirection('stable-to-path')}
            className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
              direction === 'stable-to-path'
                ? 'bg-white text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Stable → pathUSD
          </button>
        </div>

        {/* Своп компонент */}
        {direction === 'path-to-stable' ? <SwapPathToOther /> : <SwapOtherToPath />}

        {/* Footer с ссылками */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="text-xs text-gray-500">Powered by Tempo Enshrined DEX</div>
          
          <div className="flex gap-6 text-gray-400">
            <a 
              href="https://x.com/DenisArhipov6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5 text-sm"
            >
              <span>𝕏</span>
              <span>Twitter</span>
            </a>
            
            <a 
              href="https://farcaster.xyz/massonedisson.eth" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5 text-sm"
            >
              <span>🟪</span>
              <span>Farcaster</span>
            </a>
          </div>

          <div className="text-[10px] text-gray-600 mt-2">
            Made with ❤️ for Tempo Community
          </div>
        </div>
      </div>
    </main>
  );
}