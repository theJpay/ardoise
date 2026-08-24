type FormatOptions = {
    now?: Date;
    short?: boolean;
};

const shortMonthDay = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
const shortMonthDayYear = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
});

export function formatRelativeDate(date: Date, options: FormatOptions = {}): string {
    const { now = new Date(), short = false } = options;
    const time = date.getTime();
    if (!Number.isFinite(time)) {
        return "—";
    }

    const diffSec = Math.floor((now.getTime() - time) / 1000);

    if (Math.abs(diffSec) < 60) {
        return short ? "now" : "just now";
    }
    if (diffSec < 0) {
        return formatAbsolute(date, now, short);
    }

    const calendarDays = calendarDaysBetween(date, now);

    if (calendarDays === 0) {
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) {
            return short ? `${diffMin}m` : `${diffMin} min ago`;
        }
        const diffHours = Math.floor(diffMin / 60);
        return short ? `${diffHours}h` : `${diffHours}h ago`;
    }
    if (calendarDays === 1) {
        return short ? "1d" : "yesterday";
    }
    if (calendarDays <= 29) {
        return short ? `${calendarDays}d` : `${calendarDays} days ago`;
    }

    return formatAbsolute(date, now, short);
}

function formatAbsolute(date: Date, now: Date, short: boolean): string {
    if (short || date.getFullYear() === now.getFullYear()) {
        return shortMonthDay.format(date);
    }
    return shortMonthDayYear.format(date);
}

function calendarDaysBetween(past: Date, now: Date): number {
    const pastMidnight = new Date(past.getFullYear(), past.getMonth(), past.getDate()).getTime();
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return Math.round((nowMidnight - pastMidnight) / 86_400_000);
}
