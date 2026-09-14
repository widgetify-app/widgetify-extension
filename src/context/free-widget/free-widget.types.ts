import type {
	StoredWidget,
	WidgetPosition,
	WidgetSize,
} from '@/layouts/widgets/layout-engine/types'

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
	getGridBounds: () => { cols: number; maxRows: number }
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
	setMaxRows: (maxRows: number) => void
	applyPresetLayout: (presetWidgets: StoredWidget[]) => Promise<boolean>
}

export type FreeWidgetContextType = FreeWidgetLayoutState & FreeWidgetActions

export interface FreeWidgetDerivedState {
	primaryBookmarkInstanceId: string | null
}
