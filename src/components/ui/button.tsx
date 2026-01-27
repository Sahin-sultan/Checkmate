import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: 
          "bg-gradient-to-r from-blue-400/90 to-blue-500/90 text-white backdrop-blur-xl border border-blue-300/50 shadow-[0_8px_32px_rgba(96,165,250,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_8px_32px_rgba(96,165,250,0.5),0_0_48px_rgba(96,165,250,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0",
        purple: 
          "bg-gradient-to-r from-purple-400/90 to-purple-500/90 text-white backdrop-blur-xl border border-purple-300/50 shadow-[0_8px_32px_rgba(168,85,247,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_8px_32px_rgba(168,85,247,0.5),0_0_48px_rgba(168,85,247,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0",
        green: 
          "bg-gradient-to-r from-emerald-400/90 to-teal-500/90 text-white backdrop-blur-xl border border-emerald-300/50 shadow-[0_8px_32px_rgba(52,211,153,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_8px_32px_rgba(52,211,153,0.5),0_0_48px_rgba(52,211,153,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0",
        "green-light": 
          "bg-gradient-to-r from-emerald-200/70 to-teal-200/70 text-emerald-700 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(52,211,153,0.2),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_8px_32px_rgba(52,211,153,0.35),0_0_48px_rgba(52,211,153,0.2),inset_0_1px_0_rgba(255,255,255,0.5)] hover:-translate-y-1 active:translate-y-0",
        loading: 
          "bg-gradient-to-r from-orange-400/90 to-yellow-500/90 text-white backdrop-blur-xl border border-orange-300/50 shadow-[0_8px_32px_rgba(251,146,60,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_8px_32px_rgba(251,146,60,0.5),0_0_48px_rgba(251,146,60,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0",
        success: 
          "bg-gradient-to-r from-pink-400/90 to-rose-500/90 text-white backdrop-blur-xl border border-pink-300/50 shadow-[0_8px_32px_rgba(251,113,133,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_8px_32px_rgba(251,113,133,0.5),0_0_48px_rgba(251,113,133,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0",
        error: 
          "bg-gradient-to-r from-red-400/90 to-red-500/90 text-white backdrop-blur-xl border border-red-300/50 shadow-[0_8px_32px_rgba(248,113,113,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_8px_32px_rgba(248,113,113,0.5),0_0_48px_rgba(248,113,113,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0",
        destructive: 
          "bg-gradient-to-r from-red-400/90 to-red-500/90 text-white backdrop-blur-xl border border-red-300/50 shadow-[0_8px_32px_rgba(248,113,113,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_8px_32px_rgba(248,113,113,0.5),0_0_48px_rgba(248,113,113,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0",
        outline: 
          "border border-white/60 bg-white/40 backdrop-blur-xl hover:bg-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)] hover:-translate-y-1 active:translate-y-0",
        secondary: 
          "bg-white/50 backdrop-blur-xl text-secondary-foreground border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] hover:bg-white/70 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)] hover:-translate-y-1 active:translate-y-0",
        ghost: 
          "hover:bg-white/50 hover:backdrop-blur-xl hover:text-accent-foreground hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
        link: 
          "text-primary underline-offset-4 hover:underline",
        glass:
          "bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] hover:bg-white/60 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)] hover:-translate-y-1 active:translate-y-0",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-full px-4",
        lg: "h-14 rounded-full px-10 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
