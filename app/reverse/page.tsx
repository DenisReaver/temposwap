import SwapOtherToPath from '@/components/SwapOtherToPath';

export default function ReverseSwap() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-bold mb-2 tracking-tight">TempoSwap</h1>
          <p className="text-gray-400 text-lg">Stablecoins → pathUSD</p>
        </div>
        <SwapOtherToPath />
      </div>
    </main>
  );
}