import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { User, LogOut, RefreshCw, BarChart3, Settings } from 'lucide-react';

interface HeaderProps {
  activeTab?: 'overview' | 'manage';
  onTabChange?: (tab: 'overview' | 'manage') => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = 'overview',
  onTabChange,
  onRefresh,
  loading = false
}) => {
  const { user, logout } = useAuth();

  const tabs = [
    {
      id: 'overview' as const,
      label: 'Tổng Quan',
      icon: BarChart3,
    },
    {
      id: 'manage' as const,
      label: 'Quản Lý',
      icon: Settings,
    },
  ];

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex justify-between items-center h-16 border-b border-slate-700/50">
          <div className="flex items-center gap-8">
            <Logo size="lg" />
            <div>
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-slate-400">Theo dõi danh mục đầu tư của bạn</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Làm mới</span>
              </button>
            )}

            <div className="flex items-center gap-2 text-slate-300">
              <User className="w-5 h-5" />
              <span className="text-sm hidden sm:inline">{user?.full_name || user?.username}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Tabs row */}
        {onTabChange && (
          <div className="h-12">
            <nav className="flex space-x-8 h-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-1 border-b-2 font-medium text-sm transition-colors h-full ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};