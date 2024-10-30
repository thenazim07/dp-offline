export function timeAgo(time: number | Date) {
    const between = Date.now() / 1000 - Number(time);
    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute');
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour');
    } else {
        return pluralize(~~(between / 86400), ' day');
    }
}

export function pluralize(time: number, label: string) {
    if (time === 1) {
        return time + label;
    }

    return `${time + label}s`;
}

export function isAbsolute(url: string) {
    return /^https?:\/\//.test(url);
}

export const dateFormat = (date: String) => {
    const arrayDate = date.split('-');
    const dob: String = `${arrayDate[2]}-${arrayDate[1]}-${arrayDate[0]}`;
    return dob;
};

export const truncate = (input, max) => (input.length > max ? `${input.substring(0, max)}...` : input);
