import Tooltip from '@/components/toolTip'
import {
	FiCalendar,
	FiChevronRight,
	FiClock,
	FiGlobe,
	FiMoon,
	FiVideo,
} from 'react-icons/fi'
import type { CombinedEvent } from '../utils'
import { formatEventTime } from '../utils'

interface EventItemProps {
	event: CombinedEvent
	index: number
}

export function EventItem({ event, index }: EventItemProps) {
	const getSubTextStyle = () => {
		return 'text-content opacity-90'
	}

	const getSourceIcon = (source: string) => {
		switch (source) {
			case 'google':
				return (
					<div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full"></div>
				)
			case 'gregorian':
				return <FiGlobe className={'text-green-400'} size={12} />
			case 'hijri':
				return <FiMoon className={'text-blue-400'} size={12} />
			default: // shamsi
				return <FiCalendar className={'text-blue-400'} size={12} />
		}
	}

	return (
		<div
			key={`${event.source}-${index}`}
			className="mb-2 rounded-lg overflow-hidden bg-content border border-base-300/40"
		>
			<div className="relative p-1.5">
				<div className="flex items-center mb-1">
					{getSourceIcon(event.source)}
					<span className={`text-xs font-medium mr-1.5 ${getSubTextStyle()}`}>
						{event.source === 'google' ? 'گوگل کلندر' : 'مناسبت روزانه'}{' '}
					</span>
					{event.isHoliday && (
						<span
							className={
								'absolute mr-auto -left-12 top-2 text-center w-32 text-xs px-2 py-0.5 rounded bg-error text-error-content transform -rotate-45 shadow'
							}
						>
							تعطیل
						</span>
					)}
				</div>

				<h4
					className={`pr-5 text-xs font-medium w-44 text-wrap ${event.isHoliday ? 'text-error' : 'text-content'}`}
				>
					{event.title}
				</h4>

				{event.time && (
					<div className="flex items-center">
						<FiClock size={12} className={getSubTextStyle()} />
						<span className={`mr-1 text-xs ${getSubTextStyle()}`}>
							{formatEventTime(event.time)}
						</span>
					</div>
				)}

				{event.source === 'google' && event.location && (
					<div className={`mt-2 text-xs ${getSubTextStyle()}`}>
						<span className="block truncate">{event.location}</span>
					</div>
				)}

				{event.source === 'google' && (
					<div className="absolute left-3 bottom-4">
						{event.googleItem?.conferenceData && (
							<Tooltip content="پیوستن به جلسه">
								<button
									onClick={() =>
										window.open(
											event.googleItem?.hangoutLink,
											'_blank'
										)
									}
									className={
										'cursor-pointer p-1 rounded-full hover:bg-gray-700'
									}
								>
									<FiVideo size={16} className={getSubTextStyle()} />
								</button>
							</Tooltip>
						)}
						<Tooltip content="مشاهده در تقویم گوگل">
							<button
								onClick={() =>
									window.open(event.googleItem?.htmlLink, '_blank')
								}
								className={
									'cursor-pointer p-1 rounded-full hover:bg-gray-700'
								}
							>
								<FiChevronRight size={16} className={getSubTextStyle()} />
							</button>
						</Tooltip>
					</div>
				)}
			</div>
		</div>
	)
}
