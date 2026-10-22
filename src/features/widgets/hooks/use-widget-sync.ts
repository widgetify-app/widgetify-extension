import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import type React from 'react'
import { setToStorage, watchStorage } from '@/common/storage'
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
	type WidgetWorkspace,
} from '@/services/widgets/widget-sync.hook'
import {
	reflowForColumns,
	sanitizeLayout,
	storedWidgetToApiPayload,
} from '../utils/widget-layout-helpers'
import { widgetsKeys } from '@/services/widgets/widgets.keys'
import { isServerWorkspace } from '../utils/slots/slot-access'

interface UseWidgetSyncParams {
	serverSyncEnabled: boolean
	activeWorkspace: WidgetWorkspace | null
	activeWorkspaceRef: React.MutableRefObject<WidgetWorkspace | null>
	token: string | null | undefined
	setSavedLayout: React.Dispatch<React.SetStateAction<StoredWidget[]>>
	savedLayoutRef: React.MutableRefObject<StoredWidget[]>
	colsRef: React.MutableRefObject<number>
	applyRuntimeLayout: (
		next: StoredWidget[] | ((prev: StoredWidget[]) => StoredWidget[])
	) => void
	setIsLoaded: (loaded: boolean) => void
}

interface PendingSync {
	workspace: WidgetWorkspace
	layout: StoredWidget[]
}

export function useWidgetSync({
	serverSyncEnabled,
	activeWorkspace,
	activeWorkspaceRef,
	token,
	setSavedLayout,
	savedLayoutRef,
	colsRef,
	applyRuntimeLayout,
	setIsLoaded,
}: UseWidgetSyncParams) {
	const queryClient = useQueryClient()
	const syncTimerRef = useRef<NodeJS.Timeout | null>(null)
	const pendingSyncRef = useRef<PendingSync | null>(null)
	const inFlightSyncRef = useRef<Promise<void> | null>(null)
	const hasFetchedServerRef = useRef<boolean>(false)
	const hasLocalEditRef = useRef<boolean>(false)
	const lastPersistedSignatureRef = useRef<string | null>(null)
	const prevTokenRef = useRef<string | null | undefined>(undefined)

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

	const sendLayoutToServer = useCallback(
		({ workspace, layout: currentLayout }: PendingSync) => {
			const request: Promise<void> = syncUserWidgetsApi({
				workspace,
				widgets: currentLayout.map(storedWidgetToApiPayload),
			})
				.then((synced) => {
					if (!synced || synced.length === 0) return
					const idMap = buildInstanceIdMap(currentLayout, synced)
					if (idMap.size === 0) return
					setSavedLayout((prev) => {
						const updated = applyInstanceIdMap(prev, idMap)
						savedLayoutRef.current = updated
						persistLayout(updated)
						return updated
					})
					applyRuntimeLayout((prev) => applyInstanceIdMap(prev, idMap))
				})
				.catch(() => {})
				.finally(() => {
					if (inFlightSyncRef.current === request)
						inFlightSyncRef.current = null
				})
			inFlightSyncRef.current = request
			return request
		},
		[persistLayout, applyRuntimeLayout, setSavedLayout, savedLayoutRef]
	)

	const triggerServerSync = useCallback(
		(currentLayout: StoredWidget[]) => {
			const workspace = activeWorkspaceRef.current
			if (!serverSyncEnabled || !workspace || !isServerWorkspace(workspace)) return

			if (syncTimerRef.current) {
				clearTimeout(syncTimerRef.current)
			}

			pendingSyncRef.current = { workspace, layout: currentLayout }
			syncTimerRef.current = setTimeout(() => {
				syncTimerRef.current = null
				const pending = pendingSyncRef.current
				pendingSyncRef.current = null
				if (pending) sendLayoutToServer(pending)
			}, 1000)
		},
		[serverSyncEnabled, activeWorkspaceRef, sendLayoutToServer]
	)

	const flushServerSync = useCallback(async () => {
		if (syncTimerRef.current) {
			clearTimeout(syncTimerRef.current)
			syncTimerRef.current = null
		}
		const pending = pendingSyncRef.current
		pendingSyncRef.current = null
		const inFlight = inFlightSyncRef.current
		await Promise.all([inFlight, pending ? sendLayoutToServer(pending) : null])
	}, [sendLayoutToServer])

	const markLocalEdit = useCallback(() => {
		hasLocalEditRef.current = true
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
		pendingSyncRef.current = null
		hasFetchedServerRef.current = false
		hasLocalEditRef.current = false
		loadFromLocalStorage()
	}, [token, loadFromLocalStorage])

	useEffect(() => {
		hasLocalEditRef.current = false
	}, [activeWorkspace])

	useEffect(() => {
		if (!serverSyncEnabled || hasFetchedServerRef.current) return
		hasFetchedServerRef.current = true
		const isStillOnServerWorkspace = () => {
			if (isServerWorkspace(activeWorkspaceRef.current)) return true
			hasFetchedServerRef.current = false
			return false
		}

		async function fetchAndReconcileWithServer() {
			try {
				const res = await getUserWidgetsApi('HOME')
				if (res === null) return

				if (res.catalog) {
					queryClient.setQueryData(widgetsKeys.catalog, res.catalog)
				}

				const serverWidgets = res.widgets || []
				if (!isStillOnServerWorkspace()) return
				if (serverWidgets.length > 0) {
					if (hasLocalEditRef.current) return

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
				} else {
					const localLayout = await migrateWidgetLayoutIfNeeded()
					if (!isStillOnServerWorkspace()) return
					if (localLayout && localLayout.length > 0) {
						const synced = await syncUserWidgetsApi({
							workspace: 'HOME',
							widgets: localLayout.map(storedWidgetToApiPayload),
						})

						if (synced && synced.length > 0 && isStillOnServerWorkspace()) {
							setSavedLayout((prev) => {
								const idMap = buildInstanceIdMap(prev, synced)
								if (idMap.size === 0) return prev
								const updated = applyInstanceIdMap(prev, idMap)
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
	}, [
		serverSyncEnabled,
		activeWorkspaceRef,
		persistLayout,
		applyRuntimeLayout,
		setSavedLayout,
		savedLayoutRef,
		colsRef,
	])

	return { persistLayout, triggerServerSync, flushServerSync, markLocalEdit }
}
