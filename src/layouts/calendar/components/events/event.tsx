import { motion } from 'framer-motion'
import type jalaliMoment from 'jalali-moment'
import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import type { FetchedAllEvents } from '../../../../services/getMethodHooks/getEvents.hook'
import { getGregorianEvents, getHijriEvents, getShamsiEvents } from '../../utils'

interface Prop {
	// events: Event[]
	events: FetchedAllEvents
	currentDate: jalaliMoment.Moment
}

const getEventTypeColor = (type: Event['type']) => {
	switch (type) {
		case 'holiday':
			return 'bg-red-500/10 text-red-500'
		case 'event':
			return 'bg-blue-500/10 text-blue-500'
		case 'news':
			return 'bg-yellow-500/10 text-yellow-500'
		default:
			return 'bg-gray-500/10 text-gray-500'
	}
}

export function Events({ events, currentDate }: Prop) {
	const [isExpanded, setIsExpanded] = useState(false)
	const shamsiEvents = getShamsiEvents(events, currentDate)
	const gregorianEvents = getGregorianEvents(events, currentDate)
	const hijriEvents = getHijriEvents(events, currentDate)
	const selectedEvents = [...shamsiEvents, ...gregorianEvents, ...hijriEvents]

	// تنظیمات انیمیشن
	const containerVariants = {
		collapsed: { height: 160 }, // ارتفاع بسته شده (~40 = 160px)
		expanded: { height: 320 }, // ارتفاع باز شده (~80 = 320px)
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-3">
				<h4 className="text-lg text-gray-300">رویدادها</h4>
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="p-1.5 text-gray-400 rounded-lg hover:bg-gray-700/30 transition-colors"
				>
					{isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
				</button>
			</div>

			<motion.div
				variants={containerVariants}
				initial="collapsed"
				animate={isExpanded ? 'expanded' : 'collapsed'}
				className="space-y-2 overflow-y-auto rounded-lg bg-neutral-800/30"
				style={{ maxHeight: 320 }}
				transition={{ type: 'spring', damping: 20, stiffness: 100 }}
			>
				<div className="p-2">
					{selectedEvents.length > 0 ? (
						selectedEvents.map((event, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className={`p-3 rounded-lg mb-2 last:mb-0 ${getEventTypeColor(
									event.isHoliday ? 'holiday' : 'event',
								)}`}
							>
								<div className="font-medium">{event.title}</div>
							</motion.div>
						))
					) : (
						<div className="py-4 text-center text-gray-400">
							رویدادی برای این روز ثبت نشده است
						</div>
					)}
				</div>
			</motion.div>
		</div>
	)
}
