import { DEFAULT_COLS, MAX_CANVAS_ROWS } from './constants'
import type { StoredWidget } from './types'

export function rowCapFor(cols: number): number {
	return Math.ceil((MAX_CANVAS_ROWS * DEFAULT_COLS) / Math.max(1, cols))
}

function bottomOf(layout: StoredWidget[]): number {
	return Math.max(0, ...layout.map((w) => w.position.row + w.size.h))
}

export function staysWithinRowCap(
	next: StoredWidget[],
	previous: StoredWidget[],
	cols: number
): boolean {
	return bottomOf(next) <= Math.max(rowCapFor(cols), bottomOf(previous))
}
