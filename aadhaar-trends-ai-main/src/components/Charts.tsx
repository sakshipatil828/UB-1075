import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart, Legend,
  BarChart, Bar, Line, LineChart,
} from "recharts";

interface MonthlyData {
  month: string;
  biometric_count: number;
  bio_age_5_17: number;
  bio_age_17_plus: number;
}

interface ForecastPoint {
  month: string;
  biometric_count: number;
}

interface TrendChartProps {
  data: MonthlyData[];
  forecast?: ForecastPoint[];
  anomalies?: string[];
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatMonth = (m: string) => {
  const [y, mo] = m.split("-");
  return `${MONTH_NAMES[parseInt(mo) - 1]} '${y.slice(2)}`;
};

export const EnrollmentTrendChart = ({ data, forecast = [], anomalies = [] }: TrendChartProps) => {
  // Filter to only 2025 actual data
  const actual2025 = data.filter((d) => d.month.startsWith("2025-"));

  // Build combined chart data: 2025 actual + 2026 forecast
  // The last actual point connects to first forecast point
  const chartData = [
    ...actual2025.map((d) => ({
      month: d.month,
      actual: d.biometric_count,
      forecast: null as number | null,
    })),
    // Bridge point: last actual month also has forecast value for continuity
    ...forecast.map((f) => ({
      month: f.month,
      actual: null as number | null,
      forecast: f.biometric_count,
    })),
  ];

  // Insert bridge: duplicate last actual as first forecast point for line continuity
  if (actual2025.length > 0 && forecast.length > 0) {
    const lastActual = actual2025[actual2025.length - 1];
    chartData[actual2025.length - 1] = {
      ...chartData[actual2025.length - 1],
      forecast: lastActual.biometric_count,
    };
  }

  return (
    <div className="rounded-lg border bg-card p-5">
      <h3 className="mb-1 text-sm font-semibold text-foreground">Monthly Enrollment Trend</h3>
      <p className="mb-4 text-xs text-muted-foreground">2025 Actual (solid) → 2026 Forecast (dashed)</p>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
          <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value: number, name: string) => [
              value?.toLocaleString() ?? "—",
              name === "actual" ? "2025 Actual" : "2026 Forecast",
            ]}
            labelFormatter={formatMonth}
            contentStyle={{ borderRadius: 8, border: "1px solid hsl(220, 13%, 88%)", fontSize: 12 }}
          />
          <Legend
            formatter={(v) => (v === "actual" ? "2025 Actual" : "2026 Forecast")}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="hsl(230, 65%, 48%)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "hsl(230, 65%, 48%)" }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="hsl(174, 62%, 40%)"
            strokeWidth={2.5}
            strokeDasharray="8 4"
            dot={{ r: 3, fill: "hsl(174, 62%, 40%)", strokeDasharray: "0" }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AgeDistributionChart = ({ data }: { data: MonthlyData[] }) => (
  <div className="rounded-lg border bg-card p-5">
    <h3 className="mb-4 text-sm font-semibold text-foreground">Age Group Distribution</h3>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data.slice(-12)}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
        <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
        <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(value: number, name: string) => [value.toLocaleString(), name === "bio_age_5_17" ? "Age 5-17" : "Age 17+"]}
          labelFormatter={formatMonth}
          contentStyle={{ borderRadius: 8, border: "1px solid hsl(220, 13%, 88%)", fontSize: 12 }}
        />
        <Legend formatter={(v) => v === "bio_age_5_17" ? "Age 5-17" : "Age 17+"} />
        <Bar dataKey="bio_age_5_17" stackId="a" fill="hsl(174, 62%, 40%)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="bio_age_17_plus" stackId="a" fill="hsl(230, 65%, 48%)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
