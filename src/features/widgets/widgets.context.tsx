import type React from 'react'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import {
	DEFAULT_CELL_HEIGHT,
	DEFAULT_COLS,
	DEFAULT_GAP,
	GRID_BREAKPOINTS,
	MIN_CELL_WIDTH,
} from '@/features/widgets/utils/layout-engine/constants'
import {
	type StoredWidget,
	WidgetKeys,
} from '@/features/widgets/utils/layout-engine/types'
import { useAppearance } from '@/context/appearance.context'
import { useAuth } from '@/context/auth.context'
import Analytics from '@/analytics'
import { reflowForColumns } from './utils/widget-layout-helpers'
import type { LayoutSyncStatus } from './utils/layout-sync'
import { useWidgetSync } from './hooks/use-widget-sync'
import { useWidgetOperations } from './hooks/use-widget-operations'
import { useWidgetDrag } from './hooks/use-widget-drag'
import { usePartnerCatalogSync } from './hooks/use-partner-catalog-sync'
import type {
	FreeWidgetActions,
	FreeWidgetContextType,
	FreeWidgetDerivedState,
	FreeWidgetLayoutState,
} from './types'

export type {
	FreeWidgetActions,
	FreeWidgetContextType,
	FreeWidgetDerivedState,
	FreeWidgetLayoutState,
}

const FreeWidgetLayoutContext = createContext<FreeWidgetLayoutState | null>(null)
const FreeWidgetActionsContext = createContext<FreeWidgetActions | null>(null)
const FreeWidgetDerivedContext = createContext<FreeWidgetDerivedState | null>(null)

interface LayoutSyncState {
	status: LayoutSyncStatus
	retry: () => void
}

const LayoutSyncContext = createContext<LayoutSyncState | null>(null)

