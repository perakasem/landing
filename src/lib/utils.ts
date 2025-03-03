type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];

export function formatDate(date: string, dateStyle: DateStyle = 'long', locales = 'en') {
    // Replace dashes with slashes for Safari compatibility
    const dateToFormat = new Date(date.replaceAll('-', '/'));
    return new Intl.DateTimeFormat(locales, { dateStyle }).format(dateToFormat);
}

export function convertDateSeparators(date: string): string {
    const parts = date.split('-');
    if (parts.length !== 3) return date; // fallback if format isn’t as expected
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
}

export function parseTags(tags: string[]): string {
    return tags.join(", ");
}
