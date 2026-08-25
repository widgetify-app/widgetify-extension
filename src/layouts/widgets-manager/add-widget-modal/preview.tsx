import type {
	WidgetDefinition,
	WidgetSize,
	WidgetVariantOption,
} from '@/layouts/widgets/layout-engine/types'

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

		return {
			width: `${width}px`,
			height: `${height}px`,
			transform: scale < 1 ? `scale(${scale})` : undefined,
			transformOrigin: 'center center',
		}
	}

	return (
		<div
			style={{
				backgroundImage:
					'radial-gradient(circle, currentColor 1px, transparent 1px)',
				backgroundSize: '16px 16px',
			}}
			className="flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-base-300/10 text-base-content/15 border border-base-content/10 overflow-hidden relative min-h-47.5"
		>
			<div className="text-[10px] text-muted absolute top-2 right-2 font-medium bg-base-200/80 px-2 py-0.5 rounded-lg border border-base-content/10 z-10">
				پیش‌نمایش در اندازه {previewSize.w}×{previewSize.h}
			</div>

			<div
				style={getPreviewDimensions(previewSize)}
				className="flex items-center justify-center overflow-hidden pointer-events-none select-none transition-all duration-200"
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
	)
}
