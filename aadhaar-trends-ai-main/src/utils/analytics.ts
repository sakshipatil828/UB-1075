// Trend analysis, prediction, alert, and recommendation engine

export interface TrendResult {
  trend: "increasing" | "decreasing" | "stable";
  slope: number;
  percentChange: number;
}

export interface PredictionResult {
  predictedValue: number;
  confidence: "low" | "medium" | "high";
  method: string;
}

export type DemandLevel = "Normal" | "Medium" | "High Demand" | "Demand Alert" | "Decline Alert";

export interface AnomalyResult {
  month: string;
  value: number;
  type: "spike" | "drop";
  deviation: number;
}

export interface Recommendation {
  priority: "low" | "medium" | "high" | "critical";
  action: string;
  reason: string;
}

// --- Trend Analysis ---
export function analyzeTrend(values: number[]): TrendResult {
  if (values.length < 3) return { trend: "stable", slope: 0, percentChange: 0 };

  const n = values.length;
  const recent = values.slice(-6);
  const xMean = (recent.length - 1) / 2;
  const yMean = recent.reduce((a, b) => a + b, 0) / recent.length;

  let num = 0, den = 0;
  for (let i = 0; i < recent.length; i++) {
    num += (i - xMean) * (recent[i] - yMean);
    den += (i - xMean) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const first = values[0] || 1;
  const last = values[n - 1] || 1;
  const percentChange = ((last - first) / first) * 100;

  const normalizedSlope = slope / yMean;
  const trend = normalizedSlope > 0.02 ? "increasing" : normalizedSlope < -0.02 ? "decreasing" : "stable";

  return { trend, slope, percentChange };
}

// --- Simple Linear Regression Prediction ---
export function predictNextMonth(values: number[]): PredictionResult {
  if (values.length < 3) {
    return { predictedValue: values[values.length - 1] || 0, confidence: "low", method: "fallback" };
  }

  const data = values.slice(-12);
  const n = data.length;
  const xMean = (n - 1) / 2;
  const yMean = data.reduce((a, b) => a + b, 0) / n;

  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (data[i] - yMean);
    den += (i - xMean) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = yMean - slope * xMean;
  const predicted = Math.round(intercept + slope * n);

  const ma3 = data.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const blended = Math.round(predicted * 0.6 + ma3 * 0.4);

  const residuals = data.map((v, i) => Math.abs(v - (intercept + slope * i)));
  const avgResidual = residuals.reduce((a, b) => a + b, 0) / n;
  const relError = avgResidual / yMean;
  const confidence = relError < 0.1 ? "high" : relError < 0.25 ? "medium" : "low";

  return { predictedValue: Math.max(0, blended), confidence, method: "Linear Regression + MA" };
}

// --- 6-Month Forecast (trained on 2025 data) ---
export interface ForecastPoint {
  month: string;
  biometric_count: number;
}

export function predictNext6Months(monthlyData: { month: string; biometric_count: number }[]): { forecast: ForecastPoint[]; confidence: "low" | "medium" | "high" } {
  // Extract only 2025 data for training
  const train = monthlyData.filter((m) => m.month.startsWith("2025-"));
  const values = train.map((m) => m.biometric_count);

  if (values.length < 3) {
    return {
      forecast: Array.from({ length: 6 }, (_, i) => ({
        month: `2026-${String(i + 1).padStart(2, "0")}`,
        biometric_count: values[values.length - 1] || 0,
      })),
      confidence: "low",
    };
  }

  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((a, b) => a + b, 0) / n;

  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (values[i] - yMean);
    den += (i - xMean) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = yMean - slope * xMean;

  // 3-month moving average for blending
  const ma3 = values.slice(-3).reduce((a, b) => a + b, 0) / 3;

  const forecast: ForecastPoint[] = [];
  for (let i = 0; i < 6; i++) {
    const lrPred = intercept + slope * (n + i);
    // Blend LR with MA, decaying MA influence over time
    const maWeight = Math.max(0.1, 0.4 - i * 0.05);
    const blended = Math.round(lrPred * (1 - maWeight) + ma3 * maWeight);
    forecast.push({
      month: `2026-${String(i + 1).padStart(2, "0")}`,
      biometric_count: Math.max(0, blended),
    });
  }

  const residuals = values.map((v, i) => Math.abs(v - (intercept + slope * i)));
  const avgResidual = residuals.reduce((a, b) => a + b, 0) / n;
  const relError = avgResidual / yMean;
  const confidence = relError < 0.1 ? "high" : relError < 0.25 ? "medium" : "low";

  return { forecast, confidence };
}

// --- Demand Classification ---
export function classifyDemand(current: number, historical: number[]): DemandLevel {
  if (historical.length < 3) return "Normal";
  
  const mean = historical.reduce((a, b) => a + b, 0) / historical.length;
  const std = Math.sqrt(historical.reduce((a, b) => a + (b - mean) ** 2, 0) / historical.length);
  const zScore = std === 0 ? 0 : (current - mean) / std;

  if (zScore > 2) return "Demand Alert";
  if (zScore > 1) return "High Demand";
  if (zScore > 0.3) return "Medium";
  if (zScore < -1.5) return "Decline Alert";
  return "Normal";
}

// --- Anomaly Detection ---
export function detectAnomalies(
  data: { month: string; value: number }[]
): AnomalyResult[] {
  if (data.length < 5) return [];

  const values = data.map(d => d.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const std = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length);
  
  if (std === 0) return [];

  return data
    .map((d) => {
      const deviation = (d.value - mean) / std;
      if (Math.abs(deviation) > 1.8) {
        return {
          month: d.month,
          value: d.value,
          type: deviation > 0 ? "spike" as const : "drop" as const,
          deviation: Math.round(deviation * 100) / 100,
        };
      }
      return null;
    })
    .filter(Boolean) as AnomalyResult[];
}

// --- Recommendation Engine ---
export function generateRecommendations(
  trend: TrendResult,
  demand: DemandLevel,
  prediction: PredictionResult,
  anomalies: AnomalyResult[]
): Recommendation[] {
  const recs: Recommendation[] = [];

  if (demand === "Demand Alert" || demand === "High Demand") {
    recs.push({
      priority: "critical",
      action: "Increase operators at enrollment centers",
      reason: `Current demand is classified as "${demand}". Additional operators needed to handle load.`,
    });
    recs.push({
      priority: "high",
      action: "Open temporary enrollment desks",
      reason: "High demand requires additional capacity to reduce wait times.",
    });
  }

  if (demand === "Decline Alert") {
    recs.push({
      priority: "high",
      action: "Run awareness campaign in the region",
      reason: "Enrollment numbers show significant decline. Community outreach recommended.",
    });
    recs.push({
      priority: "medium",
      action: "Investigate potential issues at enrollment centers",
      reason: "Decline may indicate operational problems or accessibility issues.",
    });
  }

  if (trend.trend === "increasing" && trend.percentChange > 20) {
    recs.push({
      priority: "medium",
      action: "Plan for capacity expansion",
      reason: `Enrollment shows ${trend.percentChange.toFixed(0)}% growth. Proactive scaling recommended.`,
    });
  }

  if (trend.trend === "decreasing" && trend.percentChange < -15) {
    recs.push({
      priority: "medium",
      action: "Deploy mobile enrollment vans",
      reason: "Declining trend suggests accessibility barriers. Mobile units can help.",
    });
  }

  if (prediction.confidence === "low") {
    recs.push({
      priority: "low",
      action: "Collect more granular data for better predictions",
      reason: "Prediction confidence is low due to high variance in historical data.",
    });
  }

  if (anomalies.length > 2) {
    recs.push({
      priority: "medium",
      action: "Investigate frequent anomalies in enrollment patterns",
      reason: `${anomalies.length} anomalies detected. May indicate data quality or operational issues.`,
    });
  }

  if (recs.length === 0) {
    recs.push({
      priority: "low",
      action: "Maintain current operations",
      reason: "Enrollment patterns are stable and within expected ranges.",
    });
  }

  return recs;
}

// --- Demand level styling ---
export function getDemandColor(level: DemandLevel): string {
  switch (level) {
    case "Demand Alert": return "danger";
    case "High Demand": return "warning";
    case "Medium": return "info";
    case "Decline Alert": return "destructive";
    default: return "success";
  }
}