export function FreeWidgetProvider({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isVip, token } = useAuth()
	usePartnerCatalogSync()
	const { canvasMode, setCanvasMode, selectedInstanceId, setSelectedInstanceId } =
		useAppearance()

	const [isLoaded, setIsLoaded] = useState<boolean>(false)
	const [savedLayout, setSavedLayout] = useState<StoredWidget[]>([])
	const [runtimeLayout, setRuntimeLayout] = useState<StoredWidget[]>([])
	const [cols, setCols] = useState<number>(DEFAULT_COLS)
	const [cellHeight, setCellHeight] = useState<number>(DEFAULT_CELL_HEIGHT)
	const [gap, setGap] = useState<number>(DEFAULT_GAP)
	const [cellWidth, setCellWidth] = useState<number>(100)
	const [isListFallback, setIsListFallback] = useState<boolean>(false)

	const savedLayoutRef = useRef<StoredWidget[]>([])
	const colsRef = useRef<number>(DEFAULT_COLS)
	const runtimeLayoutRef = useRef<StoredWidget[]>([])
	const isVipRef = useRef<boolean>(isVip)
	const selectedInstanceIdRef = useRef<string | null>(selectedInstanceId)
	const isEditingRef = useRef<boolean>(canvasMode === 'edit')

	useEffect(() => {
		isVipRef.current = isVip
	}, [isVip])
	useEffect(() => {
		selectedInstanceIdRef.current = selectedInstanceId
	}, [selectedInstanceId])
	useEffect(() => {
		runtimeLayoutRef.current = runtimeLayout
	}, [runtimeLayout])

	const applyRuntimeLayout = useCallback(
		(next: StoredWidget[] | ((prev: StoredWidget[]) => StoredWidget[])) => {
			setRuntimeLayout((prev) => {
				const value = typeof next === 'function' ? next(prev) : next
				runtimeLayoutRef.current = value
				return value
			})
		},
		[]
	)

	const {
		persistLayout,
		triggerServerSync,
		markLocalEdit,
		flushHeldLayout,
		syncStatus,
	} = useWidgetSync({
		isAuthenticated,
		token,
		isEditingRef,
		setSavedLayout,
		savedLayoutRef,
		colsRef,
		applyRuntimeLayout,
		setIsLoaded,
	})

	useEffect(() => {
		const wasEditing = isEditingRef.current
		isEditingRef.current = canvasMode === 'edit'
		if (wasEditing && canvasMode === 'normal') flushHeldLayout()
	}, [canvasMode, flushHeldLayout])

	const retryLayoutSync = useCallback(() => {
		Analytics.event('widget_layout_sync_retried')
		flushHeldLayout()
	}, [flushHeldLayout])

	const layoutSyncValue = useMemo<LayoutSyncState>(
		() => ({ status: syncStatus, retry: retryLayoutSync }),
		[syncStatus, retryLayoutSync]
	)

	const {
		commitMutation,
		resizeWidget,
		moveWidget,
		updateWidgetVariant,
		addWidget,
		duplicateWidget,
		removeWidget,
		updateWidgetSettings,
		applyPresetLayout,
	} = useWidgetOperations({
		runtimeLayoutRef,
		savedLayoutRef,
		colsRef,
		isVipRef,
		selectedInstanceIdRef,
		isAuthenticated,
		isEditingRef,
		persistLayout,
		triggerServerSync,
		applyRuntimeLayout,
		setSavedLayout,
		setRuntimeLayout,
		setSelectedInstanceId,
		markLocalEdit,
	})

	const { startDragPreview, updateDragPreview, endDragPreview } = useWidgetDrag({
		runtimeLayoutRef,
		colsRef,
		applyRuntimeLayout,
		commitMutation,
	})

	const updateContainerWidth = useCallback(
		(containerWidth: number) => {
			if (containerWidth <= 0) return

			let matched = GRID_BREAKPOINTS[0]
			for (const bp of GRID_BREAKPOINTS) {
				if (containerWidth >= bp.minContainerWidth) {
					matched = bp
					break
				}
			}

			const computedCellWidth =
				(containerWidth - (matched.cols - 1) * matched.gap) / matched.cols
			const fallback = computedCellWidth < MIN_CELL_WIDTH

			colsRef.current = matched.cols
			setCols(matched.cols)
			setCellHeight(matched.cellHeight)
			setGap(matched.gap)
			setCellWidth(computedCellWidth)
			setIsListFallback(fallback)

			setSavedLayout((currentSaved) => {
				const base =
					currentSaved.length > 0 ? currentSaved : savedLayoutRef.current
				if (base.length === 0) return currentSaved
				if (fallback) {
					applyRuntimeLayout(base)
					return currentSaved
				}
				applyRuntimeLayout(reflowForColumns(base, matched.cols))
				return currentSaved
			})
		},
		[applyRuntimeLayout, savedLayoutRef]
	)

	const layoutValue = useMemo<FreeWidgetLayoutState>(
		() => ({
			savedLayout,
			runtimeLayout,
			cols,
			cellWidth,
			cellHeight,
			gap,
			isListFallback,
			isLoaded,
			canvasMode,
			selectedInstanceId,
		}),
		[
			savedLayout,
			runtimeLayout,
			cols,
			cellWidth,
			cellHeight,
			gap,
			isListFallback,
			isLoaded,
			canvasMode,
			selectedInstanceId,
		]
	)

	const primaryBookmarkInstanceId = useMemo(
		() =>
			runtimeLayout.find((w) => w.id === WidgetKeys.bookmarks)?.instanceId ?? null,
		[runtimeLayout]
	)

	const derivedValue = useMemo<FreeWidgetDerivedState>(
		() => ({ primaryBookmarkInstanceId }),
		[primaryBookmarkInstanceId]
	)

	const actionsValue = useMemo<FreeWidgetActions>(
		() => ({
			setCanvasMode,
			setSelectedInstanceId,
			resizeWidget,
			moveWidget,
			startDragPreview,
			updateDragPreview,
			endDragPreview,
			addWidget,
			duplicateWidget,
			removeWidget,
			updateWidgetSettings,
			updateWidgetVariant,
			updateContainerWidth,
			applyPresetLayout,
		}),
		[
			setCanvasMode,
			setSelectedInstanceId,
			resizeWidget,
			moveWidget,
			startDragPreview,
			updateDragPreview,
			endDragPreview,
			addWidget,
			duplicateWidget,
			removeWidget,
			updateWidgetSettings,
			updateWidgetVariant,
			updateContainerWidth,
			applyPresetLayout,
		]
	)

	return (
		<FreeWidgetActionsContext.Provider value={actionsValue}>
			<FreeWidgetDerivedContext.Provider value={derivedValue}>
				<FreeWidgetLayoutContext.Provider value={layoutValue}>
					<LayoutSyncContext.Provider value={layoutSyncValue}>
						{children}
					</LayoutSyncContext.Provider>
				</FreeWidgetLayoutContext.Provider>
			</FreeWidgetDerivedContext.Provider>
		</FreeWidgetActionsContext.Provider>
	)
}

export function useLayoutSync(): LayoutSyncState | null {
	return useContext(LayoutSyncContext)
}

export function usePrimaryBookmarkInstanceId(): string | null | undefined {
	const context = useContext(FreeWidgetDerivedContext)
	if (!context) return undefined
	return context.primaryBookmarkInstanceId
}

export function useFreeWidgetActions(): FreeWidgetActions {
	const context = useContext(FreeWidgetActionsContext)
	if (!context) {
		throw new Error('useFreeWidgetActions must be used within a FreeWidgetProvider')
	}
	return context
}

function useFreeWidgetLayout(): FreeWidgetLayoutState {
	const context = useContext(FreeWidgetLayoutContext)
	if (!context) {
		throw new Error('useFreeWidgetLayout must be used within a FreeWidgetProvider')
	}
	return context
}

export function useFreeWidgets(): FreeWidgetContextType {
	const layout = useFreeWidgetLayout()
	const actions = useFreeWidgetActions()
	return useMemo(() => ({ ...layout, ...actions }), [layout, actions])
}

export function useOptionalFreeWidgets(): FreeWidgetContextType | null {
	const layout = useContext(FreeWidgetLayoutContext)
	const actions = useContext(FreeWidgetActionsContext)
	return useMemo(
		() => (layout && actions ? { ...layout, ...actions } : null),
		[layout, actions]
	)
}
