import { subMonths, format } from 'date-fns';

// --- TYPES ---

export interface FinancialKPIs {
  revenue: { total: number; growth: number };
  margin: { average: number; status: 'good' | 'warning' | 'critical' };
  commission: { total: number; percentage: number };
  netProfit: { total: number; targetParams: number };
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: any;
}

export interface SmartInsight {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  message: string;
}

export interface FinancialReport {
  kpis: FinancialKPIs;
  revenueHistory: ChartDataPoint[];
  profitabilityByDestination: ChartDataPoint[];
  sellerPerformance: any[];
  productMix: ChartDataPoint[];
  alerts: SmartInsight[];
  insights: SmartInsight[];
}

// --- MOCK DATA GENERATOR (Simulating DB Aggregations) ---

export async function getFinancialReport(): Promise<FinancialReport> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // 1. Revenue History (Last 6 months)
  const revenueHistory = [
    { name: 'May', revenue: 45000, cost: 28000, profit: 17000 },
    { name: 'Jun', revenue: 52000, cost: 31000, profit: 21000 },
    { name: 'Jul', revenue: 48000, cost: 30000, profit: 18000 },
    { name: 'Ago', revenue: 61000, cost: 35000, profit: 26000 },
    { name: 'Sep', revenue: 58000, cost: 34000, profit: 24000 },
    { name: 'Oct', revenue: 72500, cost: 38000, profit: 34500 }, // Current Month
  ];

  // 2. Profitability by Destination
  const profitabilityByDestination = [
    { name: 'Florianópolis', revenue: 85000, cost: 55000, margin: 35 },
    { name: 'Bombinhas', revenue: 42000, cost: 20000, margin: 52 }, // High margin
    { name: 'Camboriú', revenue: 38000, cost: 28000, margin: 26 }, // Low margin warning
    { name: 'Búzios', revenue: 15000, cost: 11000, margin: 26 },
  ];

  // 3. Seller Performance
  const sellerPerformance = [
    { name: 'Vendedor Top', sales: 45, revenue: 68000, commission: 6800, ticket: 1511 },
    { name: 'Admin General', sales: 12, revenue: 15000, commission: 0, ticket: 1250 },
    { name: 'Nuevo Agente', sales: 5, revenue: 4200, commission: 420, ticket: 840 },
  ];

  // 4. Product Mix (UPDATED FOR NEW BUSINESS MODEL)
  const productMix = [
    { name: 'Combos (Tour+Traslado)', value: 45 },
    { name: 'Excursiones', value: 30 },
    { name: 'Traslados', value: 20 },
    { name: 'Seguros', value: 5 },
  ];

  // 5. Calculate KPIs
  const currentMonth = revenueHistory[revenueHistory.length - 1];
  const prevMonth = revenueHistory[revenueHistory.length - 2];
  
  const growth = ((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100;
  const totalCommission = sellerPerformance.reduce((sum, s) => sum + s.commission, 0);
  const netProfit = currentMonth.revenue - currentMonth.cost - (totalCommission * 0.1); // Mock calculation
  const marginAvg = (netProfit / currentMonth.revenue) * 100;

  // 6. Generate Alerts & Insights
  const alerts: SmartInsight[] = [];
  const insights: SmartInsight[] = [];

  // Logic: Alerts
  if (marginAvg < 35) alerts.push({ type: 'negative', title: 'Margen Global Bajo', message: `El margen promedio (${marginAvg.toFixed(1)}%) está por debajo del objetivo (35%).` });
  profitabilityByDestination.forEach(d => {
    if (d.margin < 30) alerts.push({ type: 'negative', title: `Rentabilidad Baja en ${d.name}`, message: `Margen crítico del ${d.margin}% en ${d.name}. Revisar costos.` });
  });

  // Logic: Insights
  const bestDest = profitabilityByDestination.reduce((a, b) => a.margin > b.margin ? a : b);
  insights.push({ type: 'positive', title: 'Destino Estrella', message: `${bestDest.name} lidera la rentabilidad con un margen del ${bestDest.margin}%.` });
  
  insights.push({ type: 'neutral', title: 'Tendencia de Ingresos', message: `Los ingresos crecieron un ${growth.toFixed(1)}% respecto al mes anterior.` });

  return {
    kpis: {
      revenue: { total: currentMonth.revenue, growth },
      margin: { average: marginAvg, status: marginAvg > 40 ? 'good' : marginAvg > 30 ? 'warning' : 'critical' },
      commission: { total: totalCommission, percentage: (totalCommission / currentMonth.revenue) * 100 },
      netProfit: { total: netProfit, targetParams: 85 } // 85% of target reached
    },
    revenueHistory,
    profitabilityByDestination,
    sellerPerformance,
    productMix,
    alerts,
    insights
  };
}