
interface CalendarEvent {
    name: string;
    date: string; // "January 30, 2026"
    time?: string; // "10:00 AM"
    description?: string;
    location?: string;
}

export const generateICS = (event: CalendarEvent): string => {
    // Parse date and time
    const dateStr = `${event.date} ${event.time || '00:00'}`;
    const startDate = new Date(dateStr);

    if (isNaN(startDate.getTime())) {
        // Fallback or better parsing if needed. 
        // Given the props seem to use "January 30, 2026 10:00 AM", modern browsers usually handle this.
        // If not, we might need a library, but let's try native first.
        console.error("Invalid date format");
        return "";
    }

    // Create end date (default 1 hour for now)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const now = formatDate(new Date());
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    const icsLines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Checkmate//App//EN',
        'BEGIN:VEVENT',
        `UID:${now}-${Math.random().toString(36).substr(2, 9)}@checkmate.app`,
        `DTSTAMP:${now}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${event.name}`,
        `DESCRIPTION:${event.description || 'Added from Checkmate App'}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ];

    return icsLines.join('\r\n');
};

export const downloadICS = (event: CalendarEvent) => {
    const icsContent = generateICS(event);
    if (!icsContent) return;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.name.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const addToGoogleCalendar = (event: CalendarEvent) => {
    const dateStr = `${event.date} ${event.time || ''}`;
    const startDate = new Date(dateStr);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration default

    const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.append("action", "TEMPLATE");
    url.searchParams.append("text", event.name);
    url.searchParams.append("dates", `${start}/${end}`);
    url.searchParams.append("details", "Added from Checkmate App");

    window.open(url.toString(), "_blank");
}
