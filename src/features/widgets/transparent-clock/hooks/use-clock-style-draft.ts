import { useState } from 'react'
import { useOptionalFreeWidgets } from '@/features/widgets/widgets.context'
import type { TransparentClockStyle } from '../types'
import {
	normalizeTransparentClockStyle,
	transparentClockStyleToMeta,
} from '../utils/normalize-style'

export function useClockStyleDraft(
	instanceId: string | undefined,
	meta: Record<string, unknown> | undefined
) {
	const updateWidgetSettings = useOptionalFreeWidgets()?.updateWidgetSettings
	const [draft, setDraft] = useState<TransparentClockStyle | null>(null)

	const stored = normalizeTransparentClockStyle(meta)
	const style = draft ?? stored

	const start = () => setDraft(stored)

	const update = (next: Partial<TransparentClockStyle>) =>
		setDraft((current) => ({ ...(current ?? stored), ...next }))

	const save = () => {
		if (draft && instanceId && updateWidgetSettings) {
			updateWidgetSettings(instanceId, {
				...meta,
				...transparentClockStyleToMeta(draft),
			})
		}
		setDraft(null)
	}

	const cancel = () => setDraft(null)

	return { style, isEditing: draft !== null, start, update, save, cancel }
}
