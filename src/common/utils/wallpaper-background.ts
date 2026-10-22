import type { StoredWallpaper } from '../types/wallpaper.interface'

const GRADIENT_DIRECTION_MAP: Record<string, string> = {
	'to-r': 'to right',
	'to-l': 'to left',
	'to-t': 'to top',
	'to-b': 'to bottom',
	'to-tr': 'to top right',
	'to-tl': 'to top left',
	'to-br': 'to bottom right',
	'to-bl': 'to bottom left',
}

export function gradientBackground(
	gradient: NonNullable<StoredWallpaper['gradient']>
): string {
	const { from, to, direction } = gradient
	return `linear-gradient(${GRADIENT_DIRECTION_MAP[direction] ?? direction}, ${from}, ${to})`
}
