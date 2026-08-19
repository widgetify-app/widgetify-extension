import type React from 'react'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { showToast } from '@/common/toast'
import {
	DEFAULT_CELL_HEIGHT,
	DEFAULT_COLS,
	DEFAULT_GAP,
	DEFAULT_WIDGET_LAYOUT,
	GRID_BREAKPOINTS,
	MIN_CELL_WIDTH,
	resolveLayoutChange,
	validateLayout,
} from '@/layouts/widgets/layout-engine'
import type {
	StoredWidget,
	WidgetPosition,
	WidgetSize,
} from '@/layouts/widgets/layout-engine/types'
import { migrateWidgetLayoutIfNeeded } from '@/layouts/widgets/migration'
import { WIDGET_DEFINITIONS } from '@/layouts/widgets/widget-registry'
import { createWidgetApi } from '@/services/hooks/widgets/widget-sync.hook'
import { useAppearance } from './appearance.context'

interface FreeWidgetContextType {
	savedLayout: StoredWidget[]
	runtimeLayout: StoredWidget[]
	cols: number
	cellWidth: number
	cellHeight: number
	gap: number
	isListFallback: boolean
	canvasMode: 'normal' | 'edit'
	selectedInstanceId: string | null
	setCanvasMode: (mode: 'normal' | 'edit') => void
	setSelectedInstanceId: (id: string | null) => void
	resizeWidget: (instanceId: string, newSize: WidgetSize) => boolean
	moveWidget: (instanceId: string, targetPosition: WidgetPosition) => boolean
	addWidget: (id: string, targetPosition?: WidgetPosition) => boolean
	duplicateWidget: (instanceId: string) => boolean
	removeWidget: (instanceId: string) => boolean
	resetToDefaultLayout: () => void
	updateContainerWidth: (containerWidth: number) => void
}

const FreeWidgetContext = createContext<FreeWidgetContextType | null>(null)

