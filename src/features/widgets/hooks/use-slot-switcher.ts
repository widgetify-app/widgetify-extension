import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type React from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import type { StoredWallpaper } from '@/common/types/wallpaper.interface'
import type { WidgetWorkspace } from '@/services/widgets/widget-sync.hook'
import type { StoredWidget } from '../utils/layout-engine/types'
import { isSlotLocked, SLOT_WORKSPACES } from '../utils/slots/slot-access'
import { normalizeSlotName } from '../utils/slots/normalize-slots'
import {
	findSlot,
	lookChanges,
	withActiveSlot,
	withoutSlot,
	withSlotName,
	withStashedSlot,
} from '../utils/slots/slot-list'
import { applyLook, readCurrentLook } from '../utils/slots/slot-look'
import {
	loadActiveSlot,
	loadSlots,
	saveActiveSlot,
	saveSlots,
	watchActiveSlot,
	watchSlots,
} from '../utils/slots/slot-store'
import type { FreeWidgetSlots, WidgetSlot, WidgetSlotView } from '../types'

interface UseSlotSwitcherParams {
	isAuthenticated: boolean
	isVip: boolean
	isProfileFresh: boolean
	activeWorkspace: WidgetWorkspace | null
	activeWorkspaceRef: React.MutableRefObject<WidgetWorkspace | null>
	setActiveWorkspace: (workspace: WidgetWorkspace) => void
	savedLayout: StoredWidget[]
	savedLayoutRef: React.MutableRefObject<StoredWidget[]>
	flushServerSync: () => Promise<void>
	replaceLayout: (widgets: StoredWidget[], options: { syncToServer: boolean }) => void
	setSelectedInstanceId: (id: string | null) => void
	fontFamily: string
	activeWallpaper: StoredWallpaper | null
	applyStoredWallpaper: (wallpaper: StoredWallpaper) => void
}

function slotLabel(customName: string | null, index: number): string {
	return (
		customName ??
		t('widgets.slots.defaultName', { number: (index + 1).toLocaleString('fa-IR') })
	)
}

