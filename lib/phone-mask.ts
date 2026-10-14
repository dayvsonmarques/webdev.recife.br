/**
 * Brazilian phone mask applied while typing: "(81) 99999-8888" (mobile) or "(81) 3333-4444" (landline).
 * Separators appear only once the next digit exists, so backspacing never gets stuck on them.
 */
export function maskBrPhone(value: string) {
  const d = value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 11)
  if (d.length <= 2) return d
  const ddd = `(${d.slice(0, 2)}) `
  if (d.length <= 6) return ddd + d.slice(2)
  if (d.length <= 10) return `${ddd}${d.slice(2, 6)}-${d.slice(6)}`
  return `${ddd}${d.slice(2, 7)}-${d.slice(7)}`
}
