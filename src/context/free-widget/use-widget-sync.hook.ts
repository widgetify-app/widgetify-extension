import { useCallback, useEffect, useRef } from 'react'
import type React from 'react'
import { setToStorage, watchStorage } from '@/common/storage'
import { DEFAULT_COLS, DEFAULT_WIDGET_LAYOUT } from '@/layouts/widgets/layout-engine'
import type { StoredWidget } from '@/layouts/widgets/layout-engine/types'
import { applyInstanceIdMap, buildInstanceIdMap } from '@/layouts/widgets/instance-id'
import { migrateWidgetLayoutIfNeeded } from '@/layouts/widgets/migration'
import {
	getUserWidgetsApi,
	syncUserWidgetsApi,
} from '@/services/hooks/widgets/widget-sync.hook'
import {
	reflowForColumns,
	sanitizeLayout,
	storedWidgetToApiPayload,
} from './widget-layout-helpers'

interface UseWidgetSyncParams {
	isAuthenticated: boolean
	token: string | null | undefined
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
	setSavedLayout,
	savedLayoutRef,
	colsRef,
	applyRuntimeLayout,
	setIsLoaded,
}: UseWidgetSyncParams) {
	const syncTimerRef = useRef<NodeJS.Timeout | null>(null)
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

	const triggerServerSync = useCallback(
		(currentLayout: StoredWidget[]) => {
			if (!isAuthenticated) return

			if (syncTimerRef.current) {
				clearTimeout(syncTimerRef.current)
			}

			syncTimerRef.current = setTimeout(() => {
				syncUserWidgetsApi({
					workspace: 'HOME',
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
			}, 1000)
		},
		[
			isAuthenticated,
			persistLayout,
			applyRuntimeLayout,
			setSavedLayout,
			savedLayoutRef,
		]
	)

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
		hasFetchedServerRef.current = false
		hasLocalEditRef.current = false
		loadFromLocalStorage()
	}, [token, loadFromLocalStorage])

	useEffect(() => {
		if (!isAuthenticated || hasFetchedServerRef.current) return
		hasFetchedServerRef.current = true

		async function fetchAndReconcileWithServer() {
			try {
				const serverWidgets = await getUserWidgetsApi('HOME')
				if (serverWidgets === null) return

				if (serverWidgets.length > 0) {
					if (hasLocalEditRef.current) return

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
					applyRuntimeLayout(reflowForColumns(fromSrv, colsRef.current))
					persistLayout(fromSrv)
				} else {
					const localLayout = await migrateWidgetLayoutIfNeeded()
					if (localLayout && localLayout.length > 0) {
						const synced = await syncUserWidgetsApi({
							workspace: 'HOME',
							widgets: localLayout.map(storedWidgetToApiPayload),
						})

						if (synced && synced.length > 0) {
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
		isAuthenticated,
		persistLayout,
		applyRuntimeLayout,
		setSavedLayout,
		savedLayoutRef,
		colsRef,
	])

	return { persistLayout, triggerServerSync, markLocalEdit }
}
