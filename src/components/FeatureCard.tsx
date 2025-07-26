import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "primary" | "success" | "warning" | "accent";
}

const FeatureCard = ({ icon: Icon, title, description, color }: FeatureCardProps) => {
  const colorClasses = {
    primary: "bg-primary-light text-primary border-primary/20",
    success: "bg-success-light text-success border-success/20", 
    warning: "bg-warning-light text-warning border-warning/20",
    accent: "bg-accent-light text-accent-foreground border-accent/20"
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${colorClasses[color]} hover:shadow-custom-md transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
};

export default FeatureCard;