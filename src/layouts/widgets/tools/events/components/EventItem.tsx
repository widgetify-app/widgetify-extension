import Tooltip from '@/components/toolTip'
import { motion } from 'framer-motion'
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
				return <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full"></div>
			case 'gregorian':
				return <FiGlobe className={'text-green-400'} size={12} />
			case 'hijri':
				return <FiMoon className={'text-blue-400'} size={12} />
			default: // shamsi
				return <FiCalendar className={'text-blue-400'} size={12} />
		}
	}

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1 },
	}

	return (
		<motion.div
			key={`${event.source}-${index}`}
			className={
				'mb-2 rounded-lg overflow-hidden bg-content border-r-2 border-primary-content'
			}
			variants={itemVariants}
		>
			<div className="relative p-1">
				<div className="flex items-center mb-1">
					{getSourceIcon(event.source)}
					<span className={`text-xs font-medium mr-1.5 ${getSubTextStyle()}`}>
						{event.source === 'google' ? 'گوگل کلندر' : 'مناسبت روزانه'}
					</span>
					{event.isHoliday && (
						<span
							className={
								'mr-auto text-xs px-2 py-0.5 rounded-full bg-error/50 text-error'
							}
						>
							تعطیل
						</span>
					)}
				</div>

				<h4 className={'text-sm font-medium w-44 text-wrap text-content'}>
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
									onClick={() => window.open(event.googleItem?.hangoutLink, '_blank')}
									className={'cursor-pointer p-1 rounded-full hover:bg-gray-700'}
								>
									<FiVideo size={16} className={getSubTextStyle()} />
								</button>
							</Tooltip>
						)}
						<Tooltip content="مشاهده در تقویم گوگل">
							<button
								onClick={() => window.open(event.googleItem?.htmlLink, '_blank')}
								className={'cursor-pointer p-1 rounded-full hover:bg-gray-700'}
							>
								<FiChevronRight size={16} className={getSubTextStyle()} />
							</button>
						</Tooltip>
					</div>
				)}
			</div>
		</motion.div>
	)
}
