import { FiCalendar } from 'react-icons/fi'

export function EventsEmptyState() {
	return (
		<div
			className={
				'flex-1 flex flex-col items-center justify-center rounded-lg px-5 py-20'
			}
		>
			<div
				className={
					'inline-flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-content'
				}
			>
				<FiCalendar className="text-content" size={24} />
			</div>
			<p className={'text-center text-content'}>مناسبتی برای نمایش وجود ندارد.</p>
		</div>
	)
}
