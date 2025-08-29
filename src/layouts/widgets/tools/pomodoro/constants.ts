import type { TimerMode } from './types'

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
