
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface Task {
    id: string;
    name: string;
    dueTime: string;
    completed: boolean;
}

interface Event {
    id: string;
    name: string;
    date: string;
    time?: string;
}

export const useNotifications = (tasks: Task[], events: Event[]) => {
    // Request permission on mount
    useEffect(() => {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }, []);

    const checkDeadlines = useCallback(() => {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;

        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        // Check Tasks
        tasks.forEach(task => {
            if (task.completed) return;

            // Parse "2:00 PM" format
            const [timeStr, period] = task.dueTime.split(' ');
            if (!timeStr || !period) return;

            const [hoursStr, minutesStr] = timeStr.split(':');
            let hours = parseInt(hoursStr);
            const minutes = parseInt(minutesStr);

            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            // Check if task is due in 30 minutes
            const taskTimeInMinutes = hours * 60 + minutes;
            const currentTimeInMinutes = currentHours * 60 + currentMinutes;
            const diff = taskTimeInMinutes - currentTimeInMinutes;

            // Notify if due in exactly 30 minutes (to avoid spamming, we'd need state to track 'notified', 
            // but for simplicity we'll just check a small window or rely on the interval)
            // A better way is to track notified IDs.
            // For this MVP, we'll just show a toast if it's close, and let the OS handle notification deduplication if possible,
            // or just assume the user will act.
            // Actually, without state tracking, this will spam every minute.
            // Let's just return here. Developing a robust notification system requires localized state of 'hasNotified'.
        });
    }, [tasks]);

    // We need a ref to store notified items to avoid spam
    // efficiently.
};

// Re-writing with state tracking
import { useState, useRef } from 'react';

export const useNotificationSystem = (tasks: Task[], events: Event[]) => {
    const [permission, setPermission] = useState(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );

    const notifiedIds = useRef<Set<string>>(new Set());

    useEffect(() => {
        if ('Notification' in window && permission === 'default') {
            Notification.requestPermission().then(setPermission);
        }
    }, []);

    useEffect(() => {
        if (permission !== 'granted') return;

        const checkInterval = setInterval(() => {
            const now = new Date();

            // Check Tasks (Assuming dueTime is for TODAY)
            tasks.forEach(task => {
                if (task.completed || notifiedIds.current.has(task.id)) return;

                // Simple parser for "HH:MM AM/PM"
                const timeMatch = task.dueTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
                if (!timeMatch) return;

                let [_, h, m, p] = timeMatch;
                let hours = parseInt(h);
                const minutes = parseInt(m);

                if (p.toUpperCase() === 'PM' && hours !== 12) hours += 12;
                if (p.toUpperCase() === 'AM' && hours === 12) hours = 0;

                const taskDate = new Date();
                taskDate.setHours(hours, minutes, 0, 0);

                const diffMinutes = (taskDate.getTime() - now.getTime()) / (1000 * 60);

                // Notify if within 30 minutes
                if (diffMinutes > 0 && diffMinutes <= 30) {
                    new Notification('Task Due Soon', {
                        body: `"${task.name}" is due in ${Math.round(diffMinutes)} minutes!`,
                        icon: '/icon.png' // Optional
                    });
                    notifiedIds.current.add(task.id);
                    toast.info(`Task "${task.name}" is due soon!`);
                }
            });

            // Check Events (Date + Optional Time)
            events.forEach(event => {
                if (notifiedIds.current.has(event.id)) return;

                const eventDate = new Date(event.date);
                // If event has time, combine them
                if (event.time) {
                    const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
                    if (timeMatch) {
                        let [_, h, m, p] = timeMatch;
                        let hours = parseInt(h);
                        const minutes = parseInt(m);
                        if (p.toUpperCase() === 'PM' && hours !== 12) hours += 12;
                        if (p.toUpperCase() === 'AM' && hours === 12) hours = 0;
                        eventDate.setHours(hours, minutes, 0, 0);
                    }
                } else {
                    // All day event, notify if it's today
                    eventDate.setHours(9, 0, 0, 0); // Default notification at 9 AM for all day
                }

                // Check date match
                const isToday = eventDate.getDate() === now.getDate() &&
                    eventDate.getMonth() === now.getMonth() &&
                    eventDate.getFullYear() === now.getFullYear();

                if (isToday) {
                    // For timed events, check proximity
                    if (event.time) {
                        const diffMinutes = (eventDate.getTime() - now.getTime()) / (1000 * 60);
                        if (diffMinutes > 0 && diffMinutes <= 60) {
                            new Notification('Upcoming Event', {
                                body: `"${event.name}" is starting soon!`,
                            });
                            notifiedIds.current.add(event.id);
                            toast.info(`Event "${event.name}" is starting soon!`);
                        }
                    } else {
                        // All day event - notify once if we haven't already (and it's currently roughly 'now' or we just loaded)
                        // Just notify once on load or when date flips
                        if (!notifiedIds.current.has(event.id)) {
                            new Notification('Event Today', {
                                body: `Today: ${event.name}`,
                            });
                            notifiedIds.current.add(event.id);
                            toast.info(`Today: ${event.name}`);
                        }
                    }
                }
            });

        }, 60000); // Check every minute

        return () => clearInterval(checkInterval);
    }, [tasks, events, permission]);

    return { permission };
};
