# Portfolio UI Updates

## 🎨 New Features Implemented

### 1. Dynamic Background Colors
- **High Profit (>5%)**: Purple/Pink gradient background
- **Regular Profit (0-5%)**: Light green background  
- **Loss (<0%)**: Light red background
- **No Change (0%)**: Default slate background

### 2. Click-to-Navigate
- Click on any stock to open Simplize analysis in new tab
- URL format: `https://simplize.vn/co-phieu/{stock_code}/phan-tich`
- Visual indicators: External link icon + hover effects

### 3. Enhanced UX
- Smooth hover animations (scale up)
- Click feedback animations (scale down)
- Color-coordinated profit/loss text
- Helpful tooltip and instructions

## 🧪 Testing

### Live Demo
Visit: `http://localhost:5173/demo` to see all color variations

### Color Test
Open: `src/debug/color-test.html` in browser for static color preview

### WebSocket Debug
Open: `src/debug/websocket-test.html` for WebSocket testing

### Portfolio Calculation Test
Run `src/debug/test-portfolio.js` in browser console

## 📊 Color Scheme

| Profit/Loss | Background | Text Color | Example |
|-------------|------------|------------|---------|
| > 5% | Purple/Pink gradient | Purple-300 | VCB +6.25% |
| 0-5% | Emerald-900/20 | Emerald-300 | BID +3.33% |
| < 0% | Red-900/20 | Red-300 | VNM -3.53% |
| 0% | Slate-800/50 | Slate-400 | HPG 0.00% |

## 🔧 Technical Implementation

### Files Modified
- `src/components/portfolio/HoldingsList.tsx` - Main component with new UI
- `src/hooks/useStockPortfolio.ts` - Fixed profit/loss calculation logic
- `src/services/websocketService.ts` - Enhanced WebSocket handling
- `src/types/stock.ts` - Updated data types

### Key Functions Added
```typescript
// Background color based on profit/loss percentage
getBackgroundColor(profitLossPercentage: number): string

// Text color for profit/loss display  
getProfitLossColor(profitLossPercentage: number): string

// Handle stock click navigation
handleStockClick(stockCode: string, event: React.MouseEvent): void
```

### New State Management
- `lastKnownPrices` - Persist prices across WebSocket disconnections
- `wsConnected` - Track connection status
- localStorage integration for price persistence

## 🚀 Usage Examples

### TCB Stock Example
- Buy: 77 shares @ 30,000 VND = 2,310,000 VND
- Current: 35,100 VND = 2,702,700 VND  
- Profit: +392,700 VND (+17.00%)
- Background: Purple/Pink gradient (>5% profit)

### Click Navigation
```typescript
// Clicking TCB opens:
https://simplize.vn/co-phieu/TCB/phan-tich
```

## 🎯 Benefits

1. **Visual Clarity**: Instant recognition of profitable vs losing positions
2. **Quick Analysis**: One-click access to detailed stock analysis
3. **Stable Data**: Profit/loss persists even during WebSocket interruptions
4. **Better UX**: Smooth animations and clear visual feedback
5. **Color Psychology**: Industry-standard colors (green=profit, red=loss, purple=high profit)

## 🔍 Debug Tools

### Real-time Debug Panel
Shows current WebSocket data, last known prices, and connection status

### Console Logging
Detailed logs for:
- WebSocket message handling
- Profit/loss calculations  
- Price updates and persistence
- Connection status changes

## 📱 Responsive Design
- Works on desktop and mobile
- Hover effects adapt to touch devices
- Maintains readability across screen sizes
