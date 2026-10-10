import { t } from '@/common/i18n'
import type {
	WidgetDefinition,
	WidgetSize,
	WidgetVariantOption,
} from '@/features/widgets/utils/layout-engine/types'

interface AddWidgetPreviewProps {
	definition: WidgetDefinition
	previewSize: WidgetSize
	selectedVariant: WidgetVariantOption | null
}

export function AddWidgetPreview({
	definition,
	previewSize,
	selectedVariant,
}: AddWidgetPreviewProps) {
	const getPreviewDimensions = (size: WidgetSize) => {
		const cellW = 125
		const cellH = 96
		const gap = 8

		const width = size.w * cellW + (size.w - 1) * gap
		const height = size.h * cellH + (size.h - 1) * gap

		const maxPreviewW = 540
		const maxPreviewH = 260
		const scale = Math.min(1, maxPreviewW / width, maxPreviewH / height)

		return { width, height, scale }
	}

	const { width, height, scale } = getPreviewDimensions(previewSize)

	return (
		<div
			style={{
				backgroundImage:
					'radial-gradient(circle, currentColor 1px, transparent 1px)',
				backgroundSize: '16px 16px',
			}}
			className="flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-fill text-fg-ghost border border-line overflow-hidden relative min-h-47.5"
		>
			<div className="text-3xs text-fg-muted absolute top-2 right-2 font-medium bg-fill-2 px-2 py-0.5 rounded-lg border border-line z-10">
				{t('widgets.catalog.previewSize', {
					w: previewSize.w,
					h: previewSize.h,
				})}
			</div>

			<div
				style={{ width: width * scale, height: height * scale }}
				className="relative shrink-0 pointer-events-none select-none"
			>
				<div
					style={{
						width,
						height,
						transform: scale < 1 ? `scale(${scale})` : undefined,
						transformOrigin: 'top left',
					}}
					className="absolute top-0 left-0 flex items-center justify-center overflow-hidden"
				>
					<div className="w-full h-full flex items-center justify-center">
						{definition.node(
							'preview-sample',
							previewSize,
							selectedVariant?.meta
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
