import { DOT_FILL_RATIO } from '../constants'

interface DotGridLayout {
	columns: number
	cellSize: number
	dotSize: number
}

export function getDotGridLayout(
	count: number,
	width: number,
	height: number
): DotGridLayout | null {
	if (count <= 0 || width <= 0 || height <= 0) return null

	const idealColumns = Math.ceil(Math.sqrt((count * width) / height))
	const columns = Math.min(count, Math.max(1, idealColumns))
	const rows = Math.ceil(count / columns)
	const cellSize = Math.min(width / columns, height / rows)

	return {
		columns,
		cellSize,
		dotSize: Math.max(2, Math.floor(cellSize * DOT_FILL_RATIO)),
	}
}
