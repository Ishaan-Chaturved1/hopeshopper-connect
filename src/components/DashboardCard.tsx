import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  count?: number;
  color: "primary" | "success" | "warning" | "accent";
  onClick: () => void;
}

const DashboardCard = ({ icon: Icon, title, count, color, onClick }: DashboardCardProps) => {
  const colorClasses = {
    primary: "bg-gradient-primary text-primary-foreground hover:shadow-custom-md",
    success: "bg-gradient-success text-success-foreground hover:shadow-custom-md", 
    warning: "bg-gradient-warning text-warning-foreground hover:shadow-custom-md",
    accent: "bg-accent text-accent-foreground hover:shadow-custom-md"
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${colorClasses[color]}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <Icon className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold">{title}</h3>
            {count !== undefined && (
              <p className="text-2xl font-bold mt-1">{count}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;