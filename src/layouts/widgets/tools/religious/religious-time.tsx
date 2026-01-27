import { useEffect } from 'react'
import { FiClock, FiMoon, FiSun, FiSunrise, FiSunset } from 'react-icons/fi'
import { useReligiousTime } from '@/services/hooks/date/getReligiousTime.hook'
import { useAuth } from '@/context/auth.context'
import { Button } from '@/components/button/button'
import { callEvent } from '@/common/utils/call-event'
import Analytics from '@/analytics'

const DAILY_ZIKRS = [
	{ day: 'شنبه', zikr: 'یا رَبَّ الْعَالَمِینَ', meaning: 'ای پروردگار جهانیان' },
	{
		day: 'یک‌شنبه',
		zikr: 'یا ذَالْجَلَالِ وَالْإِکْرَامِ',
		meaning: 'ای صاحب جلال و بزرگواری',
	},
	{ day: 'دوشنبه', zikr: 'یا قاضی الحاجات', meaning: 'ای برآورنده حاجات' },
	{ day: 'سه‌شنبه', zikr: 'یا أَرْحَمَ الرَّاحِمِینَ', meaning: 'ای مهربان‌ترین مهربانان' },
	{ day: 'چهارشنبه', zikr: 'یا حَیُّ یا قَیُّومُ', meaning: 'ای زنده پاینده' },
	{
		day: 'پنج‌شنبه',
		zikr: 'لا إِلَهَ إِلَّا اللَّهُ الْمَلِکُ الْحَقُّ الْمُبِینُ',
		meaning: 'نیست معبودی جز خدای یکتا',
	},
	{
		day: 'جمعه',
		zikr: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَ آلِ مُحَمَّدٍ',
		meaning: 'خدایا بر محمد و آل محمد درود فرست',
	},
]

export function ReligiousTime({ currentDate }: { currentDate: any }) {
	const { isAuthenticated, user } = useAuth()
	const day = currentDate.jDate()
	const month = currentDate.jMonth() + 1
	const weekDay = currentDate.format('dddd')

	const {
		data: religiousTimeData,
		isLoading: loading,
		refetch,
	} = useReligiousTime(
		{
			day,
			month,
			lat: user?.city?.id ? undefined : 35.696111,
			lon: user?.city?.id ? undefined : 51.423056,
		},
		true
	)

	useEffect(() => {
		if (isAuthenticated && user?.city?.id) {
			refetch()
		}
	}, [user?.city?.id, isAuthenticated, refetch])

	const dailyZikr = DAILY_ZIKRS.find((item) => item.day === weekDay)

	const prayerTimeBoxes = [
		{ title: 'اذان صبح', value: religiousTimeData?.azan_sobh, icon: FiClock },
		{ title: 'طلوع', value: religiousTimeData?.tolu_aftab, icon: FiSunrise },
		{ title: 'اذان ظهر', value: religiousTimeData?.azan_zohr, icon: FiSun },
		{ title: 'غروب', value: religiousTimeData?.ghorub_aftab, icon: FiSunset },
		{ title: 'اذان مغرب', value: religiousTimeData?.azan_maghreb, icon: FiClock },
		{ title: 'نیمه شب', value: religiousTimeData?.nimeshab, icon: FiMoon },
	]

	return (
		<div className="flex flex-col w-full gap-3 p-1 overflow-hidden select-none">
			{loading ? (
				<div className="grid grid-cols-3 gap-2">
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className="h-20 bg-base-200/50 rounded-[1.5rem] animate-pulse"
						/>
					))}
				</div>
			) : (
				<>
					<div className="grid grid-cols-3 gap-2">
						{prayerTimeBoxes.map((box, index) => (
							<div
								key={index}
								className="flex flex-col items-center justify-center p-3 border rounded-2xl bg-content border-content"
							>
								<div className="mb-1 text-primary/70">
									<box.icon size={18} />
								</div>
								<span className="text-[8px] font-black opacity-60 mb-0.5 whitespace-nowrap uppercase">
									{box.title}
								</span>
								<span className="text-[12px] font-black text-content">
									{box.value}
								</span>
							</div>
						))}
					</div>

					{dailyZikr && (
						<div className="flex flex-col items-center gap-1 p-2 border bg-content border-content rounded-2xl">
							<div className="flex items-center gap-1.5 mb-0.5">
								<div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
								<span className="text-[9px] font-black text-primary-content">
									ذکر روز {weekDay}
								</span>
							</div>
							<div className="text-[14px] font-black text-content text-center leading-tight">
								{dailyZikr.zikr}
							</div>
							<div className="text-[10px] font-bold text-muted text-center truncate w-full px-2">
								{dailyZikr.meaning}
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}
