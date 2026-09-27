import { createPortal } from 'react-dom'
import { Icon } from '@/icons'

interface CanvasEditToolbarProps {
	onAddWidget: () => void
	onOpenPresets?: () => void
	onExitEditMode: () => void
}

export function CanvasEditToolbar({
	onAddWidget,
	onOpenPresets,
	onExitEditMode,
}: CanvasEditToolbarProps) {
	return createPortal(
		<div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-70 flex items-center gap-3 px-4 py-2 rounded-2xl bg-surface-2 backdrop-blur-xl border border-line shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-200 select-none">
			<div className="flex items-center gap-2 pl-2 border-l border-line">
				<span className="relative flex h-2 w-2">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
				</span>
				<span className="text-xs font-bold text-fg whitespace-nowrap">
					ویرایش چیدمان
				</span>
			</div>

			<div className="flex items-center gap-1.5">
				<button
					type="button"
					onClick={onAddWidget}
					className="px-3 py-1.5 text-xs font-bold rounded-xl bg-brand text-on-brand hover:bg-brand-hover active:scale-95 transition-all flex items-center gap-1 cursor-pointer shadow-sm whitespace-nowrap"
				>
					<span>+</span>
					<span>افزودن ویجت</span>
				</button>

				{onOpenPresets && (
					<button
						type="button"
						onClick={onOpenPresets}
						className="px-3 py-1.5 text-xs font-bold rounded-xl bg-surface-3 hover:bg-fill-2 text-fg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
					>
						<Icon name="squares2X2" size={13} />
						<span>چیدمان‌های آماده</span>
					</button>
				)}

				<button
					type="button"
					onClick={onExitEditMode}
					className="px-3 py-1.5 text-xs font-medium rounded-xl bg-surface-3 hover:bg-fill-2 text-fg active:scale-95 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
				>
					<span>✓</span>
					<span>پایان</span>
				</button>
			</div>
		</div>,
		document.body
	)
}
