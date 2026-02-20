import { AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";
import type { Recommendation } from "@/utils/analytics";

const priorityConfig = {
  critical: { icon: AlertTriangle, bg: "bg-danger/10 border-danger/30", text: "text-danger", label: "Critical" },
  high: { icon: AlertCircle, bg: "bg-warning/10 border-warning/30", text: "text-warning", label: "High" },
  medium: { icon: Info, bg: "bg-info/10 border-info/30", text: "text-info", label: "Medium" },
  low: { icon: CheckCircle, bg: "bg-success/10 border-success/30", text: "text-success", label: "Low" },
};

const RecommendationCard = ({ rec }: { rec: Recommendation }) => {
  const config = priorityConfig[rec.priority];
  const Icon = config.icon;

  return (
    <div className={`flex gap-3 rounded-lg border p-4 ${config.bg}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.text}`} />
      <div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase ${config.text}`}>{config.label}</span>
        </div>
        <p className="mt-0.5 text-sm font-medium text-foreground">{rec.action}</p>
        <p className="mt-1 text-xs text-muted-foreground">{rec.reason}</p>
      </div>
    </div>
  );
};

export default RecommendationCard;
