import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function tailwindMerge(...classes: ClassValue[]) {
    return twMerge(clsx(classes));
}
export type { ClassValue } from 'clsx';
