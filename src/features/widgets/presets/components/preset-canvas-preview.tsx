import type React from 'react'
import { useMemo } from 'react'
import { LAYOUT_PREVIEW_ROWS, LayoutPreview } from '../../components/layout-preview'
import type { PresetLayout } from '../types'
import { resolvePresetWidgetsForViewport } from '../utils/viewport'

interface PresetCanvasPreviewProps {
	preset: PresetLayout
	className?: string
}

export const PresetCanvasPreview: React.FC<PresetCanvasPreviewProps> = ({
	preset,
	className,
}) => {
	const resolvedWidgets = useMemo(
		() => resolvePresetWidgetsForViewport(preset, LAYOUT_PREVIEW_ROWS),
		[preset]
	)

	return <LayoutPreview widgets={resolvedWidgets} className={className} />
}
