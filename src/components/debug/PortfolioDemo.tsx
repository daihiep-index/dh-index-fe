import React from 'react';
import { HoldingsList } from '../portfolio/HoldingsList';
import { StockHoldingWithRealtimeData } from '../../types/stock';

// Mock data for demonstration
const mockHoldings: StockHoldingWithRealtimeData[] = [
  {
    id: '1',
    stockCode: 'VCB',
    quantity: 100,
    buyPrice: 80000,
    currentPrice: 85000,
    totalValue: 8000000,
    currentValue: 8500000,
    profitLoss: 500000,
    profitLossPercentage: 6.25, // High profit >5% - Purple/Pink
    realtimeData: {
      t: '1753237709743',
      s: 'VCB',
      p: 85000,
      c: 85000,
      a: 85000,
      tv: 1000000,
      v: 1000,
      tva: 85000000,
      bfv: 1000000,
      sfv: 900000,
      tbv: 500000,
      ssv: 400000,
      pc: 6.25,
      pn: 5000
    }
  },
  {
    id: '2',
    stockCode: 'TCB',
    quantity: 77,
    buyPrice: 30000,
    currentPrice: 35100,
    totalValue: 2310000,
    currentValue: 2702700,
    profitLoss: 392700,
    profitLossPercentage: 17.00, // High profit >5% - Purple/Pink
    realtimeData: {
      t: '1753237709743',
      s: 'TCB',
      p: 35100,
      c: 35100,
      a: 35289.8031288451,
      tv: 2844500,
      v: 1500,
      tva: 1.00381845E11,
      bfv: 6.070234325995781E9,
      sfv: 5.272684775283881E9,
      tbv: 871500,
      ssv: 1973000,
      pc: 17.00,
      pn: 5100
    }
  },
  {
    id: '3',
    stockCode: 'BID',
    quantity: 200,
    buyPrice: 45000,
    currentPrice: 46500,
    totalValue: 9000000,
    currentValue: 9300000,
    profitLoss: 300000,
    profitLossPercentage: 3.33, // Regular profit 0-5% - Green
    realtimeData: {
      t: '1753237709743',
      s: 'BID',
      p: 46500,
      c: 46500,
      a: 46500,
      tv: 500000,
      v: 800,
      tva: 37200000,
      bfv: 500000,
      sfv: 400000,
      tbv: 300000,
      ssv: 200000,
      pc: 3.33,
      pn: 1500
    }
  },
  {
    id: '4',
    stockCode: 'VNM',
    quantity: 50,
    buyPrice: 85000,
    currentPrice: 82000,
    totalValue: 4250000,
    currentValue: 4100000,
    profitLoss: -150000,
    profitLossPercentage: -3.53, // Loss - Red
    realtimeData: {
      t: '1753237709743',
      s: 'VNM',
      p: 82000,
      c: 82000,
      a: 82000,
      tv: 300000,
      v: 500,
      tva: 41000000,
      bfv: 200000,
      sfv: 250000,
      tbv: 150000,
      ssv: 180000,
      pc: -3.53,
      pn: -3000
    }
  },
  {
    id: '5',
    stockCode: 'HPG',
    quantity: 200,
    buyPrice: 25000,
    currentPrice: 25000,
    totalValue: 5000000,
    currentValue: 5000000,
    profitLoss: 0,
    profitLossPercentage: 0, // No change - Default
    realtimeData: {
      t: '1753237709743',
      s: 'HPG',
      p: 25000,
      c: 25000,
      a: 25000,
      tv: 400000,
      v: 600,
      tva: 25000000,
      bfv: 300000,
      sfv: 300000,
      tbv: 200000,
      ssv: 200000,
      pc: 0,
      pn: 0
    }
  }
];

export const PortfolioDemo: React.FC = () => {
  const handleRefresh = () => {
    console.log('Refresh clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Portfolio Demo</h1>
        
        <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Features Demonstrated:</h3>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• <span className="text-purple-300">Purple/Pink background</span> for high profit (&gt;5%)</li>
            <li>• <span className="text-emerald-300">Green background</span> for regular profit (0-5%)</li>
            <li>• <span className="text-red-300">Red background</span> for losses</li>
            <li>• <span className="text-slate-400">Default background</span> for no change</li>
            <li>• Click on any stock to open Simplize analysis in new tab</li>
            <li>• Hover and click animations</li>
            <li>• External link icon indicator</li>
          </ul>
        </div>

        <HoldingsList 
          holdings={mockHoldings}
          loading={false}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};
