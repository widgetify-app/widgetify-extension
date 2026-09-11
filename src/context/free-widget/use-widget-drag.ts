import { startTransition, useCallback, useRef } from 'react'
import type React from 'react'
import { reconcileIdentity, resolveLayoutChange } from '@/layouts/widgets/layout-engine'
import type { StoredWidget, WidgetPosition } from '@/layouts/widgets/layout-engine/types'
import { WIDGET_DEFINITIONS } from '@/layouts/widgets/widget-registry'

type ApplyRuntimeLayout = (
	next: StoredWidget[] | ((prev: StoredWidget[]) => StoredWidget[])
) => void
type CommitMutation = (
	operation: string,
	nextRuntime: StoredWidget[],
	targetInstanceId?: string
) => boolean

interface UseWidgetDragParams {
	runtimeLayoutRef: React.MutableRefObject<StoredWidget[]>
	colsRef: React.MutableRefObject<number>
	applyRuntimeLayout: ApplyRuntimeLayout
	commitMutation: CommitMutation
}

export function useWidgetDrag({
	runtimeLayoutRef,
	colsRef,
	applyRuntimeLayout,
	commitMutation,
}: UseWidgetDragParams) {
	const dragBaseLayoutRef = useRef<StoredWidget[] | null>(null)
	const dragSequenceRef = useRef<number>(0)

	const startDragPreview = useCallback(() => {
		dragSequenceRef.current += 1
		dragBaseLayoutRef.current = runtimeLayoutRef.current
	}, [runtimeLayoutRef])

	const updateDragPreview = useCallback(
		(instanceId: string, targetPosition: WidgetPosition) => {
			const base = dragBaseLayoutRef.current
			if (!base) return

			const sequence = dragSequenceRef.current

			const result = resolveLayoutChange({
				layout: base,
				operation: 'move',
				instanceId,
				targetPosition,
				cols: colsRef.current,
				registry: WIDGET_DEFINITIONS,
			})

			if (!result) return

			startTransition(() => {
				if (
					dragSequenceRef.current !== sequence ||
					dragBaseLayoutRef.current === null
				) {
					return
				}
				applyRuntimeLayout((prev) => reconcileIdentity(prev, result))
			})
		},
		[colsRef, applyRuntimeLayout]
	)

	const endDragPreview = useCallback(
		(instanceId: string, targetPosition: WidgetPosition | null) => {
			const base = dragBaseLayoutRef.current
			dragBaseLayoutRef.current = null
			dragSequenceRef.current += 1
			if (!base) return

			const restore = () => {
				if (runtimeLayoutRef.current !== base) {
					applyRuntimeLayout(base)
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
		[runtimeLayoutRef, colsRef, applyRuntimeLayout, commitMutation]
	)

	return { startDragPreview, updateDragPreview, endDragPreview }
}
