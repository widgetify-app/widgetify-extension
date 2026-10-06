import type {
	StoredWidget,
	WidgetPosition,
	WidgetSize,
} from '@/features/widgets/utils/layout-engine/types'

export interface FreeWidgetLayoutState {
	savedLayout: StoredWidget[]
	runtimeLayout: StoredWidget[]
	cols: number
	cellWidth: number
	cellHeight: number
	gap: number
	isListFallback: boolean
	isLoaded: boolean
	canvasMode: 'normal' | 'edit'
	selectedInstanceId: string | null
}

export interface FreeWidgetActions {
	setCanvasMode: (mode: 'normal' | 'edit') => void
	setSelectedInstanceId: (id: string | null) => void
	resizeWidget: (instanceId: string, newSize: WidgetSize) => boolean
	moveWidget: (instanceId: string, targetPosition: WidgetPosition) => boolean
	startDragPreview: () => void
	updateDragPreview: (instanceId: string, targetPosition: WidgetPosition) => void
	endDragPreview: (instanceId: string, targetPosition: WidgetPosition | null) => void
	addWidget: (
		id: string,
		targetPosition?: WidgetPosition,
		initialSize?: WidgetSize,
		meta?: Record<string, any>
	) => Promise<boolean>
	duplicateWidget: (instanceId: string) => Promise<boolean>
	removeWidget: (instanceId: string) => boolean
	updateWidgetSettings: (instanceId: string, meta: any) => void
	updateWidgetVariant: (
		instanceId: string,
		newSize: WidgetSize,
		meta?: Record<string, any>
	) => boolean
	updateContainerWidth: (containerWidth: number) => void
	applyPresetLayout: (presetWidgets: StoredWidget[]) => Promise<boolean>
}

export type FreeWidgetContextType = FreeWidgetLayoutState & FreeWidgetActions

export interface FreeWidgetDerivedState {
	primaryBookmarkInstanceId: string | null
}

export enum WidgetTabKeys {
	widget_management = 'widget_management',
	wigiArz = 'wigiArz',
	news_settings = 'news_settings',
	weather_settings = 'weather_settings',
	combo_settings = 'combo_settings',
	Pet = 'pet_settings',
	dot_calendar_settings = 'dot_calendar_settings',
	calendar_settings = 'calendar_settings',
}

declare module '@/common/utils/call-event' {
	interface EventName {
		openWidgetsSettings: {
			tab: WidgetTabKeys | null
			instanceId?: string
			size?: { w: number; h: number }
		}
	}
}
