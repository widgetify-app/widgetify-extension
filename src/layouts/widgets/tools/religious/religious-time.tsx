import { useEffect } from 'react'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/icons'
import type { IconName } from '@/icons/types'
import type { WidgetifyDate } from '@widget/calendar/utils/date-events'
import { useReligiousTime } from '@/services/hooks/date/get-religious-time.hook'

const DAILY_LIST = [
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

interface ReligiousTimeProps {
	currentDate: WidgetifyDate
}

export function ReligiousTime({ currentDate }: ReligiousTimeProps) {
	const { isAuthenticated, user } = useAuth()
	const day = currentDate.jDate()
	const month = currentDate.jMonth() + 1
	const weekDay = currentDate.format('dddd')

	const {
		data: religiousTimeData,
		isLoading: loading,
		isError,
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

	const dailyZikr = DAILY_LIST.find((item) => item.day === weekDay)

	const prayerTimeBoxes: { title: string; value?: string; icon: IconName }[] = [
		{ title: 'اذان صبح', value: religiousTimeData?.azan_sobh, icon: 'clock' },
		{ title: 'طلوع', value: religiousTimeData?.tolu_aftab, icon: 'sunrise' },
		{ title: 'اذان ظهر', value: religiousTimeData?.azan_zohr, icon: 'sun' },
		{ title: 'غروب', value: religiousTimeData?.ghorub_aftab, icon: 'sunset' },
		{ title: 'اذان مغرب', value: religiousTimeData?.azan_maghreb, icon: 'clock' },
		{ title: 'نیمه شب', value: religiousTimeData?.nimeshab, icon: 'moon' },
	]

	return (
		<div className="flex flex-col w-full gap-3 p-1 overflow-hidden select-none">
			{loading ? (
				<div aria-hidden="true" className="grid grid-cols-3 gap-2">
					{prayerTimeBoxes.map((box) => (
						<div key={box.title} className="h-20 skeleton rounded-[1.5rem]" />
					))}
				</div>
			) : isError ? (
				<div className="flex flex-col items-center justify-center h-32 gap-2 text-center select-none">
					<Icon
						name="alert"
						size={16}
						className="text-muted"
						aria-hidden="true"
					/>
					<p className="text-[11px] leading-tight text-muted">
						اوقات شرعی دریافت نشد
					</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer text-content bg-hovered transition-ui hover:bg-strong focus-visible:focus-ring"
					>
						تلاش دوباره
					</button>
				</div>
			) : (
				<>
					<div className="grid grid-cols-3 gap-2">
						{prayerTimeBoxes.map((box) => (
							<div
								key={box.title}
								className="flex flex-col items-center justify-center p-3 border rounded-2xl bg-content border-content"
							>
								<div className="mb-1 text-brand-bold">
									<Icon name={box.icon} size={18} aria-hidden="true" />
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
								<div className="w-1.5 h-1.5 rounded-full bg-brand-muted" />
								<span className="text-[9px] font-black text-content">
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
