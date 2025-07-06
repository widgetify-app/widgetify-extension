import { FiCalendar } from 'react-icons/fi'

export function EventsEmptyState() {
	return (
		<div
			className={
				'flex flex-col items-center justify-center gap-y-1.5 px-5 py-16'
			}
		>
			<div
				className={
					'flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300/70 border-base/70'
				}
			>
				<FiCalendar className="text-content" size={24} />
			</div>
			<p className="mt-1 text-center text-content">
				مناسبتی برای نمایش وجود ندارد.
			</p>
		</div>
	)
}
