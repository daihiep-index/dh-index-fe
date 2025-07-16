import React from 'react';
import { Header } from '../layout/Header';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, PieChart } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Portfolio Value',
      value: '$125,432.50',
      change: '+$2,431.20',
      changePercent: '+1.98%',
      icon: DollarSign,
      isPositive: true,
    },
    {
      title: 'Total Gain/Loss',
      value: '$15,432.50',
      change: '+$1,234.00',
      changePercent: '+8.69%',
      icon: TrendingUp,
      isPositive: true,
    },
    {
      title: 'Active Positions',
      value: '12',
      change: '+2',
      changePercent: '+20%',
      icon: Activity,
      isPositive: true,
    },
    {
      title: 'Day P&L',
      value: '-$432.10',
      change: '-$123.45',
      changePercent: '-2.34%',
      icon: TrendingDown,
      isPositive: false,
    },
  ];

  const watchlist = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$175.43', change: '+$2.15', changePercent: '+1.24%', isPositive: true },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$2,845.20', change: '-$12.45', changePercent: '-0.44%', isPositive: false },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$342.87', change: '+$5.23', changePercent: '+1.55%', isPositive: true },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$234.56', change: '-$8.90', changePercent: '-3.65%', isPositive: false },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '$145.32', change: '+$3.21', changePercent: '+2.26%', isPositive: true },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-slate-400">Welcome back to your trading platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-900/70 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.isPositive ? 'bg-emerald-600/20' : 'bg-red-600/20'}`}>
                  <stat.icon className={`w-5 h-5 ${stat.isPositive ? 'text-emerald-400' : 'text-red-400'}`} />
                </div>
                <div className={`text-right ${stat.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  <div className="text-sm font-medium">{stat.change}</div>
                  <div className="text-xs">{stat.changePercent}</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.title}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Watchlist */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Watchlist</h3>
                <BarChart3 className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-4">
                {watchlist.map((stock, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{stock.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{stock.symbol}</div>
                        <div className="text-sm text-slate-400">{stock.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-white">{stock.price}</div>
                      <div className={`text-sm ${stock.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stock.change} ({stock.changePercent})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Overview */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Market Overview</h3>
                <PieChart className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">S&P 500</span>
                  <div className="text-right">
                    <div className="text-white font-medium">4,234.56</div>
                    <div className="text-emerald-400 text-sm">+0.85%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">NASDAQ</span>
                  <div className="text-right">
                    <div className="text-white font-medium">13,456.78</div>
                    <div className="text-red-400 text-sm">-0.23%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Dow Jones</span>
                  <div className="text-right">
                    <div className="text-white font-medium">34,567.89</div>
                    <div className="text-emerald-400 text-sm">+0.45%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg transition-colors duration-200">
                  Place Order
                </button>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-colors duration-200">
                  View Portfolio
                </button>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-colors duration-200">
                  Market Research
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};