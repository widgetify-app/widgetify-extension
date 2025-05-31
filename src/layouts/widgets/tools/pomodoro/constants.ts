import type { TimerMode } from './types'

export const modeColors = {
  work: {
    light: 'rgb(59, 130, 246)',
    dark: 'rgb(96, 165, 250)',
    accent: 'blue-500',
  },
  'short-break': {
    light: 'rgb(34, 197, 94)',
    dark: 'rgb(74, 222, 128)',
    accent: 'green-500',
  },
  'long-break': {
    light: 'rgb(168, 85, 247)',
    dark: 'rgb(192, 132, 252)',
    accent: 'purple-500',
  },
}

export const modeLabels: Record<TimerMode, string> = {
  work: 'کار',
  'short-break': 'کوتاه',
  'long-break': 'بلند',
}

export const modeFullLabels: Record<TimerMode, string> = {
  work: 'زمان کار',
  'short-break': 'استراحت کوتاه',
  'long-break': 'استراحت بلند',
}
