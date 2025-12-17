
export interface ABMetrics {
  views: number;
  ctaClicks: number;
  whatsappStarts: number;
  reservations: number;
}

export interface ABTestResult {
  variantA: ABMetrics;
  variantB: ABMetrics;
  winner: 'A' | 'B' | 'TIE' | 'INSUFFICIENT_DATA';
  confidence: number;
  totalVisitors: number;
  uplift: number;
}

// Mock database simulating accumulated data
// In a real app, this would come from a DB
let mockStorage: { A: ABMetrics, B: ABMetrics } = {
  A: { views: 2450, ctaClicks: 320, whatsappStarts: 150, reservations: 25 },
  B: { views: 2380, ctaClicks: 580, whatsappStarts: 290, reservations: 48 }
};

export const getABTestResults = async (): Promise<ABTestResult> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 600));
  
  const crA = mockStorage.A.reservations / mockStorage.A.views;
  const crB = mockStorage.B.reservations / mockStorage.B.views;
  
  const uplift = ((crB - crA) / crA) * 100;

  return {
    variantA: mockStorage.A,
    variantB: mockStorage.B,
    winner: uplift > 10 ? 'B' : uplift < -10 ? 'A' : 'TIE',
    confidence: 92.5,
    totalVisitors: mockStorage.A.views + mockStorage.B.views,
    uplift
  };
};

export const trackABEvent = (variant: 'A' | 'B', event: keyof ABMetrics) => {
  // In a real app, this would be a Server Action or API call
  console.log(`[TRACKING] Variant: ${variant} | Event: ${event}`);
  
  // Update mock storage in memory for the session
  if (mockStorage[variant]) {
     mockStorage[variant][event]++;
  }
};
