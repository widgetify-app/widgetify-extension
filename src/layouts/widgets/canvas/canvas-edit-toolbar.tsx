import { createPortal } from 'react-dom'

interface CanvasEditToolbarProps {
	onAddWidget: () => void
	onExitEditMode: () => void
}

export function CanvasEditToolbar({
	onAddWidget,
	onExitEditMode,
}: CanvasEditToolbarProps) {
	return createPortal(
		<div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-70 flex items-center gap-3 px-4 py-2 rounded-2xl bg-base-200/90 backdrop-blur-xl border border-base-content/15 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-200 select-none">
			<div className="flex items-center gap-2 pl-2 border-l border-base-content/10">
				<span className="relative flex h-2 w-2">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
					<span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
				</span>
				<span className="text-xs font-bold text-content whitespace-nowrap">
					ویرایش چیدمان
				</span>
			</div>

			<div className="flex items-center gap-1.5">
				<button
					type="button"
					onClick={onAddWidget}
					className="px-3 py-1.5 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-1 cursor-pointer shadow-sm whitespace-nowrap"
				>
					<span>+</span>
					<span>افزودن ویجت</span>
				</button>

				<button
					type="button"
					onClick={onExitEditMode}
					className="px-3 py-1.5 text-xs font-medium rounded-xl bg-base-300 hover:bg-base-300/80 text-content active:scale-95 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
				>
					<span>✓</span>
					<span>پایان</span>
				</button>
			</div>
		</div>,
		document.body
	)
}
