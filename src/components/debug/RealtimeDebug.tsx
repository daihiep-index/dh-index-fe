import React from 'react';
import { StockRealtimeData } from '../../types/stock';

interface RealtimeDebugProps {
  realtimeData: Record<string, StockRealtimeData>;
  lastKnownPrices: Record<string, number>;
  wsConnected?: boolean;
}

export const RealtimeDebug: React.FC<RealtimeDebugProps> = ({
  realtimeData,
  lastKnownPrices,
  wsConnected = false
}) => {
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp));
      return date.toLocaleTimeString();
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Debug: Realtime Data</h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
          wsConnected
            ? 'bg-emerald-600/20 text-emerald-400'
            : 'bg-red-600/20 text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            wsConnected ? 'bg-emerald-400' : 'bg-red-400'
          } ${wsConnected ? 'animate-pulse' : ''}`}></div>
          {wsConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Realtime Data */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2">Current WebSocket Data</h4>
          <div className="space-y-2">
            {Object.entries(realtimeData).map(([symbol, data]) => (
              <div key={symbol} className="bg-slate-800/50 p-2 rounded text-xs">
                <div className="text-emerald-400 font-medium">{symbol}</div>
                <div className="text-slate-300">
                  Price: {data.p?.toLocaleString()} VND
                </div>
                <div className="text-slate-400">
                  Time: {formatTime(data.t)}
                </div>
                <div className="text-slate-400">
                  Volume: {data.v?.toLocaleString()}
                </div>
              </div>
            ))}
            {Object.keys(realtimeData).length === 0 && (
              <div className="text-slate-500 text-xs">No realtime data</div>
            )}
          </div>
        </div>

        {/* Last Known Prices */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2">Last Known Prices</h4>
          <div className="space-y-2">
            {Object.entries(lastKnownPrices).map(([symbol, price]) => (
              <div key={symbol} className="bg-slate-800/50 p-2 rounded text-xs">
                <div className="text-blue-400 font-medium">{symbol}</div>
                <div className="text-slate-300">
                  Price: {price.toLocaleString()} VND
                </div>
              </div>
            ))}
            {Object.keys(lastKnownPrices).length === 0 && (
              <div className="text-slate-500 text-xs">No saved prices</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
