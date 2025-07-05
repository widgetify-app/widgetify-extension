import { useWeatherStore } from '@/context/weather.context'
import { useReligiousTime } from '@/services/hooks/date/getReligiousTime.hook'
import { FiClock, FiMoon, FiSun, FiSunrise, FiSunset } from 'react-icons/fi'
import type { WidgetifyDate } from '../../calendar/utils'
import { DailyZikrBox } from './components/daily-zikr-box'
import { PrayerTimeBox } from './components/prayer-time-box'

interface Prop {
	currentDate: WidgetifyDate
	isPreview?: boolean
}

const DAILY_ZIKRS = [
	{ day: 'شنبه', zikr: 'یا رَبَّ الْعَالَمِینَ', meaning: 'ای پروردگار جهانیان' },
	{ day: 'یک‌شنبه', zikr: 'یا ذَالْجَلَالِ وَالْإِکْرَامِ', meaning: 'ای صاحب جلال و بزرگواری' },
	{ day: 'دوشنبه', zikr: 'یا قاضی الحاجات', meaning: 'ای برآورنده حاجات' },
	{ day: 'سه‌شنبه', zikr: 'یا أَرْحَمَ الرَّاحِمِینَ', meaning: 'ای مهربان‌ترین مهربانان' },
	{ day: 'چهارشنبه', zikr: 'یا حَیُّ یا قَیُّومُ', meaning: 'ای زنده پاینده' },
	{
		day: 'پنج‌شنبه',
		zikr: 'لا إِلَهَ إِلَّا اللَّهُ الْمَلِکُ الْحَقُّ الْمُبِینُ',
		meaning: 'نیست معبودی جز خدای یکتا که پادشاه حق آشکار است',
	},
	{
		day: 'جمعه',
		zikr: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَ آلِ مُحَمَّدٍ',
		meaning: 'خدایا بر محمد و آل محمد درود فرست',
	},
]

export function ReligiousTime({ currentDate }: Prop) {
	const { selectedCity } = useWeatherStore()

	const day = currentDate.jDate()
	const month = currentDate.jMonth() + 1

	const weekDay = currentDate.format('dddd')

	const englishCityName = selectedCity?.name || 'Tehran'
	const lat = selectedCity?.lat || 35.6892523
	const long = selectedCity?.lon || 51.3896004

	const {
		data: religiousTimeData,
		loading,
		error,
	} = useReligiousTime(day, month, lat, long)

	const dailyZikr = DAILY_ZIKRS.find((item) => item.day === weekDay)
	const getBoxIconStyle = () => {
		return 'text-primary'
	}

	const prayerTimeBoxes = [
		{ title: 'اذان صبح', value: religiousTimeData?.azan_sobh, icon: FiClock },
		{
			title: 'طلوع آفتاب',
			value: religiousTimeData?.tolu_aftab,
			icon: FiSunrise,
		},
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
			{loading ? (
				<>
					<div className="grid grid-cols-2 gap-1.5 mb-1 md:grid-cols-3">
						{prayerTimeBoxes.map((box, index) => (
							<PrayerTimeBox
								key={index}
								title={box.title}
								icon={box.icon}
								index={index}
								iconColorStyle={getBoxIconStyle()}
								isLoading={true}
							/>
						))}
					</div>
				</>
			) : error ? (
				<div className="py-20 text-center transition-opacity duration-300">
					<div
						className={
							'inline-flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-content'
						}
					>
						<FiSunrise className="text-content" size={24} />
					</div>
					<div className={'text-content'}>
						مشکلی در دریافت اطلاعات وجود دارد
					</div>
				</div>
			) : (
				<>
					<div className="grid grid-cols-2 gap-[.4rem] mb-1 md:grid-cols-3">
						{prayerTimeBoxes.map((box, index) => (
							<PrayerTimeBox
								key={index}
								title={box.title}
								value={box.value}
								icon={box.icon}
								index={index}
								iconColorStyle={getBoxIconStyle()}
							/>
						))}
					</div>{' '}
					{loading ? (
						<DailyZikrBox isLoading={true} />
					) : (
						dailyZikr && (
							<DailyZikrBox
								zikr={dailyZikr.zikr}
								meaning={dailyZikr.meaning}
							/>
						)
					)}
				</>
			)}
		</div>
	)
}
