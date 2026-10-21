import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import type React from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage, watchStorage } from '@/common/storage'
import {
	DEFAULT_COLS,
	DEFAULT_WIDGET_LAYOUT,
} from '@/features/widgets/utils/layout-engine/constants'
import type { StoredWidget } from '@/features/widgets/utils/layout-engine/types'
import {
	applyInstanceIdMap,
	buildInstanceIdMap,
} from '@/features/widgets/utils/instance-id'
import { migrateWidgetLayoutIfNeeded } from '@/features/widgets/utils/migration'
import { hydratePartnerCatalog } from './use-partner-catalog-sync'
import {
	getUserWidgetsApi,
	syncUserWidgetsApi,
} from '@/services/widgets/widget-sync.hook'
import {
	reflowForColumns,
	sanitizeLayout,
	storedWidgetToApiPayload,
} from '../utils/widget-layout-helpers'
import { chooseLayoutOnLoad, type LayoutSyncStatus } from '../utils/layout-sync'
import { widgetsKeys } from '@/services/widgets/widgets.keys'

const SAVED_STATUS_MS = 1800

interface UseWidgetSyncParams {
	isAuthenticated: boolean
	token: string | null | undefined
	isEditingRef: React.MutableRefObject<boolean>
	setSavedLayout: React.Dispatch<React.SetStateAction<StoredWidget[]>>
	savedLayoutRef: React.MutableRefObject<StoredWidget[]>
	colsRef: React.MutableRefObject<number>
	applyRuntimeLayout: (
		next: StoredWidget[] | ((prev: StoredWidget[]) => StoredWidget[])
	) => void
	setIsLoaded: (loaded: boolean) => void
}

