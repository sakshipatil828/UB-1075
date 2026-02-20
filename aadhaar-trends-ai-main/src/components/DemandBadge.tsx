import type { DemandLevel } from "@/utils/analytics";
import { Shield, AlertTriangle, TrendingDown } from "lucide-react";

const config: Record<DemandLevel, { bg: string; text: string; icon: typeof Shield; pulse: boolean }> = {
  "Normal": { bg: "bg-success/15 border-success/30", text: "text-success", icon: Shield, pulse: false },
  "Medium": { bg: "bg-info/15 border-info/30", text: "text-info", icon: Shield, pulse: false },
  "High Demand": { bg: "bg-warning/15 border-warning/30", text: "text-warning", icon: AlertTriangle, pulse: false },
  "Demand Alert": { bg: "bg-danger/15 border-danger/30", text: "text-danger", icon: AlertTriangle, pulse: true },
  "Decline Alert": { bg: "bg-destructive/15 border-destructive/30", text: "text-destructive", icon: TrendingDown, pulse: true },
};

const DemandBadge = ({ level }: { level: DemandLevel }) => {
  const c = config[level];
  const Icon = c.icon;

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 ${c.bg} ${c.pulse ? "pulse-alert" : ""}`}>
      <Icon className={`h-4 w-4 ${c.text}`} />
      <span className={`text-sm font-semibold ${c.text}`}>{level}</span>
    </div>
  );
};

export default DemandBadge;
