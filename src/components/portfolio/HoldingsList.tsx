import React from 'react';
import { TrendingUp, TrendingDown, Activity, RefreshCw, ExternalLink } from 'lucide-react';
import { StockHoldingWithRealtimeData } from '../../types/stock';

interface HoldingsListProps {
  holdings: StockHoldingWithRealtimeData[];
  loading?: boolean;
  onRefresh?: () => void;
}

export const HoldingsList: React.FC<HoldingsListProps> = ({ holdings, loading, onRefresh }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  // Get background color based on profit/loss percentage
  const getBackgroundColor = (profitLossPercentage: number) => {
    if (profitLossPercentage > 5) {
      // High profit (>5%) - Purple/Pink gradient
      return 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30';
    } else if (profitLossPercentage > 0) {
      // Profit - Light green
      return 'bg-emerald-900/20 border-emerald-500/30';
    } else if (profitLossPercentage < 0) {
      // Loss - Light red
      return 'bg-red-900/20 border-red-500/30';
    } else {
      // No change - Default
      return 'bg-slate-800/50 border-slate-700/50';
    }
  };

  // Get text color for profit/loss display
  const getProfitLossColor = (profitLossPercentage: number) => {
    if (profitLossPercentage > 5) {
      return 'text-purple-300';
    } else if (profitLossPercentage > 0) {
      return 'text-emerald-300';
    } else if (profitLossPercentage < 0) {
      return 'text-red-300';
    } else {
      return 'text-slate-400';
    }
  };

  // Handle stock click - open in new tab
  const handleStockClick = (stockCode: string, event: React.MouseEvent) => {
    // Add a small animation feedback
    const target = event.currentTarget as HTMLElement;
    target.style.transform = 'scale(0.98)';
    setTimeout(() => {
      target.style.transform = '';
    }, 150);

    const url = `https://simplize.vn/co-phieu/${stockCode}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Danh Mục Đầu Tư</h3>
          <Activity className="w-5 h-5 text-slate-400" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                  <div>
                    <div className="w-16 h-4 bg-slate-700 rounded mb-2"></div>
                    <div className="w-24 h-3 bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-20 h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="w-16 h-3 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Danh Mục Đầu Tư</h3>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <Activity className="w-5 h-5 text-slate-400" />
          </div>
        </div>
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Chưa có cổ phiếu nào trong danh mục</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Danh Mục Đầu Tư</h3>
          <p className="text-xs text-slate-400 mt-1">Click vào cổ phiếu để xem phân tích chi tiết</p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <Activity className="w-5 h-5 text-slate-400" />
        </div>
      </div>
      
      <div className="space-y-4">
        {holdings.map((holding) => {
          const isPositive = holding.profitLoss >= 0;
          const hasRealtimeData = !!holding.realtimeData;
          const backgroundColorClass = getBackgroundColor(holding.profitLossPercentage);
          const profitLossColorClass = getProfitLossColor(holding.profitLossPercentage);

          return (
            <div
              key={holding.id}
              className={`p-4 rounded-lg transition-all duration-200 border cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${backgroundColorClass}`}
              onClick={(e) => handleStockClick(holding.stockCode, e)}
              title={`Click để xem phân tích ${holding.stockCode} trên Simplize`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{holding.stockCode}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-semibold">{holding.stockCode}</h4>
                      <ExternalLink className="w-3 h-3 text-slate-400 opacity-60" />
                      {hasRealtimeData && (
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">
                      {formatNumber(holding.quantity)} cổ phiếu • Giá mua: {formatCurrency(holding.buyPrice)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-semibold text-lg">
                    {formatCurrency(holding.currentPrice)}
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${profitLossColorClass}`}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{formatCurrency(holding.profitLoss)}</span>
                    <span>({formatPercentage(holding.profitLossPercentage)})</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-slate-700/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Giá trị đầu tư:</span>
                    <span className="text-white ml-2">{formatCurrency(holding.totalValue)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Giá trị hiện tại:</span>
                    <span className="text-white ml-2">{formatCurrency(holding.currentValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
