import { Icon } from '@/src/icons'
import type { WidgetSize } from '../layout-engine/types'

interface PhotoEmptyStateProps {
	size?: WidgetSize
}

export function PhotoEmptyState({ size }: PhotoEmptyStateProps) {
	const is1x1 = size?.w === 1 && size?.h === 1
	const is2x2 = size?.w === 2 && size?.h === 2

	if (is1x1) {
		return (
			<div className="flex flex-col items-center justify-center w-full h-full p-2 text-center transition-all duration-300 rounded-widget bg-content bg-glass">
				<Icon
					name="imagePlus"
					size={22}
					className="transition-all duration-300 text-muted group-hover:text-primary group-hover:scale-110"
				/>
			</div>
		)
	}

	if (is2x2) {
		return (
			<div className="relative flex flex-col items-center justify-between w-full h-full p-3.5 text-center overflow-hidden rounded-widget bg-content bg-glass select-none">
				<div className="relative flex items-center justify-center flex-1 w-full min-h-0 overflow-hidden rounded-xl bg-base-300/20">
					<img
						src={'http://cdn.widgetify.ir/extension/friends.webp'}
						alt="دوستان"
						className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
					/>
				</div>

				<div className="flex items-center justify-center gap-1.5 pt-2.5 shrink-0 text-muted transition-colors duration-200 group-hover:text-primary">
					<Icon name="imagePlus" size={15} />
					<span className="text-xs font-medium">برای انتخاب عکس کلیک کن</span>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col items-center justify-center w-full h-full p-2 text-center select-none rounded-widget bg-content bg-glass">
			<div className="flex flex-col items-center justify-center">
				<div className="relative flex items-center justify-center flex-1 w-full min-h-0 overflow-hidden rounded-xl bg-base-300/20">
					<img
						src={'http://cdn.widgetify.ir/extension/friends.webp'}
						alt="دوستان"
						className="object-cover transition-transform duration-300 w-18 h-18 group-hover:scale-105"
					/>
				</div>

				<div className="flex flex-col items-center gap-0.5">
					<span className="text-[10px] text-muted">
						برای انتخاب یا آپلود کلیک کن
					</span>
				</div>
			</div>
		</div>
	)
}
