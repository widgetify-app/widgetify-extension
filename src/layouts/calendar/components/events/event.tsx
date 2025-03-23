import { motion } from 'framer-motion'
import type jalaliMoment from 'jalali-moment'
import { FiCalendar } from 'react-icons/fi'
import { useTheme } from '@/context/theme.context'
import type { FetchedAllEvents } from '@/services/getMethodHooks/getEvents.hook'
import { getGregorianEvents, getHijriEvents, getShamsiEvents } from '../../utils'
import { AddToCalendarButton } from 'add-to-calendar-button-react'

interface Prop {
	events: FetchedAllEvents
	currentDate: jalaliMoment.Moment
	isPreview?: boolean
	onDateChange?: (date: jalaliMoment.Moment) => void
}

export function Events({ events, currentDate }: Prop) {
	const { theme } = useTheme()
	const shamsiEvents = getShamsiEvents(events, currentDate)
	const gregorianEvents = getGregorianEvents(events, currentDate)
	const hijriEvents = getHijriEvents(events, currentDate)
	const selectedEvents = [...shamsiEvents, ...gregorianEvents, ...hijriEvents]

	const getEventTypeStyles = (isHoliday: boolean) => {
		if (isHoliday) {
			switch (theme) {
				case 'light':
					return {
						container:
							'bg-gradient-to-r from-red-100/60 to-red-50/40 border-r-2 border-red-400 shadow-sm shadow-red-500/5',
						icon: 'text-red-600',
						title: 'text-red-600',
					}
				case 'dark':
					return {
						container:
							'bg-gradient-to-r from-red-950/40 to-red-900/20 border-r-2 border-red-500 shadow-sm shadow-red-500/5',
						icon: 'text-red-400',
						title: 'text-red-400',
					}
				default: // glass
					return {
						container:
							'bg-gradient-to-r from-red-500/15 to-red-400/5 border-r-2 border-red-500 shadow-sm shadow-red-500/10',
						icon: 'text-red-400',
						title: 'text-red-400',
					}
			}
		}

		switch (theme) {
			case 'light':
				return {
					container:
						'bg-gradient-to-r from-blue-100/60 to-blue-50/40 border-r-2 border-blue-400 shadow-sm shadow-blue-500/5',
					icon: 'text-blue-600',
					title: 'text-blue-600',
				}
			case 'dark':
				return {
					container:
						'bg-gradient-to-r from-blue-950/40 to-blue-900/20 border-r-2 border-blue-500 shadow-sm shadow-blue-500/5',
					icon: 'text-blue-400',
					title: 'text-blue-400',
				}
			default: // glass
				return {
					container:
						'bg-gradient-to-r from-blue-500/15 to-blue-400/5 border-r-2 border-blue-500 shadow-sm shadow-blue-500/10',
					icon: 'text-blue-400',
					title: 'text-blue-400',
				}
		}
	}

	const getHeaderTextStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700'
			default:
				return 'text-gray-300'
		}
	}

	const getNoEventsIconBackgroundStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-200/70'
			case 'dark':
				return 'bg-neutral-800/70'
			default: // glass
				return 'bg-neutral-700/30'
		}
	}

	const getNoEventsTextStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-500'
			default:
				return 'text-gray-400'
		}
	}

	const getEventIconBackgroundStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-white/50'
			case 'dark':
				return 'bg-white/5'
			default: // glass
				return 'bg-white/10'
		}
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
				<h4 className={`flex items-center text-lg font-medium ${getHeaderTextStyle()}`}>
					رویدادها
				</h4>
				<AddToCalendarButton
					name="Event"
					startDate={currentDate.toISOString()}
					options="Google"
					buttonStyle="default"
					hideIconButton
					hideBackground
					hideCheckmark
					size="1"
					styleLight='--font: "Vazir"; --btn-hover-background: #ffffff1f; --btn-hover-text: #fff; transition: all 0.7s ease-in-out !important;'
					language="fa"
				></AddToCalendarButton>
			</div>

			<motion.div
				initial="collapsed"
				className={'overflow-y-auto rounded-lg '}
				transition={{ type: 'spring', damping: 20, stiffness: 100 }}
			>
				<motion.div className="p-2" variants={listVariants}>
					{selectedEvents.length > 0 ? (
						<>
							{selectedEvents.map((event, index) => {
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
												className={`object-contain w-4 h-4 p-1 ml-2 rounded-md ${getEventIconBackgroundStyle()}`}
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
							})}
						</>
					) : (
						<motion.div
							className="py-2 text-center"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							<div
								className={`inline-flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full ${getNoEventsIconBackgroundStyle()}`}
							>
								<FiCalendar className={getNoEventsTextStyle()} size={24} />
							</div>
							<div className={getNoEventsTextStyle()}>
								رویدادی برای این روز ثبت نشده است
							</div>
						</motion.div>
					)}
				</motion.div>
			</motion.div>
		</div>
	)
}
