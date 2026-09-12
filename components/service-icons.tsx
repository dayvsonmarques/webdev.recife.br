import type { ReactNode } from 'react'

function IconBag() {
  return (
    <svg
      width="100" height="100" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M16 11V7a4 4 0 00-8 0v4" />
      <path d="M5 9h14l1 12H4L5 9z" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg
      width="100" height="100" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="12" y2="16" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg
      width="100" height="100" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" strokeWidth="0" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" strokeWidth="0" opacity="0.4" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" strokeWidth="0" opacity="0.4" />
    </svg>
  )
}

export type ServiceIconId = 'bag' | 'phone' | 'calendar'

export const SERVICE_ICONS: Record<ServiceIconId, ReactNode> = {
  bag: <IconBag />,
  phone: <IconPhone />,
  calendar: <IconCalendar />,
}
