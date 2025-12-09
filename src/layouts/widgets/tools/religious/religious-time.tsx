import { FiClock, FiMoon, FiSun, FiSunrise, FiSunset } from 'react-icons/fi'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useReligiousTime } from '@/services/hooks/date/getReligiousTime.hook'
import type { WidgetifyDate } from '../../calendar/utils'
import { DailyZikrBox } from './components/daily-zikr-box'
import { PrayerTimeBox } from './components/prayer-time-box'
import { useAuth } from '@/context/auth.context'
import { RequireAuth } from '@/components/auth/require-auth'
import { Button } from '@/components/button/button'
import { callEvent } from '@/common/utils/call-event'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import Analytics from '@/analytics'

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
	const { isAuthenticated, user } = useAuth()
	const day = currentDate.jDate()
	const month = currentDate.jMonth() + 1
	3
	const weekDay = currentDate.format('dddd')

	const {
		data: religiousTimeData,
		loading,
		error,
	} = useReligiousTime(day, month, isAuthenticated && user?.city?.id != null)

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

	const onClickSetCity = () => {
		callEvent('openSettings', 'general')
		Analytics.event('religious_time_set_city_clicked')
	}

	return (
		<div>
			<RequireAuth>
				{!user?.city?.id ? (
					<div className="flex flex-col items-center justify-center w-full h-full p-4 text-center rounded-2xl">
						<div className="mb-4 text-4xl">🕋</div>
						<p className="mb-4 text-sm leading-relaxed text-muted">
							برای نمایش اوقات شرعی، لطفاً ابتدا در تنظیمات ویجت، شهر خود را
							تنظیم کنید.
						</p>
						<Button
							size="md"
							isPrimary={true}
							className="px-6 py-2 font-medium text-white transition-colors rounded-2xl"
							onClick={onClickSetCity}
						>
							تنظیم شهر
						</Button>
					</div>
				) : loading ? (
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
				) : error ? (
					<div
						className={
							'flex-1 flex flex-col items-center justify-center gap-y-1.5 px-5 py-16'
						}
					>
						<div
							className={
								'flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300/70 border-base/70'
							}
						>
							<FiSunrise className="text-content" size={24} />
						</div>
						<p className="mt-1 text-center text-content">
							مشکلی در دریافت اطلاعات وجود دارد
						</p>
					</div>
				) : (
					<>
						<div className="grid grid-cols-3 gap-[.4rem] mb-1">
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
			</RequireAuth>
		</div>
	)
}
