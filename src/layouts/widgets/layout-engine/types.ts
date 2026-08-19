export enum WidgetKeys {
	comboWidget = 'comboWidget',
	arzLive = 'arzLive',
	news = 'news',
	calendar = 'calendar',
	weather = 'weather',
	todos = 'todos',
	tools = 'tools',
	notes = 'notes',
	youtube = 'youtube',
	wigiPad = 'wigiPad',
	network = 'network',
	yadKar = 'yadKar',
	HabitTracker = 'HabitTracker',
	search = 'search',
	bookmarks = 'bookmarks',
	widgetify = 'widgetify',
	clock = 'clock',
	date = 'date',
	pet = 'pet',
}

export interface WidgetPosition {
	col: number
	row: number
}

export interface WidgetSize {
	w: number
	h: number
}

export interface StoredWidget {
	id: WidgetKeys
	instanceId: string
	position: WidgetPosition
	size: WidgetSize
	widgetId?: string | null
}

export type LayoutOperation =
	| 'move'
	| 'resize'
	| 'add'
	| 'duplicate'
	| 'remove'
	| 'responsive-reflow'

export interface GridBreakpoint {
	name: 'xs' | 'sm' | 'md' | 'lg'
	minContainerWidth: number
	cols: number
	cellHeight: number
	gap: number
}

import type { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'

export interface WidgetDefinition {
	id: WidgetKeys
	label: string
	emoji: string
	allowedSizes: WidgetSize[]
	defaultSize: WidgetSize
	settingsTab?: WidgetTabKeys
	canDuplicate: boolean
	preview: () => React.ReactNode
	node: (instanceId: string, size: WidgetSize) => React.ReactNode
}

export interface LayoutEngineOptions {
	layout: StoredWidget[]
	operation: LayoutOperation
	instanceId?: string
	targetPosition?: WidgetPosition
	targetSize?: WidgetSize
	newWidget?: StoredWidget
	cols: number
	allowedSizes?: WidgetSize[]
}
