import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  variant?: "default" | "warning" | "danger" | "success" | "info";
}

const variantClasses: Record<string, string> = {
  default: "border-border",
  warning: "border-warning/40 bg-warning/5",
  danger: "border-danger/40 bg-danger/5 pulse-alert",
  success: "border-success/40 bg-success/5",
  info: "border-info/40 bg-info/5",
};

const StatCard = ({ title, value, subtitle, trend, trendValue, variant = "default" }: StatCardProps) => (
  <div className={`stat-card ${variantClasses[variant]}`}>
    <p className="text-sm font-medium text-muted-foreground">{title}</p>
    <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{typeof value === "number" ? value.toLocaleString() : value}</p>
    <div className="mt-1 flex items-center gap-1.5">
      {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-success" />}
      {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-danger" />}
      {trend === "stable" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
      {trendValue && <span className="text-xs text-muted-foreground">{trendValue}</span>}
      {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
    </div>
  </div>
);

export default StatCard;
