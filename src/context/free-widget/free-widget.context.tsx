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
} from '@/layouts/widgets/layout-engine'
import { type StoredWidget, WidgetKeys } from '@/layouts/widgets/layout-engine/types'
import { useAppearance } from '../appearance.context'
import { useAuth } from '../auth.context'
import { reflowForColumns } from './widget-layout-helpers'
import { useWidgetSync } from './use-widget-sync.hook'
import { useWidgetOperations } from './use-widget-operations.hook'
import { useWidgetDrag } from './use-widget-drag.hook'
import type {
	FreeWidgetActions,
	FreeWidgetContextType,
	FreeWidgetDerivedState,
	FreeWidgetLayoutState,
} from './free-widget.types'

export type {
	FreeWidgetActions,
	FreeWidgetContextType,
	FreeWidgetDerivedState,
	FreeWidgetLayoutState,
}

export const FreeWidgetLayoutContext = createContext<FreeWidgetLayoutState | null>(null)
export const FreeWidgetActionsContext = createContext<FreeWidgetActions | null>(null)
export const FreeWidgetDerivedContext = createContext<FreeWidgetDerivedState | null>(null)

export function FreeWidgetProvider({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isVip, token } = useAuth()
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
	const maxRowsRef = useRef<number>(0)

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

	const setMaxRows = useCallback((maxRows: number) => {
		maxRowsRef.current = maxRows
	}, [])

	const getGridBounds = useCallback(
		() => ({ cols: colsRef.current, maxRows: maxRowsRef.current }),
		[]
	)

	const { persistLayout, triggerServerSync, markLocalEdit } = useWidgetSync({
		isAuthenticated,
		token,
		setSavedLayout,
		savedLayoutRef,
		colsRef,
		applyRuntimeLayout,
		setIsLoaded,
	})

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
			getGridBounds,
			setMaxRows,
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
			getGridBounds,
			setMaxRows,
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
					{children}
				</FreeWidgetLayoutContext.Provider>
			</FreeWidgetDerivedContext.Provider>
		</FreeWidgetActionsContext.Provider>
	)
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

export function useFreeWidgetLayout(): FreeWidgetLayoutState {
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
