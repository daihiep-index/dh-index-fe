import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { PortfolioSummary as PortfolioSummaryType } from '../../types/stock';

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
  loading?: boolean;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ summary, loading }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const isPositive = summary.totalProfitLoss >= 0;

  const stats = [
    {
      title: 'Tổng Đầu Tư',
      value: formatCurrency(summary.totalInvestment),
      icon: Wallet,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20',
    },
    {
      title: 'Giá Trị Hiện Tại',
      value: formatCurrency(summary.currentValue),
      icon: DollarSign,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20',
    },
    {
      title: 'Lãi/Lỗ',
      value: formatCurrency(summary.totalProfitLoss),
      change: formatPercentage(summary.profitLossPercentage),
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-emerald-400' : 'text-red-400',
      bgColor: isPositive ? 'bg-emerald-600/20' : 'bg-red-600/20',
      isPositive,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-slate-700 rounded-lg"></div>
                <div className="w-16 h-4 bg-slate-700 rounded"></div>
              </div>
              <div className="w-24 h-6 bg-slate-700 rounded mb-2"></div>
              <div className="w-32 h-8 bg-slate-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-900/70 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            {stat.change && (
              <div className={`text-right ${stat.color}`}>
                <div className="text-sm font-medium">{stat.change}</div>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-1">{stat.title}</h3>
            <p className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