export function useSlotSwitcher({
	isAuthenticated,
	isVip,
	isProfileFresh,
	activeWorkspace,
	activeWorkspaceRef,
	setActiveWorkspace,
	savedLayout,
	savedLayoutRef,
	flushServerSync,
	replaceLayout,
	setSelectedInstanceId,
	fontFamily,
	activeWallpaper,
	applyStoredWallpaper,
}: UseSlotSwitcherParams): FreeWidgetSlots {
	const fontFamilyRef = useRef(fontFamily)
	useEffect(() => {
		fontFamilyRef.current = fontFamily
	}, [fontFamily])
	const [slots, setSlots] = useState<WidgetSlot[]>([])
	const slotsRef = useRef<WidgetSlot[]>([])
	const [isSwitching, setIsSwitching] = useState(false)
	const isSwitchingRef = useRef(false)

	const applySlots = useCallback((next: WidgetSlot[]) => {
		slotsRef.current = next
		setSlots(next)
	}, [])

	useEffect(() => {
		let cancelled = false
		Promise.all([loadSlots(), loadActiveSlot()])
			.then(([stored, active]) => {
				if (cancelled) return
				applySlots(stored)
				setActiveWorkspace(active)
			})
			.catch(() => {
				if (!cancelled) setActiveWorkspace('HOME')
			})
		const unwatchSlots = watchSlots(applySlots)
		const unwatchActive = watchActiveSlot(setActiveWorkspace)
		return () => {
			cancelled = true
			unwatchSlots()
			unwatchActive()
		}
	}, [applySlots, setActiveWorkspace])

	const switchSlot = useCallback(
		async (target: WidgetWorkspace, startWith?: StoredWidget[]): Promise<boolean> => {
			const from = activeWorkspaceRef.current
			if (!from || isSwitchingRef.current) return false
			if (!isAuthenticated || isSlotLocked(target, isVip)) return false
			if (target === from) return true

			isSwitchingRef.current = true
			setIsSwitching(true)
			try {
				await flushServerSync()

				const now = Date.now()
				const currentLook = await readCurrentLook(fontFamilyRef.current)
				const stashed = withStashedSlot(
					slotsRef.current,
					from,
					{ widgets: savedLayoutRef.current, look: currentLook },
					now
				)
				const targetSlot = findSlot(stashed, target)
				const incoming = startWith ?? targetSlot?.widgets ?? []
				const changes = startWith
					? {}
					: lookChanges(currentLook, targetSlot?.look ?? null)
				const nextSlots = withActiveSlot(stashed, target, startWith, now)

				applySlots(nextSlots)
				await saveSlots(nextSlots)
				setActiveWorkspace(target)
				await saveActiveSlot(target)

				setSelectedInstanceId(null)
				applyLook(changes, applyStoredWallpaper)
				replaceLayout(incoming, { syncToServer: false })
				Analytics.event('widget_slot_switched')
				return true
			} catch {
				showToast(t('widgets.slots.switchFailed'), 'error')
				return false
			} finally {
				isSwitchingRef.current = false
				setIsSwitching(false)
			}
		},
		[
			isAuthenticated,
			isVip,
			activeWorkspaceRef,
			savedLayoutRef,
			flushServerSync,
			applySlots,
			setActiveWorkspace,
			setSelectedInstanceId,
			replaceLayout,
			applyStoredWallpaper,
		]
	)

	const openSlot = useCallback(
		async (workspace: WidgetWorkspace): Promise<boolean> => {
			if (!isAuthenticated) {
				callEvent('openProfile')
				return false
			}
			if (isSlotLocked(workspace, isVip)) {
				Analytics.event('widget_slot_pro_locked')
				callEvent('openSettings', 'vip')
				return false
			}
			const isEmpty = !findSlot(slotsRef.current, workspace)?.widgets.length
			if (isEmpty && workspace !== activeWorkspaceRef.current) {
				callEvent('openWidgetSlotsModal', 'slots')
				return false
			}
			return workspace !== activeWorkspaceRef.current && switchSlot(workspace)
		},
		[isAuthenticated, isVip, activeWorkspaceRef, switchSlot]
	)

	const renameSlot = useCallback(
		(workspace: WidgetWorkspace, name: string) => {
			const next = withSlotName(
				slotsRef.current,
				workspace,
				normalizeSlotName(name)
			)
			applySlots(next)
			saveSlots(next)
			Analytics.event('widget_slot_renamed')
		},
		[applySlots]
	)

	const clearSlot = useCallback(
		(workspace: WidgetWorkspace) => {
			if (workspace === activeWorkspaceRef.current) return
			const next = withoutSlot(slotsRef.current, workspace)
			applySlots(next)
			saveSlots(next)
			showToast(t('widgets.slots.cleared'), 'success')
			Analytics.event('widget_slot_cleared')
		},
		[activeWorkspaceRef, applySlots]
	)

	const views = useMemo<WidgetSlotView[]>(
		() =>
			SLOT_WORKSPACES.map((workspace, index) => {
				const stored = findSlot(slots, workspace)
				const isActive = workspace === (activeWorkspace ?? 'HOME')
				const widgets = isActive ? savedLayout : (stored?.widgets ?? [])
				const customName = stored?.name ?? null
				return {
					workspace,
					label: slotLabel(customName, index),
					customName,
					widgets,
					wallpaper: isActive
						? activeWallpaper
						: (stored?.look?.wallpaper ?? null),
					isActive,
					isLocked: isSlotLocked(workspace, isVip),
					isEmpty: widgets.length === 0,
				}
			}),
		[slots, activeWorkspace, savedLayout, activeWallpaper, isVip]
	)

	useEffect(() => {
		if (!isProfileFresh || !activeWorkspace) return
		if (!isSlotLocked(activeWorkspace, isVip)) return

		switchSlot('HOME').then((switched) => {
			if (!switched) return
			const name = slotLabel(findSlot(slotsRef.current, 'HOME')?.name ?? null, 0)
			showToast(t('widgets.slots.proEnded', { name }), 'info')
		})
	}, [isProfileFresh, activeWorkspace, isVip, switchSlot])

	return useMemo(
		() => ({
			canUseSlots: isAuthenticated,
			activeSlot: views.find((view) => view.isActive) ?? views[0],
			slots: views,
			isSwitching,
			openSlot,
			switchSlot,
			renameSlot,
			clearSlot,
		}),
		[isAuthenticated, views, isSwitching, openSlot, switchSlot, renameSlot, clearSlot]
	)
}