export function FreeWidgetProvider({ children }: { children: React.ReactNode }) {
	const {
		canvasMode,
		setCanvasMode,
		selectedInstanceId,
		setSelectedInstanceId,
	} = useAppearance()

	const [savedLayout, setSavedLayout] = useState<StoredWidget[]>(
		DEFAULT_WIDGET_LAYOUT
	)
	const [runtimeLayout, setRuntimeLayout] = useState<StoredWidget[]>(
		DEFAULT_WIDGET_LAYOUT
	)
	const [cols, setCols] = useState<number>(DEFAULT_COLS)
	const [cellHeight, setCellHeight] = useState<number>(DEFAULT_CELL_HEIGHT)
	const [gap, setGap] = useState<number>(DEFAULT_GAP)
	const [cellWidth, setCellWidth] = useState<number>(100)
	const [isListFallback, setIsListFallback] = useState<boolean>(false)
	const isInitialized = useRef<boolean>(false)
	const containerWidthRef = useRef<number>(1200)

	const persistLayout = useCallback((layoutToPersist: StoredWidget[]) => {
		setToStorage('storedWidgets', layoutToPersist)
	}, [])

	const reflowForColumns = useCallback(
		(baseLayout: StoredWidget[], targetCols: number) => {
			if (targetCols >= DEFAULT_COLS) {
				return baseLayout
			}

			const reflowed = resolveLayoutChange({
				layout: baseLayout,
				operation: 'responsive-reflow',
				cols: targetCols,
			})

			return reflowed || baseLayout
		},
		[]
	)

	const updateContainerWidth = useCallback(
		(containerWidth: number) => {
			if (containerWidth <= 0) return
			containerWidthRef.current = containerWidth

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

			setCols(matched.cols)
			setCellHeight(matched.cellHeight)
			setGap(matched.gap)
			setCellWidth(computedCellWidth)
			setIsListFallback(fallback)

			setSavedLayout((currentSaved) => {
				if (fallback) {
					setRuntimeLayout(currentSaved)
					return currentSaved
				}
				const nextRuntime = reflowForColumns(currentSaved, matched.cols)
				setRuntimeLayout(nextRuntime)
				return currentSaved
			})
		},
		[reflowForColumns]
	)

	useEffect(() => {
		async function init() {
			try {
				const migrated = await migrateWidgetLayoutIfNeeded()
				setSavedLayout(migrated)
				const reflowed = reflowForColumns(migrated, cols)
				setRuntimeLayout(reflowed)
			} catch (err) {
				console.error('Failed to load widget layout', err)
				setSavedLayout(DEFAULT_WIDGET_LAYOUT)
				setRuntimeLayout(DEFAULT_WIDGET_LAYOUT)
			} finally {
				isInitialized.current = true
			}
		}

		init()
	}, [])

	const commitMutation = useCallback(
		(
			operation: string,
			nextRuntime: StoredWidget[],
			targetInstanceId?: string
		) => {
			if (!validateLayout(nextRuntime, cols)) {
				return false
			}

			setRuntimeLayout(nextRuntime)

			if (cols >= DEFAULT_COLS) {
				setSavedLayout(nextRuntime)
				persistLayout(nextRuntime)
			} else {
				setSavedLayout((prevSaved) => {
					const updated = prevSaved.map((savedW) => {
						const matching = nextRuntime.find(
							(r) => r.instanceId === savedW.instanceId
						)
						if (matching) {
							return {
								...savedW,
								size: matching.size,
								position: matching.position,
							}
						}
						return savedW
					})

					const newItems = nextRuntime.filter(
						(r) => !prevSaved.some((s) => s.instanceId === r.instanceId)
					)

					const finalSaved = [...updated, ...newItems]
					persistLayout(finalSaved)
					return finalSaved
				})
			}

			Analytics.event(`widget_layout_${operation}`, {
				instanceId: targetInstanceId,
			})
			return true
		},
		[cols, persistLayout]
	)

	const resizeWidget = useCallback(
		(instanceId: string, newSize: WidgetSize): boolean => {
			const result = resolveLayoutChange({
				layout: runtimeLayout,
				operation: 'resize',
				instanceId,
				targetSize: newSize,
				cols,
			})

			if (!result) {
				showToast('امکان تغییر اندازه ویجت به این سایز وجود ندارد', 'error')
				return false
			}

			return commitMutation('resize', result, instanceId)
		},
		[runtimeLayout, cols, commitMutation]
	)

	const moveWidget = useCallback(
		(instanceId: string, targetPosition: WidgetPosition): boolean => {
			const result = resolveLayoutChange({
				layout: runtimeLayout,
				operation: 'move',
				instanceId,
				targetPosition,
				cols,
			})

			if (!result) {
				return false
			}

			return commitMutation('move', result, instanceId)
		},
		[runtimeLayout, cols, commitMutation]
	)

	const addWidget = useCallback(
		(id: string, targetPosition?: WidgetPosition): boolean => {
			const def = WIDGET_DEFINITIONS[id as keyof typeof WIDGET_DEFINITIONS]
			if (!def) return false

			const isAlreadyActive = runtimeLayout.some((w) => w.id === id)
			if (!def.canDuplicate && isAlreadyActive) {
				showToast('این ویجت قبلاً اضافه شده است', 'error')
				return false
			}

			const instanceId = `${id}-${Date.now().toString(36)}`
			const newWidget: StoredWidget = {
				id: def.id,
				instanceId,
				position: targetPosition || { col: 0, row: 0 },
				size: def.defaultSize,
				widgetId: `widget-${instanceId}`,
			}

			const result = resolveLayoutChange({
				layout: runtimeLayout,
				operation: 'add',
				newWidget,
				targetPosition,
				cols,
			})

			if (!result) {
				showToast('فضای کافی برای افزودن ویجت وجود ندارد', 'error')
				return false
			}

			createWidgetApi({
				type: def.id,
				position: newWidget.position,
				size: newWidget.size,
				clientInstanceId: instanceId,
			})
				.then((serverWidget) => {
					if (serverWidget?.id) {
						setSavedLayout((prev) => {
							const updated = prev.map((w) =>
								w.instanceId === instanceId
									? { ...w, widgetId: serverWidget.id }
									: w
							)
							persistLayout(updated)
							return updated
						})
						setRuntimeLayout((prev) =>
							prev.map((w) =>
								w.instanceId === instanceId
									? { ...w, widgetId: serverWidget.id }
									: w
							)
						)
					}
				})
				.catch(() => {})

			showToast(`ویجت ${def.label} افزوده شد`, 'success')
			return commitMutation('add', result, instanceId)
		},
		[runtimeLayout, cols, commitMutation, persistLayout]
	)

	const duplicateWidget = useCallback(
		(instanceId: string): boolean => {
			const original = runtimeLayout.find((w) => w.instanceId === instanceId)
			if (!original) return false

			const def = WIDGET_DEFINITIONS[original.id]
			if (!def?.canDuplicate) {
				showToast('امکان تکرار این ویجت وجود ندارد', 'error')
				return false
			}

			const result = resolveLayoutChange({
				layout: runtimeLayout,
				operation: 'duplicate',
				instanceId,
				cols,
			})

			if (!result) {
				showToast('فضای کافی برای تکرار ویجت وجود ندارد', 'error')
				return false
			}

			const duplicated = result.find(
				(w) =>
					w.id === original.id &&
					w.instanceId !== original.instanceId &&
					!runtimeLayout.some((r) => r.instanceId === w.instanceId)
			)

			if (duplicated) {
				createWidgetApi({
					type: duplicated.id,
					position: duplicated.position,
					size: duplicated.size,
					clientInstanceId: duplicated.instanceId,
				})
					.then((serverWidget) => {
						if (serverWidget?.id) {
							setSavedLayout((prev) => {
								const updated = prev.map((w) =>
									w.instanceId === duplicated.instanceId
										? { ...w, widgetId: serverWidget.id }
										: w
								)
								persistLayout(updated)
								return updated
							})
							setRuntimeLayout((prev) =>
								prev.map((w) =>
									w.instanceId === duplicated.instanceId
										? { ...w, widgetId: serverWidget.id }
										: w
								)
							)
						}
					})
					.catch(() => {})
			}

			showToast('ویجت با موفقیت تکرار شد', 'success')
			return commitMutation('duplicate', result, instanceId)
		},
		[runtimeLayout, cols, commitMutation, persistLayout]
	)

	const removeWidget = useCallback(
		(instanceId: string): boolean => {
			const result = resolveLayoutChange({
				layout: runtimeLayout,
				operation: 'remove',
				instanceId,
				cols,
			})

			if (!result) {
				return false
			}

			if (selectedInstanceId === instanceId) {
				setSelectedInstanceId(null)
			}

			showToast('ویجت حذف شد', 'success')
			return commitMutation('remove', result, instanceId)
		},
		[runtimeLayout, cols, selectedInstanceId, setSelectedInstanceId, commitMutation]
	)

	const resetToDefaultLayout = useCallback(() => {
		setSavedLayout(DEFAULT_WIDGET_LAYOUT)
		const reflowed = reflowForColumns(DEFAULT_WIDGET_LAYOUT, cols)
		setRuntimeLayout(reflowed)
		persistLayout(DEFAULT_WIDGET_LAYOUT)
		setSelectedInstanceId(null)
		showToast('چیدمان پیش‌فرض بازیابی شد', 'success')
	}, [cols, reflowForColumns, persistLayout, setSelectedInstanceId])

	return (
		<FreeWidgetContext.Provider
			value={{
				savedLayout,
				runtimeLayout,
				cols,
				cellWidth,
				cellHeight,
				gap,
				isListFallback,
				canvasMode,
				selectedInstanceId,
				setCanvasMode,
				setSelectedInstanceId,
				resizeWidget,
				moveWidget,
				addWidget,
				duplicateWidget,
				removeWidget,
				resetToDefaultLayout,
				updateContainerWidth,
			}}
		>
			{children}
		</FreeWidgetContext.Provider>
	)
}

export function useFreeWidgets() {
	const context = useContext(FreeWidgetContext)
	if (!context) {
		throw new Error('useFreeWidgets must be used within a FreeWidgetProvider')
	}
	return context
}
