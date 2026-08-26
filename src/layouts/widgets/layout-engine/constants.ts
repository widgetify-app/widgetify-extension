import { type GridBreakpoint, type StoredWidget, WidgetKeys } from './types'

export const DEFAULT_COLS = 8
export const DEFAULT_CELL_HEIGHT = 96
export const DEFAULT_GAP = 8
export const MIN_CELL_WIDTH = 72

export const GRID_BREAKPOINTS: GridBreakpoint[] = [
	{
		name: 'lg',
		minContainerWidth: 900,
		cols: 8,
		cellHeight: 96,
		gap: 8,
	},
	{
		name: 'md',
		minContainerWidth: 640,
		cols: 6,
		cellHeight: 88,
		gap: 8,
	},
	{
		name: 'sm',
		minContainerWidth: 420,
		cols: 4,
		cellHeight: 80,
		gap: 6,
	},
	{
		name: 'xs',
		minContainerWidth: 0,
		cols: 2,
		cellHeight: 72,
		gap: 6,
	},
]

export const DEFAULT_WIDGET_LAYOUT: StoredWidget[] = [
	{
		id: WidgetKeys.clock,
		instanceId: 'clock-default',
		position: { col: 6, row: 0 },
		size: { w: 2, h: 1 },
	},
	{
		id: WidgetKeys.search,
		instanceId: 'search-default',
		position: { col: 4, row: 1 },
		size: { w: 4, h: 1 },
	},
	{
		id: WidgetKeys.bookmarks,
		instanceId: 'bookmarks-default',
		position: { col: 4, row: 2 },
		size: { w: 4, h: 2 },
	},
]
