import { useTheme } from '@/context/theme.context'
import { useWeatherStore } from '@/context/weather.context'
import type { FetchedAllEvents } from '@/services/getMethodHooks/getEvents.hook'
import { useReligiousTime } from '@/services/getMethodHooks/getReligiousTime.hook'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { FiClock, FiMoon, FiSun, FiSunrise, FiSunset } from 'react-icons/fi'
import type { WidgetifyDate } from '../../utils'

interface Prop {
	events: FetchedAllEvents
	currentDate: WidgetifyDate
	isPreview?: boolean
	onDateChange?: (date: WidgetifyDate) => void
}

export function ReligiousTime({ currentDate }: Prop) {
	const { theme } = useTheme()
	const { selectedCity } = useWeatherStore()

	const day = currentDate.jDate()
	const month = currentDate.jMonth() + 1 // jMonth is 0-based, so add 1

	const englishCityName = selectedCity?.name || 'Tehran'
	const lat = selectedCity?.lat || 35.6892523
	const long = selectedCity?.lon || 51.3896004

	const {
		data: religiousTimeData,
		loading,
		error,
	} = useReligiousTime(day, month, lat, long)

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
				return 'bg-black/20 shadow-sm border border-[#1a1a1a38]'
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
		{
			title: 'طلوع آفتاب',
			value: religiousTimeData?.tolu_aftab,
			icon: FiSunrise,
		},
		{ title: 'اذان صبح', value: religiousTimeData?.azan_sobh, icon: FiClock },
		{ title: 'اذان ظهر', value: religiousTimeData?.azan_zohr, icon: FiSun },
		{
			title: 'غروب آفتاب',
			value: religiousTimeData?.ghorub_aftab,
			icon: FiSunset,
		},
		{ title: 'اذان مغرب', value: religiousTimeData?.azan_maghreb, icon: FiClock },
		{ title: 'نیمه شب', value: religiousTimeData?.nimeshab, icon: FiMoon },
	]

	return (
		<div>
			<div className="flex items-center justify-between mb-3">
				<h4 className={`flex items-center text-lg font-medium ${getHeaderTextStyle()}`}>
					اوقات شرعی
					<span className={'text-sm flex item-end font-light mr-2 mt-2'}>
						({englishCityName})
					</span>
				</h4>
			</div>

			<LazyMotion features={domAnimation}>
				{loading ? (
					<div className="flex items-center justify-center py-8">
						<div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
					</div>
				) : error ? (
					<m.div
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
					</m.div>
				) : (
					<>
						<div className="grid grid-cols-2 gap-3 mb-4 md:grid-cols-3">
							{prayerTimeBoxes.map((box, index) => (
								<m.div
									key={index}
									className={`${getBoxStyle()} rounded-lg p-3 flex flex-col items-center`}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
								>
									<div className={`${getBoxIconStyle()} mb-2`}>
										<box.icon size={20} />
									</div>
									<div className={`${getBoxTitleStyle()} text-[0.6rem] mb-1`}>
										{box.title}
									</div>
									<div className={`${getBoxValueStyle()} font-medium`}>{box.value}</div>
								</m.div>
							))}
						</div>
					</>
				)}
			</LazyMotion>
		</div>
	)
}
