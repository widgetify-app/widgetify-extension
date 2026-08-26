export enum WidgetKeys {
	comboWidget = 'comboWidget',
	arzLive = 'arzLive',
	news = 'news',
	calendar = 'calendar',
	weather = 'weather',
	todos = 'todos',
	tools = 'tools',
	notes = 'notes',
	wigiPad = 'wigiPad',
	network = 'network',
	yadKar = 'yadKar',
	HabitTracker = 'HabitTracker',
	search = 'search',
	bookmarks = 'bookmarks',
	widgetify = 'widgetify',
	clock = 'clock',
	pet = 'pet',
	transparentClock = 'transparentClock',
	moodTracker = 'moodTracker',
}

export interface WidgetPosition {
	col: number
	row: number
}

export interface WidgetSize {
	w: number
	h: number
	isVipOnly?: boolean
}

export interface StoredWidget {
	id: WidgetKeys
	instanceId: string
	position: WidgetPosition
	size: WidgetSize
	widgetId?: string | null
	meta?: any
	disabled?: boolean
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

export type WidgetCategory = 'all' | 'time' | 'productivity' | 'info' | 'lifestyle'

export interface WidgetVariantOption {
	id: string
	label: string
	size: WidgetSize
	isVipOnly?: boolean
	meta?: Record<string, any>
}

export interface WidgetDefinition {
	id: WidgetKeys
	label: string
	emoji: string
	category?: WidgetCategory
	isVipOnly?: boolean
	allowedSizes: WidgetSize[]
	defaultSize: WidgetSize
	variants?: WidgetVariantOption[]
	settingsTab?: WidgetTabKeys
	canDuplicate: boolean
	order?: number
	canToggle?: boolean
	isNew?: boolean
	disabled?: boolean
	soon?: boolean
	popular?: boolean
	isBeta?: boolean
	node: (instanceId: string, size: WidgetSize, meta?: any) => React.ReactNode
}

export interface WidgetItem
	extends Omit<
		WidgetDefinition,
		'allowedSizes' | 'defaultSize' | 'canDuplicate' | 'node'
	> {
	node: React.ReactNode
	order: number
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