export function useWidgetSync({
	isAuthenticated,
	token,
	isEditingRef,
	setSavedLayout,
	savedLayoutRef,
	colsRef,
	applyRuntimeLayout,
	setIsLoaded,
}: UseWidgetSyncParams) {
	const queryClient = useQueryClient()
	const syncTimerRef = useRef<NodeJS.Timeout | null>(null)
	const savedStatusTimerRef = useRef<NodeJS.Timeout | null>(null)
	const hasFetchedServerRef = useRef<boolean>(false)
	const hasLocalEditRef = useRef<boolean>(false)
	const heldLayoutRef = useRef<StoredWidget[] | null>(null)
	const lastPersistedSignatureRef = useRef<string | null>(null)
	const prevTokenRef = useRef<string | null | undefined>(undefined)
	const [syncStatus, setSyncStatus] = useState<LayoutSyncStatus>('idle')

	const persistLayout = useCallback((layoutToPersist: StoredWidget[]) => {
		lastPersistedSignatureRef.current = JSON.stringify(layoutToPersist)
		setToStorage('storedWidgets', layoutToPersist)
	}, [])

	const loadFromLocalStorage = useCallback(async () => {
		try {
			await hydratePartnerCatalog()
			const localLayout = await migrateWidgetLayoutIfNeeded()
			const finalLayout = Array.isArray(localLayout)
				? sanitizeLayout(localLayout, DEFAULT_COLS)
				: DEFAULT_WIDGET_LAYOUT
			savedLayoutRef.current = finalLayout
			setSavedLayout(finalLayout)
			applyRuntimeLayout(reflowForColumns(finalLayout, colsRef.current))
		} catch (err) {
			console.error('Failed to load local widget layout', err)
			savedLayoutRef.current = DEFAULT_WIDGET_LAYOUT
			setSavedLayout(DEFAULT_WIDGET_LAYOUT)
			applyRuntimeLayout(DEFAULT_WIDGET_LAYOUT)
		} finally {
			setIsLoaded(true)
		}
	}, [applyRuntimeLayout, setSavedLayout, savedLayoutRef, colsRef, setIsLoaded])

	const sendLayout = useCallback(
		async (layout: StoredWidget[]): Promise<boolean> => {
			const synced = await syncUserWidgetsApi({
				workspace: 'HOME',
				widgets: layout.map(storedWidgetToApiPayload),
			})
			if (synced === null) return false

			const idMap = buildInstanceIdMap(layout, synced)
			if (idMap.size > 0) {
				setSavedLayout((prev) => {
					const updated = applyInstanceIdMap(prev, idMap)
					savedLayoutRef.current = updated
					persistLayout(updated)
					return updated
				})
				applyRuntimeLayout((prev) => applyInstanceIdMap(prev, idMap))
			}
			return true
		},
		[persistLayout, applyRuntimeLayout, setSavedLayout, savedLayoutRef]
	)

	const holdLayout = useCallback((layout: StoredWidget[]) => {
		heldLayoutRef.current = layout
		setToStorage('widgetLayoutUnsynced', true)
	}, [])

	const triggerServerSync = useCallback(
		(currentLayout: StoredWidget[]) => {
			if (!isAuthenticated) return

			if (syncTimerRef.current) {
				clearTimeout(syncTimerRef.current)
				syncTimerRef.current = null
			}

			if (isEditingRef.current) {
				holdLayout(currentLayout)
				return
			}

			syncTimerRef.current = setTimeout(() => {
				syncTimerRef.current = null
				if (isEditingRef.current) {
					holdLayout(currentLayout)
					return
				}
				sendLayout(currentLayout).catch(() => {})
			}, 1000)
		},
		[isAuthenticated, isEditingRef, holdLayout, sendLayout]
	)

	const flushHeldLayout = useCallback(async () => {
		const layout = heldLayoutRef.current
		if (!isAuthenticated || !layout) return

		if (savedStatusTimerRef.current) clearTimeout(savedStatusTimerRef.current)
		setSyncStatus('saving')

		const isSaved = await sendLayout(layout).catch(() => false)

		if (!isSaved) {
			setSyncStatus('failed')
			Analytics.event('widget_layout_sync_failed')
			return
		}

		if (heldLayoutRef.current === layout) {
			heldLayoutRef.current = null
			setToStorage('widgetLayoutUnsynced', false)
		}
		setSyncStatus('saved')
		Analytics.event('widget_layout_sync_saved')
		savedStatusTimerRef.current = setTimeout(
			() => setSyncStatus('idle'),
			SAVED_STATUS_MS
		)
	}, [isAuthenticated, sendLayout])

	const markLocalEdit = useCallback(() => {
		hasLocalEditRef.current = true
	}, [])

	useEffect(() => {
		return () => {
			if (savedStatusTimerRef.current) clearTimeout(savedStatusTimerRef.current)
		}
	}, [])

	useEffect(() => {
		loadFromLocalStorage()
	}, [loadFromLocalStorage])

	useEffect(() => {
		const unwatch = watchStorage('storedWidgets', (newValue) => {
			if (!Array.isArray(newValue)) return
			if (JSON.stringify(newValue) === lastPersistedSignatureRef.current) return
			savedLayoutRef.current = newValue
			setSavedLayout(newValue)
			applyRuntimeLayout(reflowForColumns(newValue, colsRef.current))
		})
		return () => unwatch()
	}, [applyRuntimeLayout, setSavedLayout, savedLayoutRef, colsRef])

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
		heldLayoutRef.current = null
		setToStorage('widgetLayoutUnsynced', false)
		setSyncStatus('idle')
		loadFromLocalStorage()
	}, [token, loadFromLocalStorage])

	useEffect(() => {
		if (!isAuthenticated || hasFetchedServerRef.current) return
		hasFetchedServerRef.current = true

		async function fetchAndReconcileWithServer() {
			try {
				const res = await getUserWidgetsApi('HOME')
				if (res === null) return

				if (res.catalog) {
					queryClient.setQueryData(widgetsKeys.catalog, res.catalog)
				}

				const serverWidgets = res.widgets || []
				const choice = chooseLayoutOnLoad({
					hasUnsyncedEdit: Boolean(
						await getFromStorage('widgetLayoutUnsynced')
					),
					hasLocalEdit: hasLocalEditRef.current,
					serverWidgetCount: serverWidgets.length,
				})

				if (choice === 'keep-local') return

				if (choice === 'push-local') {
					const localLayout = await migrateWidgetLayoutIfNeeded()
					if (!Array.isArray(localLayout)) return
					if (await sendLayout(sanitizeLayout(localLayout, DEFAULT_COLS))) {
						setToStorage('widgetLayoutUnsynced', false)
					}
					return
				}

				if (choice === 'take-server') {
					const rawWidgets: StoredWidget[] = serverWidgets.map((sw) => ({
						id: sw.widgetKey as any,
						instanceId: sw.instanceId,
						widgetId: sw.instanceId,
						position: { col: sw.col, row: sw.row },
						size: { w: sw.width, h: sw.height },
						meta: sw.meta,
						disabled: sw.disabled,
					}))

					const fromSrv: StoredWidget[] = sanitizeLayout(
						rawWidgets,
						DEFAULT_COLS
					)

					savedLayoutRef.current = fromSrv
					setSavedLayout(fromSrv)
					applyRuntimeLayout(reflowForColumns(fromSrv, colsRef.current))
					persistLayout(fromSrv)
					return
				}

				const localLayout = await migrateWidgetLayoutIfNeeded()
				if (localLayout && localLayout.length > 0) {
					await sendLayout(localLayout)
				}
			} catch (err) {
				console.error('Background widget fetch error', err)
			}
		}

		fetchAndReconcileWithServer()
	}, [
		isAuthenticated,
		persistLayout,
		applyRuntimeLayout,
		setSavedLayout,
		savedLayoutRef,
		colsRef,
		sendLayout,
		queryClient,
	])

	return {
		persistLayout,
		triggerServerSync,
		markLocalEdit,
		flushHeldLayout,
		syncStatus,
	}
}
