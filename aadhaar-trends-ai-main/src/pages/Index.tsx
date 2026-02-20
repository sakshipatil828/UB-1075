import { useState, useMemo } from "react";
import { Fingerprint, MapPin, BarChart3, Brain, Calendar } from "lucide-react";
import { STATES, getDistricts, getFilteredData, aggregateByMonth } from "@/data/aadhaarData";
import { analyzeTrend, predictNextMonth, predictNext6Months, classifyDemand, detectAnomalies, generateRecommendations } from "@/utils/analytics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatCard from "@/components/StatCard";
import DemandBadge from "@/components/DemandBadge";
import RecommendationCard from "@/components/RecommendationCard";
import { EnrollmentTrendChart, AgeDistributionChart } from "@/components/Charts";

const Index = () => {
  const [selectedState, setSelectedState] = useState(STATES[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("__all__");

  const districts = useMemo(() => getDistricts(selectedState), [selectedState]);

  const analysis = useMemo(() => {
    const filtered = getFilteredData(selectedState, selectedDistrict === "__all__" ? undefined : selectedDistrict);
    const monthly = aggregateByMonth(filtered);
    const values = monthly.map((m) => m.biometric_count);

    const trend = analyzeTrend(values);
    const prediction = predictNextMonth(values);
    const currentDemand = classifyDemand(values[values.length - 1] || 0, values.slice(0, -1));
    const predictedDemand = classifyDemand(prediction.predictedValue, values);
    const anomalies = detectAnomalies(monthly.map((m) => ({ month: m.month, value: m.biometric_count })));
    const forecast6 = predictNext6Months(monthly);
    const recommendations = generateRecommendations(trend, currentDemand, prediction, anomalies);

    const total = values.reduce((a, b) => a + b, 0);
    const latest = values[values.length - 1] || 0;
    const prev = values[values.length - 2] || 1;
    const monthChange = ((latest - prev) / prev) * 100;

    // Predicted month label
    const lastMonth = monthly[monthly.length - 1]?.month || "2025-02";
    const [y, m] = lastMonth.split("-").map(Number);
    const nextMonth = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;

    return {
      monthly,
      trend,
      prediction,
      currentDemand,
      predictedDemand,
      anomalies,
      recommendations,
      forecast6,
      total,
      latest,
      monthChange,
      nextMonth,
    };
  }, [selectedState, selectedDistrict]);

  const demandVariant = (d: string) => {
    if (d === "Demand Alert") return "danger" as const;
    if (d === "High Demand") return "warning" as const;
    if (d === "Decline Alert") return "danger" as const;
    if (d === "Medium") return "info" as const;
    return "success" as const;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-header px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10 backdrop-blur">
            <Fingerprint className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary-foreground tracking-tight">
              Aadhaar Enrollment Demand Prediction
            </h1>
            <p className="text-xs text-primary-foreground/70">AI-powered trend analysis & forecasting system</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary-foreground/60" />
            <span className="text-xs font-medium text-primary-foreground/60">Model: Linear Regression + MA</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters</span>
          </div>
          <Select value={selectedState} onValueChange={(v) => { setSelectedState(v); setSelectedDistrict("__all__"); }}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {STATES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="All Districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Districts</SelectItem>
              {districts.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Enrollments"
            value={analysis.total}
            subtitle="All time"
          />
          <StatCard
            title="Latest Month"
            value={analysis.latest}
            trend={analysis.monthChange > 2 ? "up" : analysis.monthChange < -2 ? "down" : "stable"}
            trendValue={`${analysis.monthChange > 0 ? "+" : ""}${analysis.monthChange.toFixed(1)}% MoM`}
          />
          <StatCard
            title="Predicted Next Month"
            value={analysis.prediction.predictedValue}
            subtitle={`Confidence: ${analysis.prediction.confidence}`}
            variant={demandVariant(analysis.predictedDemand)}
          />
          <StatCard
            title="Current Demand"
            value={analysis.currentDemand}
            variant={demandVariant(analysis.currentDemand)}
          />
          <StatCard
            title="Anomalies Detected"
            value={analysis.anomalies.length}
            subtitle={analysis.anomalies.length > 0 ? `${analysis.anomalies.filter(a => a.type === "spike").length} spikes, ${analysis.anomalies.filter(a => a.type === "drop").length} drops` : "None"}
            variant={analysis.anomalies.length > 2 ? "warning" : "default"}
          />
        </div>

        {/* Alert Banner */}
        {(analysis.currentDemand === "Demand Alert" || analysis.currentDemand === "Decline Alert") && (
          <div className={`flex items-center gap-3 rounded-lg border p-4 ${analysis.currentDemand === "Demand Alert" ? "bg-danger/10 border-danger/30" : "bg-warning/10 border-warning/30"}`}>
            <DemandBadge level={analysis.currentDemand} />
            <p className="text-sm text-foreground">
              {analysis.currentDemand === "Demand Alert"
                ? "Enrollment demand is significantly above normal. Immediate capacity increase recommended."
                : "Enrollment numbers are declining. Investigation and awareness campaign recommended."}
            </p>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EnrollmentTrendChart
              data={analysis.monthly}
              forecast={analysis.forecast6.forecast}
              anomalies={analysis.anomalies.map((a) => a.month)}
            />
          </div>
          <div>
            <AgeDistributionChart data={analysis.monthly} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Trend Summary */}
          <div className="rounded-lg border bg-card p-5 space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <BarChart3 className="h-4 w-4 text-primary" />
              Trend Analysis Summary
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground">Overall Trend</p>
                <p className="mt-1 text-sm font-semibold capitalize text-foreground">{analysis.trend.trend}</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground">Growth Rate</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{analysis.trend.percentChange.toFixed(1)}%</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground">Predicted Demand</p>
                <DemandBadge level={analysis.predictedDemand} />
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground">Model Confidence</p>
                <p className="mt-1 text-sm font-semibold capitalize text-foreground">{analysis.prediction.confidence}</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-lg border bg-card p-5 space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="h-4 w-4 text-accent" />
              AI Recommendations
            </h3>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {analysis.recommendations.map((rec, i) => (
                <RecommendationCard key={i} rec={rec} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t pt-4 pb-6">
          <p className="text-center text-xs text-muted-foreground">
            Aadhaar Enrollment Demand Prediction System • Hackathon Prototype • Uses anonymized/aggregated data only
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
