import { useDate } from '@/context/date.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { combineAndSortEvents } from '@/layouts/widgets/tools/events/utils'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { useGetWeatherByLatLon } from '@/services/hooks/weather/getWeatherByLatLon'
import { useEffect, useState } from 'react'
import { TbWind } from 'react-icons/tb'
import { WiHumidity } from 'react-icons/wi'
import { HolidayBadge } from '../date-display/components/holiday.badge'
const hijriMonthNames = [
	'محرم',
	'صفر',
	'ربیع‌الأول',
	'ربیع‌الثانی',
	'جمادی‌الأول',
	'جمادی‌الثانی',
	'رجب',
	'شعبان',
	'رمضان',
	'شوال',
	'ذی‌القعده',
	'ذی‌الحجه',
]

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
	const isHoliday = sortedEvents.some((event) => event.isHoliday) || todayIsHoliday

	const hours = time.getHours().toString().padStart(2, '0')
	const minutes = time.getMinutes().toString().padStart(2, '0')

	// Jalali
	const jalaliDay = today.jDate()
	const jalaliMonthYear = today.locale('fa').format('MMMM YYYY')
	const jalaliWeekDay = today.locale('fa').format('dddd')

	// Gregorian
	const gregorianFormatted = today.locale('en').format('D MMM YYYY')

	// Hijri
	const hijriRaw = getHijriDate(today) // "iYear/iMonth+1/iDate"
	const [hijriYear, hijriMonth, hijriDate] = hijriRaw.split('/')

	const hijriMonthName = hijriMonthNames[Number(hijriMonth) - 1] || hijriMonth

	const hasBanner = !!banner || !!weather?.weather?.statusBanner

	const textBase = hasBanner ? 'text-white drop-shadow-sm' : 'text-base-content'
	const textMuted = hasBanner ? 'text-white/65' : 'text-base-content/60'
	const textSub = hasBanner ? 'text-white/80' : 'text-base-content/60'
	const dividerCls = hasBanner ? 'bg-white/15' : 'bg-base-content/2'
	const bannerUrl = banner || weather?.weather.statusBanner
	return (
		<div className="relative flex flex-col overflow-hidden rounded-xl">
			{/* Weather banner background */}
			{hasBanner && (
				<>
					<div
						className="absolute inset-0 transition-transform duration-700 bg-center bg-cover"
						style={{
							backgroundImage: `url(${bannerUrl})`,
						}}
					/>
					<div
						className="absolute inset-0"
						style={{
							background:
								'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 55%, rgba(0,0,0,0.08) 100%)',
							backdropFilter: 'blur(0.8px)',
							WebkitBackdropFilter: 'blur(0.7px)',
						}}
					/>
				</>
			)}

			{!hasBanner && <div className="absolute inset-0 bg-base-200/50 rounded-xl" />}

			<div className={`relative z-10 flex items-stretch ${textBase}`}>
				{/* ─── Left: Jalali date (primary) ─── */}
				<div className="flex flex-col items-center justify-center flex-1 gap-1 py-2.5  text-center">
					{isHoliday && (
						<div className="mb-0.5">
							<HolidayBadge />
						</div>
					)}

					<span className={`text-[10px] leading-none font-medium ${textMuted}`}>
						{jalaliWeekDay}
					</span>

					<span
						className={`text-5xl font-black leading-none drop-shadow-sm ${
							isHoliday ? 'text-error' : textBase
						}`}
					>
						{jalaliDay}
					</span>

					<span className={`text-xs leading-none font-semibold ${textBase}`}>
						{jalaliMonthYear}
					</span>
					{/* <div className={`w-full h-px ${dividerCls}`} /> */}
					{/* Gregorian & Hijri */}
					<div
						className={`flex flex-col items-center gap-1 mt-1 w-full   pt-1.5  `}
					>
						<span
							className={`text-[9px] leading-none font-mono ${textMuted}`}
							dir="ltr"
						>
							{gregorianFormatted}
						</span>
						<span className={`text-[9px] leading-none ${textMuted}`}>
							{hijriDate} {hijriMonthName} {hijriYear}
						</span>
					</div>
				</div>

				{/* ─── Vertical divider ─── */}
				<div className={`w-px self-stretch my-2 ${dividerCls}`} />

				{/* ─── Right: Clock + Weather (or Clock alone) ─── */}
				<div className="flex flex-col items-center justify-between flex-1 py-2.5 px-2 gap-1.5">
					{/* Clock */}
					<div className="flex flex-col items-center gap-0.5">
						<span
							className={`text-4xl font-black leading-none tracking-tighter drop-shadow-sm tabular-nums ${textBase}`}
							dir="ltr"
						>
							{hours}:{minutes}
						</span>
						<span
							className={`text-[9px] font-medium uppercase tracking-widest ${textMuted}`}
						>
							{getTimeZoneLabel(timezone.label)}
						</span>
					</div>

					{/* Divider */}
					{/* <div className={`w-full h-px ${dividerCls}`} /> */}

					{/* Weather — or placeholder when unavailable */}
					{weather ? (
						<div className="flex flex-col items-center w-full gap-1">
							<div className="flex items-center justify-between w-full px-0.5">
								<div className="flex flex-col gap-0.5">
									{/* <span
										className={`text-[9px] leading-none ${textMuted}`}
									>
										{weather.city?.fa}
									</span> */}
									<div className="flex items-baseline gap-0.5">
										<span
											className={`text-2xl font-black leading-none drop-shadow-sm ${textBase}`}
										>
											{Math.round(
												weather.weather?.temperature?.temp || 0
											)}
										</span>
										<span
											className={`text-[10px] font-bold ${textMuted}`}
										>
											°C
										</span>
									</div>
								</div>
								{weather.weather?.icon?.url && (
									<img
										src={weather.weather.icon.url}
										className="w-9 h-9 drop-shadow-xl"
										alt="weather"
									/>
								)}
							</div>

							<div className="flex items-center justify-between w-full px-0.5 gap-1">
								{/* <div className="flex items-center gap-0.5">
									<TbWind size={10} className={textMuted} />
									<span
										className={`text-[9px] font-semibold ${textSub}`}
									>
										{Math.round(
											weather.weather?.temperature?.wind_speed || 0
										)}
										<small
											className={`font-normal ml-0.5 ${textMuted}`}
										>
											m/s
										</small>
									</span>
								</div> */}
								<div className="flex items-center gap-0.5">
									<WiHumidity size={12} className={textMuted} />
									<span
										className={`text-[9px] font-semibold ${textSub}`}
									>
										{weather.weather?.temperature?.humidity}%
									</span>
								</div>
								{weather.weather?.description?.text && (
									<span
										className={`text-[8px] truncate max-w-[3.5rem] text-right ${textMuted}`}
									>
										{weather.weather.description.text}
									</span>
								)}
							</div>
						</div>
					) : (
						// No weather data → show date summary so space isn't wasted
						<div className="flex flex-col items-center w-full gap-1">
							{/* <span className={`text-[9px] font-medium ${textMuted}`}>
								آب‌وهوا در دسترس نیست
							</span>
							<div
								className={`flex flex-col items-center gap-0.5 text-center`}
							>
								<span
									className={`text-[10px] font-semibold ${textSub}`}
									dir="ltr"
								>
									{gregorianFormatted}
								</span>
								<span className={`text-[9px] ${textMuted}`}>
									{hijriDate} {hijriMonthName}
								</span>
							</div> */}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

function getTimeZoneLabel(timezone: string): string {
	if (timezone.length <= 3) return timezone
	if (timezone.split('/')[1]) {
		return timezone.split('/')[1].replace('_', ' ')
	}
	return timezone
}
