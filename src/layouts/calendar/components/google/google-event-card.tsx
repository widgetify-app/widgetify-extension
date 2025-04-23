import Tooltip from '@/components/toolTip'
import { getTextColor, useTheme } from '@/context/theme.context'
import type { GoogleCalendarEvent } from '@/services/getMethodHooks/getGoogleCalendarEvents.hook'
import { motion } from 'framer-motion'
import { AiOutlineGoogle } from 'react-icons/ai'
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiVideo } from 'react-icons/fi'

interface GoogleEventCardProps {
	event: GoogleCalendarEvent
	index: number
}

export function GoogleEventCard({ event, index }: GoogleEventCardProps) {
	const { theme } = useTheme()

	const googleStyle = {
		light: {
			container: 'bg-gray-100/70 border-l-4 border-[#1a73e8]',
			icon: 'text-[#1a73e8]',
			title: 'text-[#202124]',
		},
		dark: {
			container: 'bg-black/20 border-l-4 border-[#8ab4f8] shadow-md',
			icon: 'text-[#8ab4f8]',
			title: 'text-gray-100',
		},
		glass: {
			container: 'bg-black/20  border-l-4 border-blue-400/40 shadow-md',
			icon: 'text-blue-400/40',
			title: 'text-white',
		},
	}

	const styles =
		theme === 'light'
			? googleStyle.light
			: theme === 'dark'
				? googleStyle.dark
				: googleStyle.glass

	const formatEventTime = (dateTime: string) => {
		const date = new Date(dateTime)
		return date.toLocaleTimeString('fa-IR', {
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const getEventStatus = () => {
		const now = new Date()
		const startTime = new Date(event.start.dateTime)
		const endTime = new Date(event.end.dateTime)

		if (now < startTime) return { text: 'آینده', class: 'bg-blue-500/20 text-blue-500' }
		if (now >= startTime && now <= endTime)
			return { text: 'در حال برگزاری', class: 'bg-green-500/20 text-green-500' }
		return { isCompleted: true }
	}

	const getEventTimeStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-[#5f6368]'
			case 'dark':
				return 'text-[#bdc1c6]'
			default:
				return 'text-gray-300'
		}
	}

	const getMetaTextStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-[#5f6368]'
			default:
				return 'text-gray-400'
		}
	}

	const getHoverBackgroundStyle = () => {
		switch (theme) {
			case 'light':
				return 'hover:bg-[#1a73e8]/10'
			case 'dark':
				return 'hover:bg-[#8ab4f8]/20'
			default:
				return 'hover:bg-[#ffffff]/20'
		}
	}

	const eventStatus = getEventStatus()

	return (
		<motion.div
			custom={index}
			variants={{
				initial: { opacity: 0, y: 5 },
				animate: (i) => ({
					opacity: 1,
					y: 0,
					transition: { delay: i * 0.05 },
				}),
			}}
			initial="initial"
			animate="animate"
			className={`${styles.container} rounded-md mb-1.5 last:mb-0 overflow-hidden`}
			whileHover={{
				x: 2,
				boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
				transition: { duration: 0.2 },
			}}
		>
			<div className="p-1.5">
				<div className="flex items-center justify-between mb-0.5">
					<h3
						className={`font-light ${getTextColor(theme)} text-sm ${eventStatus.isCompleted ? 'line-through ' : ''}`}
					>
						{event.summary}
					</h3>
					<div className="flex items-center">
						<AiOutlineGoogle size={14} className={styles.icon} />
					</div>
				</div>

				<div className="flex flex-wrap items-center mb-0.5 gap-x-2">
					<div className="flex items-center gap-1">
						<FiClock size={10} className={`mr-0.5 ${getMetaTextStyle()}`} />
						<span className={`text-xs ${getEventTimeStyle()}`}>
							{formatEventTime(event.start.dateTime)} -{' '}
							{formatEventTime(event.end.dateTime)}
						</span>
					</div>

					{!eventStatus.isCompleted && (
						<span className={`text-[10px] px-1 py-0.5 rounded-full ${eventStatus.class}`}>
							{eventStatus.text}
						</span>
					)}
				</div>

				<div className="flex flex-wrap items-center gap-x-2">
					{event.location && (
						<div className={`flex items-center text-[10px] ${getMetaTextStyle()}`}>
							<FiMapPin size={9} className="mr-0.5" />
							<span className="truncate max-w-[120px]">{event.location}</span>
						</div>
					)}

					{event.attendees && event.attendees.length > 0 && (
						<div className={`flex items-center text-[10px] ${getMetaTextStyle()}`}>
							<FiUsers size={9} className="mr-0.5" />
							<span>{event.attendees.length}</span>
						</div>
					)}

					<div className="flex gap-0.5 ml-auto">
						{event.conferenceData && (
							<Tooltip content="پیوستن به جلسه">
								<motion.div
									className={`cursor-pointer ${getHoverBackgroundStyle()} p-1 rounded-full ${styles.icon}`}
									onClick={() => window.open(event.hangoutLink, '_blank')}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.95 }}
								>
									<FiVideo size={12} />
								</motion.div>
							</Tooltip>
						)}
						<Tooltip content="مشاهده در تقویم گوگل">
							<motion.div
								className={`cursor-pointer ${getHoverBackgroundStyle()} p-1 rounded-full ${styles.icon}`}
								onClick={() => window.open(event.htmlLink, '_blank')}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
							>
								<FiCalendar size={12} />
							</motion.div>
						</Tooltip>
					</div>
				</div>
			</div>
		</motion.div>
	)
}
