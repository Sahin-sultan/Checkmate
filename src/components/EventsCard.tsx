import { Calendar } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface Event {
  id: string;
  name: string;
  date: string;
  time?: string;
}

interface EventsCardProps {
  events: Event[];
  delay?: number;
  fullWidth?: boolean;
}

const EventsCard = ({ events, delay = 0, fullWidth = false }: EventsCardProps) => {
  return (
    <div
      className={`card-earthy p-6 relative overflow-hidden ${fullWidth ? 'col-span-full' : ''}`}
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
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-card-foreground" />
          <h3 className="font-heading text-lg font-semibold text-card-foreground">
            {fullWidth ? "Important Dates" : "Upcoming Events"}
          </h3>
        </div>

        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-lg border border-white/5 p-4 transition-all duration-300 hover:translate-x-1 hover:bg-white/5"
            >
              <p className="font-body text-base font-medium text-card-foreground">
                {event.name}
              </p>
              <p className="font-mono text-xs text-card-foreground/70">
                {event.date}{event.time ? ` at ${event.time}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsCard;
