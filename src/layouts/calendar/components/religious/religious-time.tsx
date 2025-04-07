import { useTheme } from '@/context/theme.context'
import { useWeatherStore } from '@/context/weather.context'
import type { FetchedAllEvents } from '@/services/getMethodHooks/getEvents.hook'
import { useReligiousTime } from '@/services/getMethodHooks/getReligiousTime.hook'
import { getPersianCityName } from '@/utils/cityNameMap'
import { motion } from 'framer-motion'
import { FiSunrise, FiSun, FiMoon, FiClock, FiSunset, FiCalendar } from 'react-icons/fi'
import { type WidgetifyDate } from '../../utils'

interface Prop {
	events: FetchedAllEvents
	currentDate: WidgetifyDate
	isPreview?: boolean
	onDateChange?: (date: WidgetifyDate) => void
}

export function ReligiousTime({ currentDate }: Prop) {
	const { theme } = useTheme()
	const { selectedCity } = useWeatherStore()
	
	// Extract day and month from the currentDate
	const day = currentDate.jDate()
	const month = currentDate.jMonth() + 1 // jMonth is 0-based, so add 1
	
	// Get city name from weather context and convert to Persian if needed
	const englishCityName = selectedCity?.name || 'Tehran'
	const persianCityName = getPersianCityName(englishCityName)
	
	const { data: religiousTimeData, loading, error } = useReligiousTime(day, month, persianCityName)
	
	const getHeaderTextStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700'
			default:
				return 'text-gray-300'
		}
	}

	const getNoReligiousTimeIconBackgroundStyle = () => {
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

	const getBoxStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-white/80 shadow-sm border border-gray-200'
			case 'dark':
				return 'bg-neutral-800/80 shadow-sm border border-neutral-700'
			default: // glass
				return 'bg-neutral-900/50 shadow-sm border border-neutral-800'
		}
	}

	const getBoxTitleStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700'
			default:
				return 'text-gray-300'
		}
	}

	const getBoxValueStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-900'
			default:
				return 'text-white'
		}
	}

	const getBoxIconStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-blue-600'
			default:
				return 'text-blue-400'
		}
	}

	const prayerTimeBoxes = [
		{ title: 'طلوع آفتاب', value: religiousTimeData?.result?.tolu_aftab, icon: FiSunrise },
		{ title: 'اذان صبح', value: religiousTimeData?.result?.azan_sobh, icon: FiClock },
		{ title: 'ظهر', value: religiousTimeData?.result?.azan_zohr, icon: FiSun },
		{ title: 'غروب آفتاب', value: religiousTimeData?.result?.ghorub_aftab, icon: FiSunset },
		{ title: 'مغرب', value: religiousTimeData?.result?.azan_maghreb, icon: FiClock },
		{ title: 'نیمه شب', value: religiousTimeData?.result?.nimeshab, icon: FiMoon },
	]

	return (
		<div>
			<div className="flex items-center justify-between mb-3">
				<h4 className={`flex items-center text-lg font-medium ${getHeaderTextStyle()}`}>
					اوقات شرعی
					<span className={'text-sm flex item-end font-thin mr-2 mt-2'}>({persianCityName})</span>
				</h4>
			</div>

			{loading ? (
				<div className="flex justify-center items-center py-8">
					<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			) : error ? (
				<motion.div
					className="py-2 text-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
				>
					<div
						className={`inline-flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full ${getNoReligiousTimeIconBackgroundStyle()}`}
					>
						<FiSunrise className={getNoEventsTextStyle()} size={24} />
					</div>
					<div className={getNoEventsTextStyle()}>
						مشکلی در دریافت اطلاعات وجود دارد
					</div>
				</motion.div>
			) : (
				<>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
						{prayerTimeBoxes.map((box, index) => (
							<motion.div
								key={index}
								className={`${getBoxStyle()} rounded-lg p-3 flex flex-col items-center`}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<div className={`${getBoxIconStyle()} mb-2`}>
									<box.icon size={20} />
								</div>
								<div className={`${getBoxTitleStyle()} text-[0.6rem] mb-1`}>{box.title}</div>
								<div className={`${getBoxValueStyle()} font-medium`}>{box.value}</div>
							</motion.div>
						))}
					</div>
				</>
			)}
		</div>
	)
}
