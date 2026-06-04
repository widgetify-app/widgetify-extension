import { useDate } from '@/context/date.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { combineAndSortEvents } from '@/layouts/widgets/tools/events/utils'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { useGetWeatherByLatLon } from '@/services/hooks/weather/getWeatherByLatLon'
import { useEffect, useState } from 'react'
import { TbMapPin, TbDroplet, TbWind } from 'react-icons/tb'
import { hijriMonthNames } from '../../calendar/utils'

interface Prop {
	banner: string | null
}

export function WigiPadMain({ banner }: Prop) {
	const { today, todayIsHoliday, getHijriDate } = useDate()
	const { selected_timezone: timezone } = useGeneralSetting()
	const { data: events } = useGetEvents()
	const { data: weather } = useGetWeatherByLatLon(false)

	const [time, setTime] = useState(
		new Date(new Date().toLocaleString('en-US', { timeZone: timezone.value }))
	)

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(
				new Date(new Date().toLocaleString('en-US', { timeZone: timezone.value }))
			)
		}, 1000)
		return () => clearInterval(timer)
	}, [timezone])

	const eventsForCalendar = events || {
		gregorianEvents: [],
		hijriEvents: [],
		shamsiEvents: [],
	}
	const sortedEvents = combineAndSortEvents(eventsForCalendar, today.clone(), [])
	const isHoliday = sortedEvents.some((e) => e.isHoliday) || todayIsHoliday

	const hours = time.getHours().toString().padStart(2, '0')
	const minutes = time.getMinutes().toString().padStart(2, '0')

	const jalaliYear = today.locale('fa').format('YYYY')
	const jalaliMonthYear = today.locale('fa').format('D MMMM')
	const jalaliWeekDay = today.locale('fa').format('dddd')
	const gregorianShort = today.doAsGregorian().format('D MMM')

	const hijriRaw = getHijriDate(today)
	const [_, hijriMonth, hijriDate] = hijriRaw.split('/')
	const hijriMonthName = hijriMonthNames[Number(hijriMonth) - 1] || hijriMonth

	const bannerUrl = banner || weather?.weather?.statusBanner
	const hasBanner = !!bannerUrl

	const temp = Math.round(weather?.weather?.temperature?.temp || 0)
	const humidity = weather?.weather?.temperature?.humidity
	const windSpeed = Math.round(weather?.weather?.temperature?.wind_speed || 0)
	const description = weather?.weather?.description?.text
	const iconUrl = weather?.weather?.icon?.url
	const cityName = weather?.city?.fa || weather?.city?.en

	return (
		<div
			className={`relative flex flex-col overflow-hidden rounded-2xl p-3 justify-between transition-colors duration-300 ${
				hasBanner
					? 'text-neutral-content'
					: 'bg-base-200 text-base-content border border-content'
			}`}
		>
			{hasBanner && (
				<>
					<div
						className="absolute inset-0 transition-transform duration-500 scale-105 bg-center bg-cover"
						style={{ backgroundImage: `url(${bannerUrl})` }}
					/>
					<div className="absolute inset-0 bg-neutral/40 backdrop-blur-[0.6px]" />
				</>
			)}

			<div className="relative z-10 flex flex-col justify-between h-full">
				<div className="flex items-start justify-between">
					<div className="flex flex-col gap-0.5  -mt-2 mb-2">
						<span
							className={`text-sm font-bold ${hasBanner ? 'text-white' : 'text-base-content'}`}
						>
							{jalaliWeekDay}
						</span>
						<span
							className={`text-sm ${hasBanner ? 'text-white/70' : 'text-base-content/70'}`}
						>
							{jalaliMonthYear} {jalaliYear}
						</span>
						<span
							className={`text-[10px] ${hasBanner ? 'text-white/70' : 'text-base-content/70'}`}
						>
							{gregorianShort} <span className="mx-0.5 opacity-50">·</span>
							{hijriDate} {hijriMonthName}
						</span>
					</div>

					<div className="flex flex-col items-end text-right">
						<span
							className={`text-4xl mt-2 font-black tracking-tighter tabular-nums leading-none ${
								isHoliday
									? 'text-error'
									: hasBanner
										? 'text-white'
										: 'text-primary'
							}`}
							dir="ltr"
						>
							{hours}:{minutes}
						</span>
					</div>
				</div>

				<div
					className={`border-t pt-3 flex items-center justify-between ${hasBanner ? 'border-white/10' : 'border-base-300'}`}
				>
					<div className="flex items-center gap-3">
						{iconUrl && (
							<img
								src={iconUrl}
								alt={description || 'weather'}
								className="object-contain w-12 h-12 drop-shadow-sm filter saturate-200"
							/>
						)}
						<div className="flex flex-col">
							<div className="flex items-baseline gap-1.5">
								<span className="text-3xl font-bold leading-none tracking-tight">
									{weather ? `${temp}°` : '–°'}
								</span>
								<span
									className={`text-xs font-medium ${hasBanner ? 'text-white/90' : 'text-base-content/90'}`}
								>
									{description || 'آب‌وهوا نامشخص'}
								</span>
							</div>

							{/* City & Details */}
							<div
								className={`flex items-center gap-2 text-[11px] mt-1 ${hasBanner ? 'text-white/70' : 'text-base-content/60'}`}
							>
								{cityName && (
									<span className="flex items-center gap-0.5 font-medium">
										<TbMapPin className="text-xs" />
										{cityName}
									</span>
								)}
								{weather && (
									<>
										{humidity !== undefined && (
											<span className="flex items-center gap-0.5">
												<TbDroplet className="text-xs" />
												{humidity}٪
											</span>
										)}
										{windSpeed > 0 && (
											<span className="flex items-center gap-0.5">
												<TbWind className="text-xs" />
												{windSpeed} m/s
											</span>
										)}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
