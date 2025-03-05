import { motion } from 'framer-motion'
import type jalaliMoment from 'jalali-moment'
import { useState } from 'react'
import { FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import type { FetchedAllEvents } from '../../../../services/getMethodHooks/getEvents.hook'
import { getGregorianEvents, getHijriEvents, getShamsiEvents } from '../../utils'

interface Prop {
	events: FetchedAllEvents
	currentDate: jalaliMoment.Moment
}

const getEventTypeStyles = (isHoliday: boolean) => {
	if (isHoliday) {
		return {
			container:
				'bg-gradient-to-r from-red-500/15 to-red-400/5 border-r-2 border-red-500 shadow-sm shadow-red-500/10',
			icon: 'text-red-400',
			title: 'text-red-400',
		}
	}
	return {
		container:
			'bg-gradient-to-r from-blue-500/15 to-blue-400/5 border-r-2 border-blue-500 shadow-sm shadow-blue-500/10',
		icon: 'text-blue-400',
		title: 'text-blue-400',
	}
}

export function Events({ events, currentDate }: Prop) {
	const [isExpanded, setIsExpanded] = useState(false)
	const shamsiEvents = getShamsiEvents(events, currentDate)
	const gregorianEvents = getGregorianEvents(events, currentDate)
	const hijriEvents = getHijriEvents(events, currentDate)
	const selectedEvents = [...shamsiEvents, ...gregorianEvents, ...hijriEvents]

	const containerVariants = {
		collapsed: { height: 110 },
		expanded: { height: 'auto', maxHeight: 320 },
	}

	const listVariants = {
		collapsed: { opacity: 1 },
		expanded: { opacity: 1 },
	}

	const itemVariants = {
		initial: { opacity: 0, y: 10 },
		animate: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: { delay: i * 0.05 },
		}),
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-1">
				<h4 className="flex items-center text-lg font-medium text-gray-300">رویدادها</h4>
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="p-1.5 text-gray-400 rounded-lg hover:bg-gray-700/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
					aria-label={isExpanded ? 'بستن لیست' : 'نمایش کامل'}
				>
					{isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
				</button>
			</div>

			<motion.div
				variants={containerVariants}
				initial="collapsed"
				animate={isExpanded ? 'expanded' : 'collapsed'}
				className="overflow-y-auto rounded-lg"
				transition={{ type: 'spring', damping: 20, stiffness: 100 }}
			>
				<motion.div className="p-2" variants={listVariants}>
					{selectedEvents.length > 0 ? (
						selectedEvents.map((event, index) => {
							const styles = getEventTypeStyles(event.isHoliday)

							return (
								<motion.div
									key={index}
									custom={index}
									variants={itemVariants}
									initial="initial"
									animate="animate"
									className={`${styles.container} rounded-lg p-1 mb-2 px-2 last:mb-0 flex items-center`}
									whileHover={{ x: 3, transition: { duration: 0.2 } }}
								>
									{event.icon ? (
										<img
											src={event.icon}
											alt=""
											className="object-contain w-4 h-4 p-1 ml-2 rounded-md bg-white/10"
											onError={(e) => {
												e.currentTarget.style.display = 'none'
											}}
										/>
									) : null}

									<div className="flex-1">
										<div className={`font-medium ${styles.title}`}>{event.title}</div>
									</div>
								</motion.div>
							)
						})
					) : (
						<motion.div
							className="py-2 text-center"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							<div className="inline-flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-700/30">
								<FiCalendar className="text-gray-400" size={24} />
							</div>
							<div className="text-gray-400">رویدادی برای این روز ثبت نشده است</div>
						</motion.div>
					)}
				</motion.div>
			</motion.div>
		</div>
	)
}
