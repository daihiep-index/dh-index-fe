import React, { useState } from 'react';
import { Header } from '../layout/Header';
import { PortfolioSummary } from '../portfolio/PortfolioSummary';
import { HoldingsList } from '../portfolio/HoldingsList';
import { HoldingsManager } from '../portfolio/HoldingsManager';
import { RealtimeDebug } from '../debug/RealtimeDebug';
import { useStockPortfolio } from '../../hooks/useStockPortfolio';
import { AlertCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    holdings,
    rawHoldings,
    portfolioSummary,
    loading,
    error,
    refreshHoldings,
    realtimeData,
    lastKnownPrices,
    wsConnected
  } = useStockPortfolio();
  const [activeTab, setActiveTab] = useState<'overview' | 'manage'>('overview');
  const [showDebug, setShowDebug] = useState(true); // Show debug by default for now

  return (
    <div className="min-h-screen bg-slate-950">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={refreshHoldings}
        loading={loading}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <>
            {/* Debug Component */}
            {showDebug && (
              <RealtimeDebug
                realtimeData={realtimeData}
                lastKnownPrices={lastKnownPrices}
                wsConnected={wsConnected}
              />
            )}

            {/* Portfolio Summary */}
            <PortfolioSummary summary={portfolioSummary} loading={loading} />

            <div className="grid grid-cols-1 gap-8">
              {/* Holdings List */}
              <HoldingsList
                holdings={holdings}
                loading={loading}
                onRefresh={refreshHoldings}
              />
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Holdings Manager */}
            <HoldingsManager
              holdings={rawHoldings}
              onHoldingsChange={refreshHoldings}
              loading={loading}
            />
          </div>
        )}
      </main>
    </div>
  );
};