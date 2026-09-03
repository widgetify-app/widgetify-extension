import { useCallback } from 'react'
import type React from 'react'
import Analytics from '@/analytics'
import { playNativeToastSound, showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { callEvent } from '@/common/utils/call-event'
import {
	DEFAULT_COLS,
	resolveLayoutChange,
	validateLayout,
} from '@/layouts/widgets/layout-engine'
import {
	type StoredWidget,
	WidgetKeys,
	type WidgetPosition,
	type WidgetSize,
} from '@/layouts/widgets/layout-engine/types'
import { isServerInstanceId } from '@/layouts/widgets/instance-id'
import { WIDGET_DEFINITIONS } from '@/layouts/widgets/widget-registry'
import {
	createUserWidgetApi,
	deleteUserWidgetApi,
	updateUserWidgetApi,
} from '@/services/hooks/widgets/widget-sync.hook'
import { reflowForColumns, sanitizeLayout } from './widget-layout-helpers'
import { createNoteForDuplicatedWidget } from './widget-note-helpers'

type ApplyRuntimeLayout = (
	next: StoredWidget[] | ((prev: StoredWidget[]) => StoredWidget[])
) => void

interface UseWidgetOperationsParams {
	runtimeLayoutRef: React.MutableRefObject<StoredWidget[]>
	savedLayoutRef: React.MutableRefObject<StoredWidget[]>
	colsRef: React.MutableRefObject<number>
	isVipRef: React.MutableRefObject<boolean>
	selectedInstanceIdRef: React.MutableRefObject<string | null>
	isAuthenticated: boolean
	persistLayout: (layout: StoredWidget[]) => void
	triggerServerSync: (layout: StoredWidget[]) => void
	applyRuntimeLayout: ApplyRuntimeLayout
	setSavedLayout: React.Dispatch<React.SetStateAction<StoredWidget[]>>
	setRuntimeLayout: React.Dispatch<React.SetStateAction<StoredWidget[]>>
	setSelectedInstanceId: (id: string | null) => void
	markLocalEdit: () => void
}

export function useWidgetOperations({
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
}: UseWidgetOperationsParams) {
	const commitMutation = useCallback(
		(operation: string, nextRuntime: StoredWidget[], targetInstanceId?: string) => {
			const currentCols = colsRef.current
			if (!validateLayout(nextRuntime, currentCols, WIDGET_DEFINITIONS)) {
				return false
			}

			markLocalEdit()
			applyRuntimeLayout(nextRuntime)

			if (currentCols >= DEFAULT_COLS) {
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
		[
			colsRef,
			persistLayout,
			triggerServerSync,
			applyRuntimeLayout,
			setSavedLayout,
			markLocalEdit,
		]
	)

	const resizeWidget = useCallback(
		(instanceId: string, newSize: WidgetSize): boolean => {
			const result = resolveLayoutChange({
				layout: runtimeLayoutRef.current,
				operation: 'resize',
				instanceId,
				targetSize: newSize,
				cols: colsRef.current,
				registry: WIDGET_DEFINITIONS,
			})

			if (!result) {
				showToast(
					'برای این اندازه جا نیست! ویجت‌های کناری رو جابه‌جا کن تا جا باز بشه',
					'error'
				)
				return false
			}

			return commitMutation('resize', result, instanceId)
		},
		[runtimeLayoutRef, colsRef, commitMutation]
	)

	const moveWidget = useCallback(
		(instanceId: string, targetPosition: WidgetPosition): boolean => {
			const result = resolveLayoutChange({
				layout: runtimeLayoutRef.current,
				operation: 'move',
				instanceId,
				targetPosition,
				cols: colsRef.current,
				registry: WIDGET_DEFINITIONS,
			})

			if (!result) return false
			return commitMutation('move', result, instanceId)
		},
		[runtimeLayoutRef, colsRef, commitMutation]
	)

	const updateWidgetVariant = useCallback(
		(
			instanceId: string,
			newSize: WidgetSize,
			meta?: Record<string, any>
		): boolean => {
			const current = runtimeLayoutRef.current.find(
				(w) => w.instanceId === instanceId
			)
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
				applyRuntimeLayout((prev) =>
					prev.map((w) => (w.instanceId === instanceId ? { ...w, meta } : w))
				)
				playNativeToastSound('success')
				return true
			}

			const result = resolveLayoutChange({
				layout: runtimeLayoutRef.current,
				operation: 'resize',
				instanceId,
				targetSize: newSize,
				cols: colsRef.current,
				registry: WIDGET_DEFINITIONS,
			})

			if (!result) {
				showToast(
					'برای این مدل جا نیست! ویجت‌های کناری رو جابه‌جا کن یا مدل کوچک‌تری انتخاب کن',
					'error'
				)
				return false
			}

			const layoutWithMeta = result.map((w: StoredWidget) =>
				w.instanceId === instanceId ? { ...w, meta } : w
			)

			showToast('مدل ویجت با موفقیت تغییر کرد', 'success')
			return commitMutation('resize', layoutWithMeta, instanceId)
		},
		[
			runtimeLayoutRef,
			colsRef,
			commitMutation,
			persistLayout,
			triggerServerSync,
			applyRuntimeLayout,
			setSavedLayout,
		]
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

			const isAlreadyActive = runtimeLayoutRef.current.some((w) => w.id === id)
			if (!def.canDuplicate && isAlreadyActive) {
				showToast(translateError('WIDGET_ALREADY_EXISTS') as string, 'error')
				return false
			}

			const chosenSize = initialSize || def.defaultSize
			const isCurrentlyActive = runtimeLayoutRef.current.some(
				(w) => w.id === def.id
			)
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
				layout: runtimeLayoutRef.current,
				operation: 'add',
				newWidget,
				targetPosition,
				cols: colsRef.current,
				registry: WIDGET_DEFINITIONS,
			})

			if (!result) {
				if (isAuthenticated && isServerInstanceId(finalInstanceId)) {
					deleteUserWidgetApi(finalInstanceId).catch(() => {})
				}
				showToast(translateError('NO_SPACE_FOR_WIDGET') as string, 'error')
				return false
			}

			playNativeToastSound('success')
			return commitMutation('add', result, finalInstanceId)
		},
		[runtimeLayoutRef, colsRef, isVipRef, isAuthenticated, commitMutation]
	)

	const duplicateWidget = useCallback(
		async (instanceId: string): Promise<boolean> => {
			const original = runtimeLayoutRef.current.find(
				(w) => w.instanceId === instanceId
			)
			if (!original) return false

			const def = WIDGET_DEFINITIONS[original.id]
			if (!def?.canDuplicate) {
				showToast('امکان تکرار این ویجت وجود نداره', 'error')
				return false
			}

			if (!isVipRef.current) {
				callEvent('openSettings', 'vip')
				return false
			}

			let duplicatedMeta = original.meta ? { ...original.meta } : {}

			if (original.id === WidgetKeys.notes) {
				const { noteId } = await createNoteForDuplicatedWidget(isAuthenticated)
				duplicatedMeta = { ...duplicatedMeta, activeNoteId: noteId }
			} else if (original.id === WidgetKeys.photo) {
				delete duplicatedMeta.imageSrc
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
					meta: duplicatedMeta,
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
				meta: duplicatedMeta,
			}

			const result = resolveLayoutChange({
				layout: runtimeLayoutRef.current,
				operation: 'duplicate',
				instanceId,
				newWidget,
				cols: colsRef.current,
				registry: WIDGET_DEFINITIONS,
			})

			if (!result) {
				if (isAuthenticated && isServerInstanceId(newInstanceId)) {
					deleteUserWidgetApi(newInstanceId).catch(() => {})
				}
				showToast(translateError('NO_SPACE_FOR_DUPLICATE') as string, 'error')
				return false
			}

			playNativeToastSound('success')
			return commitMutation('duplicate', result, newInstanceId)
		},
		[runtimeLayoutRef, colsRef, isVipRef, isAuthenticated, commitMutation]
	)

	const removeWidget = useCallback(
		(instanceId: string): boolean => {
			const result = resolveLayoutChange({
				layout: runtimeLayoutRef.current,
				operation: 'remove',
				instanceId,
				cols: colsRef.current,
				registry: WIDGET_DEFINITIONS,
			})

			if (!result) return false

			if (selectedInstanceIdRef.current === instanceId) {
				setSelectedInstanceId(null)
			}

			if (isAuthenticated && isServerInstanceId(instanceId)) {
				deleteUserWidgetApi(instanceId).catch(() => {})
			}

			playNativeToastSound('warning')
			return commitMutation('remove', result, instanceId)
		},
		[
			runtimeLayoutRef,
			colsRef,
			selectedInstanceIdRef,
			isAuthenticated,
			setSelectedInstanceId,
			commitMutation,
		]
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
			applyRuntimeLayout((prev) =>
				prev.map((w) => (w.instanceId === instanceId ? { ...w, meta } : w))
			)

			if (isAuthenticated && isServerInstanceId(instanceId)) {
				updateUserWidgetApi(instanceId, { meta }).catch(() => {})
			}
		},
		[isAuthenticated, persistLayout, applyRuntimeLayout, setSavedLayout]
	)

	const applyPresetLayout = useCallback(
		async (presetWidgets: StoredWidget[]): Promise<boolean> => {
			if (!Array.isArray(presetWidgets) || presetWidgets.length === 0) return false

			const sanitized = sanitizeLayout(presetWidgets, DEFAULT_COLS)
			const reflowed = reflowForColumns(sanitized, colsRef.current)

			markLocalEdit()
			setSavedLayout(sanitized)
			savedLayoutRef.current = sanitized
			setRuntimeLayout(reflowed)
			persistLayout(sanitized)

			if (isAuthenticated) {
				triggerServerSync(sanitized)
			}

			playNativeToastSound('success')
			return true
		},
		[
			isAuthenticated,
			persistLayout,
			triggerServerSync,
			colsRef,
			savedLayoutRef,
			setSavedLayout,
			setRuntimeLayout,
			markLocalEdit,
		]
	)

	return {
		commitMutation,
		resizeWidget,
		moveWidget,
		updateWidgetVariant,
		addWidget,
		duplicateWidget,
		removeWidget,
		updateWidgetSettings,
		applyPresetLayout,
	}
}
