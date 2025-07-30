import { WebSocketMessage, WebSocketSubscription, StockRealtimeData } from '../types/stock';

export class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscribers: Map<string, (data: StockRealtimeData) => void> = new Map();
  private subscribedSymbols: Set<string> = new Set();
  
  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket('wss://stream2.simplize.vn/ws');
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };
        
        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.handleReconnect();
        };
        
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(message: WebSocketMessage) {
    // Add logging to debug WebSocket messages
    console.log('WebSocket message received:', message);

    if ((message.topic === 'quotes' || message.topic === 'ticks') && message.data) {
      message.data.forEach((stockData) => {
        const callback = this.subscribers.get(stockData.s);
        if (callback) {
          console.log(`Updating ${stockData.s} with price: ${stockData.p}`);
          callback(stockData);
        } else {
          console.log(`No callback found for symbol: ${stockData.s}`);
        }
      });
    } else {
      console.log(`Unhandled message topic: ${message.topic}`);
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect().then(() => {
          // Re-subscribe to all symbols with their callbacks
          this.subscribedSymbols.forEach(symbol => {
            const callback = this.subscribers.get(symbol);
            if (callback) {
              this.subscribeToStock(symbol, callback);
            }
          });
        }).catch(console.error);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  subscribeToStock(symbol: string, callback?: (data: StockRealtimeData) => void): void {
    if (callback) {
      this.subscribers.set(symbol, callback);
    }
    
    this.subscribedSymbols.add(symbol);
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const subscription: WebSocketSubscription = {
        event: 'sub',
        topic: 'STOCK_RETIME_LIST',
        params: [symbol, `${symbol}@TICKS`]
      };
      
      this.ws.send(JSON.stringify(subscription));
      console.log(`Subscribed to ${symbol}`);
    }
  }

  unsubscribeFromStock(symbol: string): void {
    this.subscribers.delete(symbol);
    this.subscribedSymbols.delete(symbol);
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const unsubscription = {
        event: 'unsub',
        topic: 'STOCK_RETIME_LIST',
        params: [symbol, `${symbol}@TICKS`]
      };
      
      this.ws.send(JSON.stringify(unsubscription));
      console.log(`Unsubscribed from ${symbol}`);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
    this.subscribedSymbols.clear();
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
