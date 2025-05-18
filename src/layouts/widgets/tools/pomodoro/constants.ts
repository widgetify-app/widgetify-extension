import type { TimerMode } from './types'

export const modeColors = {
	work: 'rgb(96, 165, 250)',
	'short-break': 'rgb(74, 222, 128)',
	'long-break': 'rgb(168, 85, 247)',
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
