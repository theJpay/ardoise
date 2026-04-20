const shortMonthDay = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
const shortMonthDayYear = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
});

export function formatRelativeDate(date: Date, now: Date = new Date()): string {
    const time = date.getTime();
    if (!Number.isFinite(time)) {
        return "—";
    }

    const diffSec = Math.floor((now.getTime() - time) / 1000);

    if (Math.abs(diffSec) < 60) {
        return "just now";
    }
    if (diffSec < 0) {
        return formatAbsolute(date, now);
    }

    const calendarDays = calendarDaysBetween(date, now);

    if (calendarDays === 0) {
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) {
            return `${diffMin} min ago`;
        }
        return `${Math.floor(diffMin / 60)}h ago`;
    }
    if (calendarDays === 1) {
        return "yesterday";
    }
    if (calendarDays <= 29) {
        return `${calendarDays} days ago`;
    }

    return formatAbsolute(date, now);
}

function formatAbsolute(date: Date, now: Date): string {
    return date.getFullYear() === now.getFullYear()
        ? shortMonthDay.format(date)
        : shortMonthDayYear.format(date);
}

function calendarDaysBetween(past: Date, now: Date): number {
    const pastMidnight = new Date(past.getFullYear(), past.getMonth(), past.getDate()).getTime();
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return Math.round((nowMidnight - pastMidnight) / 86_400_000);
}
