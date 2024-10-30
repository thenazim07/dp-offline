import { ref } from 'vue';

export function useBanglaNumbers() {
    // Map English digits to Bengali digits
    const numberMap = {
        '0': '০',
        '1': '১',
        '2': '২',
        '3': '৩',
        '4': '৪',
        '5': '৫',
        '6': '৬',
        '7': '৭',
        '8': '৮',
        '9': '৯',
    };

    const durationBanglaConversion = {
        'once': 'একবার',
        'day': 'দিন',
        'week': 'সপ্তাহ',
        'month': 'মাস',
        'year': 'বছর',
        'continue': 'চলবে',
        'not_required': '',
    };

    const convertToBangla = (numString: string) => {
        return numString
            .split('') // Split the number string into characters
            .map((digit) => (numberMap[digit] ? numberMap[digit] : digit)) // Map digits
            .join(''); // Join them back together
    };

    const convertDurationToBangla = (durationKey: string | n) => {
        return durationBanglaConversion[durationKey] || durationKey;
    };

    // Returning the function for converting numbers
    return {
        convertToBangla,
        convertDurationToBangla,
    };
}
