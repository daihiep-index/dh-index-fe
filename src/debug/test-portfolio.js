// Test script to simulate portfolio calculations
// Run this in browser console to test the logic

console.log('=== Portfolio Calculation Test ===');

// Mock data similar to your actual data
const mockHolding = {
  id: '1',
  stock_code: 'TCB',
  quantity: 77,
  value: 30, // 30,000 VND (stored as thousands)
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  user: 'user1'
};

const mockRealtimeData = {
  t: '1753237709743',
  s: 'TCB',
  p: 35100.0, // Current price from WebSocket
  c: 35100.0,
  a: 35289.8031288451,
  tv: 2844500.0,
  v: 1500.0,
  tva: 1.00381845E11,
  bfv: 6.070234325995781E9,
  sfv: 5.272684775283881E9,
  tbv: 871500.0,
  ssv: 1973000.0,
  pc: -0.7072135785,
  pn: -250.0,
  qb1: 159200.0,
  qb3: 487200.0,
  qa1: 150300.0,
  qa2: 89300.0
};

// Test calculation logic
function testCalculation() {
  console.log('\n--- Test Calculation ---');
  
  // Convert value from thousands VND to actual VND
  const buyPrice = mockHolding.value * 1000; // 30,000 VND
  const currentPrice = mockRealtimeData.p; // 35,100 VND
  
  console.log(`Buy Price: ${buyPrice.toLocaleString()} VND`);
  console.log(`Current Price: ${currentPrice.toLocaleString()} VND`);
  
  // Calculate values
  const totalValue = mockHolding.quantity * buyPrice; // 77 * 30,000 = 2,310,000
  const currentValue = mockHolding.quantity * currentPrice; // 77 * 35,100 = 2,702,700
  const profitLoss = currentValue - totalValue; // 2,702,700 - 2,310,000 = 392,700
  const profitLossPercentage = totalValue > 0 ? (profitLoss / totalValue) * 100 : 0; // 17%
  
  console.log(`Quantity: ${mockHolding.quantity} shares`);
  console.log(`Total Investment: ${totalValue.toLocaleString()} VND`);
  console.log(`Current Value: ${currentValue.toLocaleString()} VND`);
  console.log(`Profit/Loss: ${profitLoss.toLocaleString()} VND`);
  console.log(`Profit/Loss %: ${profitLossPercentage.toFixed(2)}%`);
  
  // Expected results
  console.log('\n--- Expected Results ---');
  console.log('Total Investment: 2,310,000 VND');
  console.log('Current Value: 2,702,700 VND');
  console.log('Profit/Loss: +392,700 VND');
  console.log('Profit/Loss %: +17.00%');
  
  // Verify
  const expectedProfit = 392700;
  const expectedPercentage = 17.00;
  
  console.log('\n--- Verification ---');
  console.log(`Profit calculation correct: ${Math.abs(profitLoss - expectedProfit) < 1}`);
  console.log(`Percentage calculation correct: ${Math.abs(profitLossPercentage - expectedPercentage) < 0.01}`);
}

// Test with no realtime data (should use last known price)
function testWithLastKnownPrice() {
  console.log('\n--- Test with Last Known Price ---');
  
  const lastKnownPrice = 35100; // Saved from previous WebSocket data
  const buyPrice = mockHolding.value * 1000;
  
  console.log(`Buy Price: ${buyPrice.toLocaleString()} VND`);
  console.log(`Last Known Price: ${lastKnownPrice.toLocaleString()} VND`);
  
  const totalValue = mockHolding.quantity * buyPrice;
  const currentValue = mockHolding.quantity * lastKnownPrice;
  const profitLoss = currentValue - totalValue;
  const profitLossPercentage = totalValue > 0 ? (profitLoss / totalValue) * 100 : 0;
  
  console.log(`Profit/Loss: ${profitLoss.toLocaleString()} VND (${profitLossPercentage.toFixed(2)}%)`);
  console.log('Should maintain profit even without realtime data');
}

// Test localStorage persistence
function testLocalStorage() {
  console.log('\n--- Test localStorage ---');
  
  const testPrices = {
    'TCB': 35100,
    'VCB': 85000,
    'BID': 45000
  };
  
  // Save to localStorage
  localStorage.setItem('lastKnownPrices', JSON.stringify(testPrices));
  console.log('Saved to localStorage:', testPrices);
  
  // Read from localStorage
  const saved = JSON.parse(localStorage.getItem('lastKnownPrices') || '{}');
  console.log('Read from localStorage:', saved);
  
  console.log(`localStorage working: ${JSON.stringify(saved) === JSON.stringify(testPrices)}`);
}

// Run all tests
testCalculation();
testWithLastKnownPrice();
testLocalStorage();

console.log('\n=== Test Complete ===');
console.log('Copy and paste this script into your browser console to test the calculations.');
