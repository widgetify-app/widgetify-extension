import Tooltip from '@/components/toolTip'
import { useTheme } from '@/context/theme.context'
import type { GoogleCalendarEvent } from '@/services/getMethodHooks/getGoogleCalendarEvents.hook'
import { motion } from 'framer-motion'
import { AiOutlineGoogle } from 'react-icons/ai'
import { FiCalendar, FiMapPin, FiUsers, FiVideo } from 'react-icons/fi'

interface GoogleEventCardProps {
	event: GoogleCalendarEvent
	index: number
}

export function GoogleEventCard({ event, index }: GoogleEventCardProps) {
	const { theme } = useTheme()

	const googleStyle = {
		light: {
			container: 'bg-[#eaf3fd] border-r-2 border-[#1a73e8]',
			icon: 'text-[#1a73e8]',
			title: 'text-[#202124]',
		},
		dark: {
			container:
				'bg-gradient-to-r from-gray-700/20 to-gray-600/10 border-r-2 border-gray-500',
			icon: 'text-gray-400/80',
			title: 'text-gray-200/80',
		},
		glass: {
			container:
				'bg-gradient-to-r from-gray-700/20 to-gray-600/10 border-r-2 border-gray-500',
			icon: 'text-gray-400/80',
			title: 'text-gray-200/80',
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

	const getEventTimeStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-[#5f6368]' // Google's gray for light theme
			case 'dark':
				return 'text-[#bdc1c6]' // Light gray for dark theme
			default: // glass
				return 'text-gray-400/80' // Light gray for glass theme
		}
	}

	const getMetaTextStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-[#5f6368]' // Google's gray
			default:
				return 'text-gray-400/80' // Light gray for glass
		}
	}

	const getEventIconBackgroundStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-[#ffffff]/70 text-red-400' // Softer white for light theme
			default: // glass
				return 'bg-gray-600/10 text-gray-400' // Slightly opaque white for glass
		}
	}

	const getHoverBackgroundStyle = () => {
		switch (theme) {
			case 'light':
				return 'hover:bg-[#1a73e8]/10' // Light blue hover for light theme
			case 'dark':
				return 'hover:bg-[#8ab4f8]/20' // Light blue hover for dark theme
			default: // glass
				return 'hover:bg-[#ffffff]/20' // Subtle white hover for glass
		}
	}

	return (
		<motion.div
			custom={index}
			variants={{
				initial: { opacity: 0, y: 10 },
				animate: (i) => ({
					opacity: 1,
					y: 0,
					transition: { delay: i * 0.05 },
				}),
			}}
			initial="initial"
			animate="animate"
			className={`${styles.container} rounded-lg p-1 px-2 mb-2 last:mb-0 flex items-center shadow-sm`}
			whileHover={{ x: 3, transition: { duration: 0.2 } }}
		>
			<div className={`p-1.5 ml-2 rounded-md ${getEventIconBackgroundStyle()}`}>
				<AiOutlineGoogle size={14} />
			</div>

			<div className="flex-1 min-w-0">
				<div className={`font-medium truncate w-24 ${styles.title}`}>{event.summary}</div>

				<div className="flex items-center flex-wrap mt-0.5">
					<span className={`text-xs mr-1 font-medium ${getEventTimeStyle()}`}>
						{formatEventTime(event.start.dateTime)} -{' '}
						{formatEventTime(event.end.dateTime)}
					</span>

					{event.location && (
						<div className={`flex items-center text-xs ${getMetaTextStyle()} mr-2`}>
							<FiMapPin size={10} className="ml-0.5" />
							<span className="truncate max-w-[100px]">{event.location}</span>
						</div>
					)}

					{event.attendees && event.attendees.length > 0 && (
						<div
							className={`flex items-center text-xs font-light ${getMetaTextStyle()} mr-2`}
						>
							<FiUsers size={10} className="ml-0.5" />
							<span>{event.attendees.length}</span>
						</div>
					)}
				</div>
			</div>

			<div className="flex ml-1 space-x-2">
				{event.conferenceData && (
					<Tooltip content="پیوستن به جلسه">
						<div
							className={`cursor-pointer ${getHoverBackgroundStyle()} p-1 rounded ${styles.icon}`}
							onClick={() => window.open(event.hangoutLink, '_blank')}
						>
							<FiVideo size={14} />
						</div>
					</Tooltip>
				)}
				<Tooltip content="مشاهده در تقویم گوگل">
					<div
						className={`cursor-pointer ${getHoverBackgroundStyle()} p-1 rounded ${styles.icon}`}
						onClick={() => window.open(event.htmlLink, '_blank')}
					>
						<FiCalendar size={14} />
					</div>
				</Tooltip>
			</div>
		</motion.div>
	)
}
