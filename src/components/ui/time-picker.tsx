
import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface TimePickerProps {
    value?: string;
    onChange: (time: string) => void;
    className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
    const [hour, setHour] = React.useState("12");
    const [minute, setMinute] = React.useState("00");
    const [period, setPeriod] = React.useState<"AM" | "PM">("PM");

    // Parse initial value
    React.useEffect(() => {
        if (value) {
            const parts = value.split(/[:\s]/); // split by colon or space
            // Expected format "2:30 PM" -> ["2", "30", "PM"]
            // Or "14:00" -> We might need to handle basic normalization if data varies

            if (parts.length >= 2) {
                let h = parts[0];
                let m = parts[1];
                let p = parts[2] as "AM" | "PM";

                // Basic validation
                if (p !== "AM" && p !== "PM") p = "PM";

                setHour(h);
                setMinute(m);
                setPeriod(p);
            }
        }
    }, [value]);

    const updateTime = (newHour: string, newMinute: string, newPeriod: string) => {
        onChange(`${newHour}:${newMinute} ${newPeriod}`);
    };

    const handleHourChange = (val: string) => {
        setHour(val);
        updateTime(val, minute, period);
    };

    const handleMinuteChange = (val: string) => {
        setMinute(val);
        updateTime(hour, val, period);
    };

    const handlePeriodChange = (val: "AM" | "PM") => {
        setPeriod(val);
        updateTime(hour, minute, val);
    };

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')); // 00, 05, 10... 55

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="grid gap-1 text-center">
                <Select value={hour} onValueChange={handleHourChange}>
                    <SelectTrigger className="w-[70px] bg-zinc-900 border-white/10 text-white">
                        <SelectValue placeholder="12" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white h-[200px]">
                        {hours.map((h) => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <span className="text-xl text-white/50">:</span>
            <div className="grid gap-1 text-center">
                <Select value={minute} onValueChange={handleMinuteChange}>
                    <SelectTrigger className="w-[70px] bg-zinc-900 border-white/10 text-white">
                        <SelectValue placeholder="00" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white h-[200px]">
                        {minutes.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-1 text-center">
                <Select value={period} onValueChange={handlePeriodChange}>
                    <SelectTrigger className="w-[70px] bg-zinc-900 border-white/10 text-white">
                        <SelectValue placeholder="PM" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
