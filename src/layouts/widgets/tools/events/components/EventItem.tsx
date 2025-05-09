import Tooltip from '@/components/toolTip'
import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import {
	FiCalendar,
	FiChevronRight,
	FiClock,
	FiGlobe,
	FiStar,
	FiVideo,
} from 'react-icons/fi'
import type { CombinedEvent } from '../utils'
import { formatEventTime } from '../utils'

interface EventItemProps {
	event: CombinedEvent
	index: number
}

export function EventItem({ event, index }: EventItemProps) {
	const { theme } = useTheme()

	const getEventCardStyle = (isHoliday: boolean) => {
		if (isHoliday) {
			switch (theme) {
				case 'light':
					return 'bg-gradient-to-r from-red-50 to-white border-r-2 border-red-400'
				case 'dark':
					return 'bg-gradient-to-r from-red-900/20 to-gray-800/40 border-r-2 border-red-500'
				default: // glass
					return 'bg-gradient-to-r from-red-500/10 to-gray-700/10 border-r-2 border-red-400/60 backdrop-blur-sm'
			}
		}

		switch (theme) {
			case 'light':
				return 'bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 border-r border-gray-200'
			case 'dark':
				return 'bg-gradient-to-r from-gray-700/40 to-gray-800/20 hover:from-blue-900/20 border-r border-gray-700'
			default: // glass
				return 'bg-gradient-to-r from-gray-600/10 to-gray-700/5 hover:from-blue-500/10 border-r border-gray-500/20 backdrop-blur-sm'
		}
	}

	const getTextStyle = (isHoliday: boolean) => {
		if (isHoliday) {
			return theme === 'light' ? 'text-red-600' : 'text-red-400'
		}
		return theme === 'light' ? 'text-gray-800' : 'text-gray-200'
	}

	const getSubTextStyle = () => {
		return theme === 'light' ? 'text-gray-500' : 'text-gray-400'
	}

	const getSourceIcon = (source: string, isHoliday: boolean) => {
		switch (source) {
			case 'google':
				return <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full"></div>
			case 'gregorian':
				return (
					<FiGlobe
						className={`${isHoliday ? 'text-red-400' : 'text-green-400'}`}
						size={12}
					/>
				)
			case 'hijri':
				return (
					<FiStar
						className={`${isHoliday ? 'text-red-400' : 'text-amber-400'}`}
						size={12}
					/>
				)
			default: // shamsi
				return (
					<FiCalendar
						className={`${isHoliday ? 'text-red-400' : 'text-blue-400'}`}
						size={12}
					/>
				)
		}
	}

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1 },
	}

	return (
		<motion.div
			key={`${event.source}-${index}`}
			className={`mb-2 rounded-lg overflow-hidden ${getEventCardStyle(event.isHoliday)}`}
			variants={itemVariants}
		>
			<div className="relative p-1">
				<div className="flex items-center mb-1">
					{getSourceIcon(event.source, event.isHoliday)}
					<span className={`text-xs font-medium mr-1.5 ${getSubTextStyle()}`}>
						{event.source === 'google' ? 'گوگل کلندر' : 'مناسبت روزانه'}
					</span>
					{event.isHoliday && (
						<span
							className={`mr-auto text-xs px-2 py-0.5 rounded-full ${theme === 'light' ? 'bg-red-100 text-red-600' : 'bg-red-900/30 text-red-400'}`}
						>
							تعطیل
						</span>
					)}
				</div>

				<h4 className={`text-sm font-medium ${getTextStyle(event.isHoliday)}`}>
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
									className={`cursor-pointer p-1 rounded-full ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}
								>
									<FiVideo size={16} className={getSubTextStyle()} />
								</button>
							</Tooltip>
						)}
						<Tooltip content="مشاهده در تقویم گوگل">
							<button
								onClick={() => window.open(event.googleItem?.htmlLink, '_blank')}
								className={`cursor-pointer p-1 rounded-full ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}
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
