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
import { setToStorage, watchStorage } from '@/common/storage'
import { playNativeToastSound, showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import {
	DEFAULT_CELL_HEIGHT,
	DEFAULT_COLS,
	DEFAULT_GAP,
	DEFAULT_WIDGET_LAYOUT,
	getBestAllowedSizeForColumns,
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
import {
	createUserWidgetApi,
	deleteUserWidgetApi,
	getUserWidgetsApi,
	syncUserWidgetsApi,
	updateUserWidgetApi,
} from '@/services/hooks/widgets/widget-sync.hook'
import { useAppearance } from './appearance.context'
import { useAuth } from './auth.context'
import { callEvent } from '@/common/utils/call-event'

interface FreeWidgetContextType {
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
}

export const FreeWidgetContext = createContext<FreeWidgetContextType | null>(null)

function normalizeWidgetSizes(layout: StoredWidget[], cols: number): StoredWidget[] {
	let changed = false

	const normalized = layout.map((widget) => {
		const definition = WIDGET_DEFINITIONS[widget.id]
		if (!definition) return widget

		const isAllowed = definition.allowedSizes.some(
			(s) => s.w === widget.size.w && s.h === widget.size.h
		)
		if (isAllowed) return widget

		const size = getBestAllowedSizeForColumns(
			definition.allowedSizes,
			widget.size,
			cols
		)
		changed = true
		return { ...widget, size }
	})

	return changed ? normalized : layout
}

function sanitizeLayout(layout: StoredWidget[], cols: number): StoredWidget[] {
	const sized = normalizeWidgetSizes(layout, cols)

	if (validateLayout(sized, cols)) {
		return sized
	}

	return (
		resolveLayoutChange({
			layout: sized,
			operation: 'responsive-reflow',
			cols,
		}) ?? sized
	)
}

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
	const containerWidthRef = useRef<number>(1200)
	const syncTimerRef = useRef<NodeJS.Timeout | null>(null)
	const hasFetchedServerRef = useRef<boolean>(false)
	const hasLocalEditRef = useRef<boolean>(false)
	const prevTokenRef = useRef<string | null | undefined>(undefined)
	const lastPersistedSignatureRef = useRef<string | null>(null)
	const runtimeLayoutRef = useRef<StoredWidget[]>([])
	const dragBaseLayoutRef = useRef<StoredWidget[] | null>(null)
	const isVipRef = useRef<boolean>(isVip)

	useEffect(() => {
		isVipRef.current = isVip
	}, [isVip])

	useEffect(() => {
		runtimeLayoutRef.current = runtimeLayout
	}, [runtimeLayout])

	const persistLayout = useCallback((layoutToPersist: StoredWidget[]) => {
		lastPersistedSignatureRef.current = JSON.stringify(layoutToPersist)
		setToStorage('storedWidgets', layoutToPersist)
	}, [])

	const reflowForColumns = useCallback(
		(baseLayout: StoredWidget[], targetCols: number) => {
			const safeLayout = sanitizeLayout(baseLayout, targetCols)

			if (targetCols >= DEFAULT_COLS) {
				return safeLayout
			}

			const reflowed = resolveLayoutChange({
				layout: safeLayout,
				operation: 'responsive-reflow',
				cols: targetCols,
				registry: WIDGET_DEFINITIONS,
			})

			return reflowed || safeLayout
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

			colsRef.current = matched.cols
			setCols(matched.cols)
			setCellHeight(matched.cellHeight)
			setGap(matched.gap)
			setCellWidth(computedCellWidth)
			setIsListFallback(fallback)

			setSavedLayout((currentSaved) => {
				const base =
					currentSaved.length > 0 ? currentSaved : savedLayoutRef.current
				if (base.length === 0) {
					return currentSaved
				}
				if (fallback) {
					setRuntimeLayout(base)
					return currentSaved
				}
				const nextRuntime = reflowForColumns(base, matched.cols)
				setRuntimeLayout(nextRuntime)
				return currentSaved
			})
		},
		[reflowForColumns]
	)

	const loadFromLocalStorage = useCallback(async () => {
		try {
			const localLayout = await migrateWidgetLayoutIfNeeded()
			const finalLayout = sanitizeLayout(
				localLayout && localLayout.length > 0
					? localLayout
					: DEFAULT_WIDGET_LAYOUT,
				DEFAULT_COLS
			)
			savedLayoutRef.current = finalLayout
			setSavedLayout(finalLayout)
			const reflowed = reflowForColumns(finalLayout, colsRef.current)
			setRuntimeLayout(reflowed)
		} catch (err) {
			console.error('Failed to load local widget layout', err)
			savedLayoutRef.current = DEFAULT_WIDGET_LAYOUT
			setSavedLayout(DEFAULT_WIDGET_LAYOUT)
			setRuntimeLayout(DEFAULT_WIDGET_LAYOUT)
		} finally {
			setIsLoaded(true)
		}
	}, [reflowForColumns])

	useEffect(() => {
		loadFromLocalStorage()
	}, [loadFromLocalStorage])

	useEffect(() => {
		const unwatch = watchStorage('storedWidgets', (newValue) => {
			if (!newValue || newValue.length === 0) return
			if (JSON.stringify(newValue) === lastPersistedSignatureRef.current) return

			savedLayoutRef.current = newValue
			setSavedLayout(newValue)
			setRuntimeLayout(reflowForColumns(newValue, colsRef.current))
		})
		return () => unwatch()
	}, [reflowForColumns])

	useEffect(() => {
		if (prevTokenRef.current === undefined) {
			prevTokenRef.current = token
			return
		}
		if (prevTokenRef.current === token) return
		prevTokenRef.current = token

		if (syncTimerRef.current) {
			clearTimeout(syncTimerRef.current)
			syncTimerRef.current = null
		}
		hasFetchedServerRef.current = false
		hasLocalEditRef.current = false
		loadFromLocalStorage()
	}, [token, loadFromLocalStorage])

	useEffect(() => {
		if (!isAuthenticated || hasFetchedServerRef.current) return
		hasFetchedServerRef.current = true

		async function fetchAndReconcileWithServer() {
			try {
				const serverWidgets = await getUserWidgetsApi('CUSTOM', 'HOME')

				if (serverWidgets === null) {
					return
				}

				if (serverWidgets.length > 0) {
					if (hasLocalEditRef.current) {
						return
					}

					const fromSrv: StoredWidget[] = sanitizeLayout(
						serverWidgets.map((sw) => ({
							id: sw.widgetKey as any,
							instanceId: sw.instanceId,
							widgetId: sw.instanceId,
							position: { col: sw.col, row: sw.row },
							size: { w: sw.width, h: sw.height },
							meta: sw.meta,
							disabled: sw.disabled,
						})),
						DEFAULT_COLS
					)

					savedLayoutRef.current = fromSrv
					setSavedLayout(fromSrv)
					const reflowed = reflowForColumns(fromSrv, colsRef.current)
					setRuntimeLayout(reflowed)
					persistLayout(fromSrv)
				} else {
					const localLayout = await migrateWidgetLayoutIfNeeded()
					if (localLayout && localLayout.length > 0) {
						const synced = await syncUserWidgetsApi({
							ui: 'CUSTOM',
							workspace: 'HOME',
							widgets: localLayout.map((w) => ({
								instanceId:
									typeof w.instanceId === 'string' &&
									/^[0-9a-fA-F]{24}$/.test(w.instanceId)
										? w.instanceId
										: undefined,
								widgetKey: w.id,
								col: w.position.col,
								row: w.position.row,
								width: w.size.w,
								height: w.size.h,
								meta: w.meta,
								disabled: w.disabled ?? false,
							})),
						})

						if (synced && synced.length > 0) {
							setSavedLayout((prev) => {
								const updated = prev.map((w, index) => {
									const matching =
										synced.find(
											(s) => s.instanceId === w.instanceId
										) ||
										synced.find((s) => s.widgetKey === w.id) ||
										synced[index]
									if (
										matching?.instanceId &&
										matching.instanceId !== w.instanceId
									) {
										return {
											...w,
											instanceId: matching.instanceId,
											widgetId: matching.instanceId,
										}
									}
									return w
								})
								savedLayoutRef.current = updated
								persistLayout(updated)
								return updated
							})
						}
					}
				}
			} catch (err) {
				console.error('Background widget fetch error', err)
			}
		}

		fetchAndReconcileWithServer()
	}, [isAuthenticated, reflowForColumns, persistLayout])

	const triggerServerSync = useCallback(
		(currentLayout: StoredWidget[]) => {
			if (!isAuthenticated) return

			if (syncTimerRef.current) {
				clearTimeout(syncTimerRef.current)
			}

			syncTimerRef.current = setTimeout(() => {
				syncUserWidgetsApi({
					ui: 'CUSTOM',
					workspace: 'HOME',
					widgets: currentLayout.map((w) => ({
						instanceId:
							typeof w.instanceId === 'string' &&
							/^[0-9a-fA-F]{24}$/.test(w.instanceId)
								? w.instanceId
								: undefined,
						widgetKey: w.id,
						col: w.position.col,
						row: w.position.row,
						width: w.size.w,
						height: w.size.h,
						meta: w.meta,
						disabled: w.disabled ?? false,
					})),
				})
					.then((synced) => {
						if (!synced || synced.length === 0) return

						const idMap = new Map<string, string>()
						currentLayout.forEach((w, index) => {
							const isValidId =
								typeof w.instanceId === 'string' &&
								/^[0-9a-fA-F]{24}$/.test(w.instanceId)
							if (isValidId) return
							const matching =
								synced.find((s) => s.widgetKey === w.id) || synced[index]
							if (
								matching?.instanceId &&
								matching.instanceId !== w.instanceId
							) {
								idMap.set(w.instanceId, matching.instanceId)
							}
						})

						if (idMap.size === 0) return

						const applyIdMap = (list: StoredWidget[]) =>
							list.map((w) =>
								idMap.has(w.instanceId)
									? {
											...w,
											instanceId: idMap.get(w.instanceId) as string,
											widgetId: idMap.get(w.instanceId) as string,
										}
									: w
							)

						setSavedLayout((prev) => {
							const updated = applyIdMap(prev)
							savedLayoutRef.current = updated
							persistLayout(updated)
							return updated
						})
						setRuntimeLayout((prev) => applyIdMap(prev))
					})
					.catch(() => {})
			}, 1000)
		},
		[isAuthenticated, persistLayout]
	)

	const commitMutation = useCallback(
		(operation: string, nextRuntime: StoredWidget[], targetInstanceId?: string) => {
			if (!validateLayout(nextRuntime, cols, WIDGET_DEFINITIONS)) {
				return false
			}

			hasLocalEditRef.current = true
			setRuntimeLayout(nextRuntime)

			if (cols >= DEFAULT_COLS) {
				setSavedLayout(nextRuntime)
				persistLayout(nextRuntime)
				triggerServerSync(nextRuntime)
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
					triggerServerSync(finalSaved)
					return finalSaved
				})
			}

			Analytics.event(`widget_layout_${operation}`, {
				instanceId: targetInstanceId,
			})
			return true
		},
		[cols, persistLayout, triggerServerSync]
	)

	const resizeWidget = useCallback(
		(instanceId: string, newSize: WidgetSize): boolean => {
			const result = resolveLayoutChange({
				layout: runtimeLayout,
				operation: 'resize',
				instanceId,
				targetSize: newSize,
				cols,
				registry: WIDGET_DEFINITIONS,
			})

			if (!result) {
				showToast('امکان تغییر اندازه ویجت به این سایز وجود ندارد', 'error')
				return false
			}

			return commitMutation('resize', result, instanceId)
		},
		[runtimeLayout, cols, commitMutation]
	)

	const updateWidgetVariant = useCallback(
		(
			instanceId: string,
			newSize: WidgetSize,
			meta?: Record<string, any>
		): boolean => {
			const current = runtimeLayout.find((w) => w.instanceId === instanceId)
			if (!current) return false

			const isSizeSame =
				current.size.w === newSize.w && current.size.h === newSize.h

			if (isSizeSame) {
				setSavedLayout((prev) => {
					const updated = prev.map((w) =>
						w.instanceId === instanceId ? { ...w, meta } : w
					)
					persistLayout(updated)
					triggerServerSync(updated)
					return updated
				})
				setRuntimeLayout((prev) =>
					prev.map((w) => (w.instanceId === instanceId ? { ...w, meta } : w))
				)
				showToast('مدل ویجت با موفقیت تغییر کرد', 'success')
				return true
			}

			const result = resolveLayoutChange({
				layout: runtimeLayout,
				operation: 'resize',
				instanceId,
				targetSize: newSize,
				cols,
				registry: WIDGET_DEFINITIONS,
			})

			if (!result) {
				showToast('فضای کافی برای این مدل ویجت وجود ندارد', 'error')
				return false
			}

			const layoutWithMeta = result.map((w: StoredWidget) =>
				w.instanceId === instanceId ? { ...w, meta } : w
			)

			showToast('مدل ویجت با موفقیت تغییر کرد', 'success')
			return commitMutation('resize', layoutWithMeta, instanceId)
		},
		[runtimeLayout, cols, commitMutation, persistLayout, triggerServerSync]
	)

	const moveWidget = useCallback(
		(instanceId: string, targetPosition: WidgetPosition): boolean => {
			const result = resolveLayoutChange({
				layout: runtimeLayout,
				operation: 'move',
				instanceId,
				targetPosition,
				cols,
				registry: WIDGET_DEFINITIONS,
			})

			if (!result) {
				return false
			}

			return commitMutation('move', result, instanceId)
		},
		[runtimeLayout, cols, commitMutation]
	)

	const startDragPreview = useCallback(() => {
		dragBaseLayoutRef.current = runtimeLayoutRef.current
	}, [])

	const updateDragPreview = useCallback(
		(instanceId: string, targetPosition: WidgetPosition) => {
			const base = dragBaseLayoutRef.current
			if (!base) return

			const result = resolveLayoutChange({
				layout: base,
				operation: 'move',
				instanceId,
				targetPosition,
				cols: colsRef.current,
				registry: WIDGET_DEFINITIONS,
			})

			if (result) {
				setRuntimeLayout(result)
			}
		},
		[]
	)

	const endDragPreview = useCallback(
		(instanceId: string, targetPosition: WidgetPosition | null) => {
			const base = dragBaseLayoutRef.current
			dragBaseLayoutRef.current = null
			if (!base) return

			const restore = () => {
				if (runtimeLayoutRef.current !== base) {
					setRuntimeLayout(base)
				}
			}

			const origin = base.find((w) => w.instanceId === instanceId)?.position
			const isUnmoved =
				origin &&
				targetPosition &&
				origin.col === targetPosition.col &&
				origin.row === targetPosition.row

			if (!targetPosition || isUnmoved) {
				restore()
				return
			}

			const result = resolveLayoutChange({
				layout: base,
				operation: 'move',
				instanceId,
				targetPosition,
				cols: colsRef.current,
				registry: WIDGET_DEFINITIONS,
			})

			if (!result || !commitMutation('move', result, instanceId)) {
				restore()
			}
		},
		[commitMutation]
	)

	const addWidget = useCallback(
		async (
			id: string,
			targetPosition?: WidgetPosition,
			initialSize?: WidgetSize,
			meta?: Record<string, any>
		): Promise<boolean> => {
			const def = WIDGET_DEFINITIONS[id as keyof typeof WIDGET_DEFINITIONS]
			if (!def) return false

			const isAlreadyActive = runtimeLayout.some((w) => w.id === id)
			if (!def.canDuplicate && isAlreadyActive) {
				showToast(translateError('WIDGET_ALREADY_EXISTS') as string, 'error')
				return false
			}

			const chosenSize = initialSize || def.defaultSize
			const isCurrentlyActive = runtimeLayout.some((w) => w.id === def.id)
			if (isCurrentlyActive && !isVipRef.current) {
				callEvent('openSettings', 'vip')
				return false
			}

			let finalInstanceId = `${id}-${Date.now().toString(36)}`

			if (isAuthenticated) {
				const serverWidget = await createUserWidgetApi({
					widgetKey: def.id,
					ui: 'CUSTOM',
					workspace: 'HOME',
					col: targetPosition?.col ?? 0,
					row: targetPosition?.row ?? 0,
					width: chosenSize.w,
					height: chosenSize.h,
				})
				if (serverWidget?.instanceId) {
					finalInstanceId = serverWidget.instanceId
				}
			}

			const newWidget: StoredWidget = {
				id: def.id,
				instanceId: finalInstanceId,
				position: targetPosition || { col: 0, row: 0 },
				size: chosenSize,
				widgetId: finalInstanceId,
				meta: meta || undefined,
			}

			const result = resolveLayoutChange({
				layout: runtimeLayout,
				operation: 'add',
				newWidget,
				targetPosition,
				cols,
				registry: WIDGET_DEFINITIONS,
			})

			if (!result) {
				if (
					isAuthenticated &&
					typeof finalInstanceId === 'string' &&
					/^[0-9a-fA-F]{24}$/.test(finalInstanceId)
				) {
					deleteUserWidgetApi(finalInstanceId).catch(() => {})
				}
				showToast(translateError('NO_SPACE_FOR_WIDGET') as string, 'error')
				return false
			}

			playNativeToastSound('success')
			return commitMutation('add', result, finalInstanceId)
		},
		[runtimeLayout, cols, commitMutation, isAuthenticated, isVip]
	)

	const duplicateWidget = useCallback(
		async (instanceId: string): Promise<boolean> => {
			const original = runtimeLayout.find((w) => w.instanceId === instanceId)
			if (!original) return false

			const def = WIDGET_DEFINITIONS[original.id]
			if (!def?.canDuplicate) {
				showToast('امکان تکرار این ویجت وجود ندارد', 'error')
				return false
			}

			if (!isVipRef.current) {
				callEvent('openSettings', 'vip')
				return false
			}

			let newInstanceId = `${original.id}-${Date.now().toString(36)}`

			if (isAuthenticated) {
				const serverWidget = await createUserWidgetApi({
					widgetKey: def.id,
					ui: 'CUSTOM',
					workspace: 'HOME',
					col: original.position.col,
					row: original.position.row,
					width: original.size.w,
					height: original.size.h,
				})
				if (serverWidget?.instanceId) {
					newInstanceId = serverWidget.instanceId
				}
			}

			const newWidget: StoredWidget = {
				id: original.id,
				instanceId: newInstanceId,
				position: original.position,
				size: original.size,
				widgetId: newInstanceId,
			}

			const result = resolveLayoutChange({
				layout: runtimeLayout,
				operation: 'duplicate',
				instanceId,
				newWidget,
				cols,
				registry: WIDGET_DEFINITIONS,
			})

			if (!result) {
				if (
					isAuthenticated &&
					typeof newInstanceId === 'string' &&
					/^[0-9a-fA-F]{24}$/.test(newInstanceId)
				) {
					deleteUserWidgetApi(newInstanceId).catch(() => {})
				}
				showToast(translateError('NO_SPACE_FOR_DUPLICATE') as string, 'error')
				return false
			}

			playNativeToastSound('success')
			return commitMutation('duplicate', result, newInstanceId)
		},
		[runtimeLayout, cols, commitMutation, isAuthenticated, isVip]
	)

	const updateWidgetSettings = useCallback(
		(instanceId: string, meta: any) => {
			setSavedLayout((prev) => {
				const updated = prev.map((w) =>
					w.instanceId === instanceId ? { ...w, meta } : w
				)
				persistLayout(updated)
				return updated
			})
			setRuntimeLayout((prev) =>
				prev.map((w) => (w.instanceId === instanceId ? { ...w, meta } : w))
			)

			if (
				isAuthenticated &&
				typeof instanceId === 'string' &&
				/^[0-9a-fA-F]{24}$/.test(instanceId)
			) {
				updateUserWidgetApi(instanceId, { meta }).catch(() => {})
			}
		},
		[isAuthenticated, persistLayout]
	)

	const removeWidget = useCallback(
		(instanceId: string): boolean => {
			const result = resolveLayoutChange({
				layout: runtimeLayout,
				operation: 'remove',
				instanceId,
				cols,
				registry: WIDGET_DEFINITIONS,
			})

			if (!result) {
				return false
			}

			if (selectedInstanceId === instanceId) {
				setSelectedInstanceId(null)
			}

			if (isAuthenticated && typeof instanceId === 'string' && instanceId.trim()) {
				deleteUserWidgetApi(instanceId).catch(() => {})
			}

			playNativeToastSound('warning')
			return commitMutation('remove', result, instanceId)
		},
		[
			runtimeLayout,
			cols,
			selectedInstanceId,
			setSelectedInstanceId,
			commitMutation,
			isAuthenticated,
		]
	)

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
				isLoaded,
				canvasMode,
				selectedInstanceId,
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

export function useOptionalFreeWidgets() {
	return useContext(FreeWidgetContext)
}
