'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ArrowDownIcon } from '@heroicons/react/24/solid';
import { parseUnits } from 'viem';
import { ethers } from 'ethers';

const TOKENS = {
  USDC: "0x20c000000000000000000000b9537d11c60e8b50",
  USDT0: "0x20c00000000000000000000014f22ca97301eb73",
  capUSD: "0x20c0000000000000000000000520792dcccccccc",
};

const PATHUSD = "0x20C0000000000000000000000000000000000000";
const DEX_ADDRESS = "0xDEc0000000000000000000000000000000000000";

export default function SwapPathToOther() {
  const { address, isConnected } = useAccount();
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('10');
  const [isSwapping, setIsSwapping] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        window.location.reload();
      } catch (error) {
        alert('Не удалось подключить кошелёк');
      }
    } else {
      alert('Установите MetaMask или Rabby Wallet');
    }
  };

  const handleSwap = async () => { /* ... твой рабочий код handleSwap ... */ };

  if (!isClient) return <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 h-[500px]" />;

  return (
    <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">pathUSD → Stable</h2>
        {isConnected && <div className="text-sm text-green-400">Connected</div>}
      </div>

      {/* Основной блок свопа */}
      <div className="space-y-3">
        {/* You Pay */}
        <div className="bg-zinc-800 rounded-2xl p-5">
          <div className="text-sm text-gray-400 mb-3">You pay</div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-4xl font-medium outline-none flex-1"
              placeholder="0.0"
            />
            <div className="bg-zinc-700 px-5 py-2.5 rounded-xl font-medium">pathUSD</div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center -my-2">
          <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-700">
            <ArrowDownIcon className="w-6 h-6" />
          </div>
        </div>

        {/* You Receive */}
        <div className="bg-zinc-800 rounded-2xl p-5">
          <div className="text-sm text-gray-400 mb-3">You receive</div>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-medium">—</div>
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="bg-zinc-700 px-5 py-2.5 rounded-xl font-medium"
            >
              <option value="USDC">USDC</option>
              <option value="USDT0">USDT0</option>
              <option value="capUSD">capUSD</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSwap}
        disabled={!isConnected || isSwapping}
        className={`mt-8 w-full py-4 rounded-2xl font-semibold text-lg transition ${
          isConnected && !isSwapping ? 'bg-white text-black hover:bg-yellow-400' : 'bg-zinc-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSwapping ? 'Swapping...' : 'Swap Now'}
      </button>
    </div>
  );
}
