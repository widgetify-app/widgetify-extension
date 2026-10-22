import type {
	PartnerWidgetKey,
	StoredWidget,
	WidgetPosition,
	WidgetSize,
} from '@/features/widgets/utils/layout-engine/types'
import type { WidgetWorkspace } from '@/services/widgets/widget-sync.hook'
import type { StoredWallpaper } from '@/common/types/wallpaper.interface'

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

export interface SlotBrowserTitle {
	id: string
	name: string
	template: string
}

export interface SlotLook {
	theme: string | null
	fontFamily: string | null
	browserTitle: SlotBrowserTitle | null
	wallpaper: StoredWallpaper | null
}

export interface WidgetSlot {
	workspace: WidgetWorkspace
	name: string | null
	updatedAt: number
	widgets: StoredWidget[]
	look: SlotLook | null
}

export interface WidgetSlotView {
	workspace: WidgetWorkspace
	label: string
	customName: string | null
	widgets: StoredWidget[]
	wallpaper: StoredWallpaper | null
	isActive: boolean
	isLocked: boolean
	isEmpty: boolean
}

export type WidgetSlotsTab = 'slots' | 'presets'

export interface FreeWidgetSlots {
	canUseSlots: boolean
	activeSlot: WidgetSlotView
	slots: WidgetSlotView[]
	isSwitching: boolean
	openSlot: (workspace: WidgetWorkspace) => Promise<boolean>
	switchSlot: (
		workspace: WidgetWorkspace,
		startWith?: StoredWidget[]
	) => Promise<boolean>
	renameSlot: (workspace: WidgetWorkspace, name: string) => void
	clearSlot: (workspace: WidgetWorkspace) => void
}

declare module '@/common/constants/store-keys' {
	interface StorageKV {
		activeWidgetSlot: WidgetWorkspace
		widgetSlots: WidgetSlot[]
	}
}

declare module '@/common/utils/call-event' {
	interface EventName {
		openWidgetSlotsModal: WidgetSlotsTab
	}
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

declare module '@/common/constants/store-keys' {
	interface StorageKV {
		[key: `compactPager:${string}`]: string
	}
}

export type PartnerScope = 'PROFILE' | 'ACCOUNT'

export type ContactRequirement = 'EMAIL_OR_PHONE' | 'PHONE' | 'EMAIL'

export type PartnerCategory = 'time' | 'productivity' | 'info' | 'lifestyle'

export interface PartnerSize {
	w: number
	h: number
	isVipOnly?: boolean
}

export interface PartnerVariant {
	id: string
	title: string
	size: { w: number; h: number }
	isVipOnly?: boolean
	meta?: Record<string, unknown>
}

export interface PartnerCatalogItem {
	widgetKey: PartnerWidgetKey
	slug: string
	title: string
	emoji: string
	iconUrl: string | null
	description: string | null
	category: PartnerCategory
	isVipOnly: boolean
	isNew: boolean
	allowedSizes: PartnerSize[]
	defaultSize: { w: number; h: number }
	variants: PartnerVariant[]
	canDuplicate: boolean
	widgetUrl: string
	origin: string
	scopes: PartnerScope[]
	contactRequirement: ContactRequirement
	allow: string[]
	sandbox: string[]
	timeoutMs: number | null
}

declare module '@/common/constants/store-keys' {
	interface StorageKV {
		partnerWidgetCatalog: Record<string, unknown>[]
	}
}
