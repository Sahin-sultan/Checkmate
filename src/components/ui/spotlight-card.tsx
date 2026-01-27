
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Whether to use custom sizing classes or default card sizing
     */
    customSize?: boolean;
    /**
     * The color of the spotlight
     */
    spotlightColor?: string;
}

export const GlowCard = ({
    children,
    className,
    customSize = false,
    spotlightColor = "rgba(255, 255, 255, 0.1)",
    ...props
}: GlowCardProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative overflow-hidden",
                !customSize && "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
                className
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute -inset-px transition duration-300 z-0"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
};
