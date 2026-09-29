import { Icon } from '@/icons'
import type { WidgetSize } from '../../utils/layout-engine/types'
import { PHOTO_PLACEHOLDER_SRC } from '../constants'

interface PhotoEmptyStateProps {
	size?: WidgetSize
}

export function PhotoEmptyState({ size }: PhotoEmptyStateProps) {
	const is1x1 = size?.w === 1 && size?.h === 1
	const is2x2 = size?.w === 2 && size?.h === 2
	const is2x4 = size?.w === 2 && size?.h === 4

	if (is1x1) {
		return (
			<span className="flex flex-col items-center justify-center w-full h-full p-2 text-center rounded-widget bg-glass-surface-2">
				<Icon
					name="imagePlus"
					size={20}
					aria-hidden="true"
					className="transition-ui text-fg-muted group-hover:text-brand group-hover:scale-110"
				/>
			</span>
		)
	}

	if (is2x2 || is2x4) {
		return (
			<span className="relative flex flex-col items-center justify-between w-full h-full p-3.5 text-center overflow-hidden rounded-widget bg-glass-surface-2 select-none">
				<span className="relative flex items-center justify-center flex-1 w-full min-h-0 overflow-hidden rounded-xl">
					<img
						src={PHOTO_PLACEHOLDER_SRC}
						alt=""
						className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
					/>
				</span>

				<span className="flex items-center justify-center gap-1.5 pt-2.5 shrink-0 text-fg-muted transition-colors duration-200 group-hover:text-brand">
					<Icon name="imagePlus" size={16} aria-hidden="true" />
					<span className="text-xs font-medium">برای انتخاب عکس کلیک کن</span>
				</span>
			</span>
		)
	}

	return (
		<span className="flex flex-col items-center justify-center w-full h-full gap-1 p-2 overflow-hidden text-center select-none rounded-widget bg-glass-surface-2">
			<span className="relative flex items-center justify-center overflow-hidden shrink-0 aspect-square h-[46cqh] rounded-xl">
				<img
					src={PHOTO_PLACEHOLDER_SRC}
					alt=""
					className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
				/>
			</span>

			<span className="text-3xs shrink-0 text-fg-muted">
				برای انتخاب یا آپلود کلیک کن
			</span>
		</span>
	)
}
