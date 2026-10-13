/** Joins class names, skipping empty values. */
export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')
