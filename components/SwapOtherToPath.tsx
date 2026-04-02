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

export default function SwapOtherToPath() {
  const { address, isConnected } = useAccount();
  const [fromToken, setFromToken] = useState('USDC');
  const [amount, setAmount] = useState('0.1');
  const [isSwapping, setIsSwapping] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        // Автоматическое переключение на Tempo
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1079' }],
        });
        window.location.reload();
      } catch (error: any) {
        if (error.code === 4902) {
          try {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x1079',
                chainName: 'Tempo Mainnet',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://rpc.tempo.xyz'],
                blockExplorerUrls: ['https://explore.mainnet.tempo.xyz'],
              }],
            });
          } catch (addError) {
            console.error(addError);
          }
        } else {
          alert('Не удалось подключить кошелёк');
        }
      }
    } else {
      alert('Установите MetaMask или Rabby Wallet');
    }
  };

  const handleSwap = async () => {
    if (!isConnected) {
      alert('Подключите кошелёк!');
      return;
    }

    if (!(window as any).ethereum) {
      alert('Кошелёк не обнаружен.');
      return;
    }

    setIsSwapping(true);

    try {
      const amountIn = parseUnits(amount, 6);
      const tokenInAddr = TOKENS[fromToken as keyof typeof TOKENS];

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      const tokenIn = new ethers.Contract(
        tokenInAddr,
        [
          "function approve(address spender, uint256 amount) external returns (bool)",
          "function allowance(address owner, address spender) external view returns (uint256)"
        ],
        signer
      );

      const dex = new ethers.Contract(
        DEX_ADDRESS,
        ["function swapExactAmountIn(address tokenIn, address tokenOut, uint128 amountIn, uint128 minAmountOut) external returns (uint128)"],
        signer
      );

      const owner = await signer.getAddress();
      const allowance = await tokenIn.allowance(owner, DEX_ADDRESS);

      if (allowance < amountIn) {
        const approveTx = await tokenIn.approve(DEX_ADDRESS, amountIn);
        await approveTx.wait();
      }

      const tx = await dex.swapExactAmountIn(
        tokenInAddr,
        PATHUSD,
        amountIn,
        0
      );

      alert(`Транзакция отправлена!\nHash: ${tx.hash}`);
      await tx.wait();
      alert(`✅ Своп успешно выполнен!`);

    } catch (error: any) {
      console.error(error);
      alert("Ошибка свопа:\n" + (error.reason || error.message || "Неизвестная ошибка"));
    } finally {
      setIsSwapping(false);
    }
  };

  if (!isClient) {
    return <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 h-[500px]" />;
  }

  return (
    <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stable → pathUSD</h2>
        {isConnected ? (
          <div className="text-sm text-green-400">Connected</div>
        ) : (
          <button 
            onClick={connectWallet}
            className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-yellow-400"
          >
            Connect Wallet
          </button>
        )}
      </div>

      <div className="bg-zinc-800 rounded-2xl p-5 mb-3">
        <div className="text-sm text-gray-400 mb-3">You pay</div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-transparent text-4xl font-medium outline-none flex-1"
            placeholder="0.0"
          />
          <select
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            className="bg-zinc-700 px-5 py-3 rounded-2xl font-medium"
          >
            <option value="USDC">USDC</option>
            <option value="USDT0">USDT0</option>
            <option value="capUSD">capUSD</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center -my-4">
        <ArrowDownIcon className="w-6 h-6" />
      </div>

      <div className="bg-zinc-800 rounded-2xl p-5 mt-3">
        <div className="text-sm text-gray-400 mb-3">You receive</div>
        <div className="text-4xl font-medium text-right">pathUSD</div>
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
