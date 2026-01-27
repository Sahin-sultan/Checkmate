interface StatsCardProps {
  value: string | number;
  label: string;
  delay?: number;
}

import { GlowingEffect } from "@/components/ui/glowing-effect";

const StatsCard = ({ value, label, delay = 0 }: StatsCardProps) => {
  return (
    <div
      className="stats-card p-6 relative overflow-hidden"
    >
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
      />
      <div className="relative z-10">
        <p className="font-mono text-4xl font-medium text-primary">{value}</p>
        <p className="mt-2 font-body text-sm font-medium text-card-foreground">
          {label}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
