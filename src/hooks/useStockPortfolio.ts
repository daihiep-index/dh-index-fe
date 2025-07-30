import { useState, useEffect, useCallback } from 'react';
import { StockService } from '../services/stockService';
import { WebSocketService } from '../services/websocketService';
import { 
  UserHolding, 
  StockRealtimeData, 
  StockHoldingWithRealtimeData,
  PortfolioSummary
} from '../types/stock';

export const useStockPortfolio = () => {
  const [holdings, setHoldings] = useState<UserHolding[]>([]);
  const [realtimeData, setRealtimeData] = useState<Record<string, StockRealtimeData>>({});

  // Initialize last known prices from localStorage
  const [lastKnownPrices, setLastKnownPrices] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('lastKnownPrices');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [combinedData, setCombinedData] = useState<StockHoldingWithRealtimeData[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary>({
    totalInvestment: 0,
    currentValue: 0,
    totalProfitLoss: 0,
    profitLossPercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const stockService = StockService.getInstance();
  const websocketService = WebSocketService.getInstance();

  // Fetch user holdings
  const fetchHoldings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockService.getUserHoldings();
      setHoldings(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch holdings');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle realtime data updates
  const handleRealtimeUpdate = useCallback((stockCode: string, data: StockRealtimeData) => {
    console.log(`Realtime update for ${stockCode}:`, data);

    // Update realtime data
    setRealtimeData(prev => {
      const updated = {
        ...prev,
        [stockCode]: data
      };
      console.log('Updated realtime data:', updated);
      return updated;
    });

    // Update last known price if we have a valid price
    if (data.p && data.p > 0) {
      setLastKnownPrices(prev => {
        const updated = {
          ...prev,
          [stockCode]: data.p
        };
        // Save to localStorage for persistence
        try {
          localStorage.setItem('lastKnownPrices', JSON.stringify(updated));
        } catch (error) {
          console.error('Failed to save last known prices to localStorage:', error);
        }
        return updated;
      });
      console.log(`Updated last known price for ${stockCode}: ${data.p}`);
    }
  }, []);

  // Subscribe to WebSocket for each holding
  const subscribeToHoldings = useCallback((holdingsData: UserHolding[]) => {
    console.log('Subscribing to holdings:', holdingsData.map(h => h.stock_code));

    if (!websocketService.isConnected()) {
      console.log('WebSocket not connected, connecting...');
      setWsConnected(false);
      websocketService.connect().then(() => {
        console.log('WebSocket connected, subscribing to stocks...');
        setWsConnected(true);
        holdingsData.forEach(holding => {
          console.log(`Subscribing to ${holding.stock_code}`);
          websocketService.subscribeToStock(
            holding.stock_code,
            (data) => handleRealtimeUpdate(holding.stock_code, data)
          );
        });
      }).catch(err => {
        setError('Failed to connect to WebSocket');
        setWsConnected(false);
        console.error('WebSocket connection error:', err);
      });
    } else {
      console.log('WebSocket already connected, subscribing to stocks...');
      setWsConnected(true);
      holdingsData.forEach(holding => {
        console.log(`Subscribing to ${holding.stock_code}`);
        websocketService.subscribeToStock(
          holding.stock_code,
          (data) => handleRealtimeUpdate(holding.stock_code, data)
        );
      });
    }
  }, [handleRealtimeUpdate]);

  // Combine holdings with realtime data
  const combineData = useCallback(() => {
    if (holdings.length === 0) return;

    const combined = holdings.map(holding => {
      const stockData = realtimeData[holding.stock_code];
      // Convert value from thousands VND to actual VND (value * 1000)
      const buyPrice = holding.value * 1000;

      // Priority: 1) Current realtime price, 2) Last known price, 3) Buy price as fallback
      let currentPrice = buyPrice; // Default fallback

      if (stockData?.p && stockData.p > 0) {
        // Use current realtime price
        currentPrice = stockData.p;
        console.log(`${holding.stock_code}: Using current realtime price ${currentPrice}`);
      } else if (lastKnownPrices[holding.stock_code]) {
        // Use last known price to maintain consistency
        currentPrice = lastKnownPrices[holding.stock_code];
        console.log(`${holding.stock_code}: Using last known price ${currentPrice}`);
      } else {
        console.log(`${holding.stock_code}: No price data available, using buy price ${buyPrice}`);
      }

      // Always calculate profit/loss based on current vs buy price
      const totalValue = holding.quantity * buyPrice;
      const currentValue = holding.quantity * currentPrice;
      const profitLoss = currentValue - totalValue;
      const profitLossPercentage = totalValue > 0 ? (profitLoss / totalValue) * 100 : 0;

      console.log(`${holding.stock_code}: Buy=${buyPrice}, Current=${currentPrice}, Total=${totalValue}, CurrentVal=${currentValue}, P/L=${profitLoss} (${profitLossPercentage.toFixed(2)}%)`);

      return {
        id: holding.id,
        stockCode: holding.stock_code,
        quantity: holding.quantity,
        buyPrice,
        currentPrice,
        totalValue,
        currentValue,
        profitLoss,
        profitLossPercentage,
        realtimeData: stockData
      };
    });

    setCombinedData(combined);

    // Calculate portfolio summary
    const totalInvestment = combined.reduce((sum, item) => sum + item.totalValue, 0);
    const currentValue = combined.reduce((sum, item) => sum + item.currentValue, 0);
    const totalProfitLoss = currentValue - totalInvestment;
    const profitLossPercentage = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

    console.log('Portfolio Summary:', {
      totalInvestment,
      currentValue,
      totalProfitLoss,
      profitLossPercentage
    });

    setPortfolioSummary({
      totalInvestment,
      currentValue,
      totalProfitLoss,
      profitLossPercentage
    });
  }, [holdings, realtimeData]);

  // Initialize data on component mount
  useEffect(() => {
    const init = async () => {
      const holdingsData = await fetchHoldings();
      if (holdingsData.length > 0) {
        subscribeToHoldings(holdingsData);
      }
    };

    init();

    return () => {
      // Cleanup WebSocket connection on unmount
      websocketService.disconnect();
    };
  }, []); // Empty dependency array to run only once on mount

  // Update combined data whenever holdings, realtime data, or last known prices change
  useEffect(() => {
    combineData();
  }, [holdings, realtimeData, lastKnownPrices]); // Include lastKnownPrices to trigger recalculation

  return {
    holdings: combinedData,
    rawHoldings: holdings,
    portfolioSummary,
    loading,
    error,
    refreshHoldings: fetchHoldings,
    // Debug data
    realtimeData,
    lastKnownPrices,
    wsConnected
  };
};
