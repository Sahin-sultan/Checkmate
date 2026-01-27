import { useEffect, useState } from "react";

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

interface ConfettiProps {
  x: number;
  y: number;
  onComplete: () => void;
}

const colors = ["#d4af37", "#8b1538", "#2d5016", "#f5f1e8", "#DCCBC7"];

const Confetti = ({ x, y, onComplete }: ConfettiProps) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    const newParticles: ConfettiParticle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: x + (Math.random() - 0.5) * 100,
      y: y,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.3,
    }));
    setParticles(newParticles);

    const timeout = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [x, y, onComplete]);

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            width: "10px",
            height: "10px",
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </>
  );
};

export default Confetti;
