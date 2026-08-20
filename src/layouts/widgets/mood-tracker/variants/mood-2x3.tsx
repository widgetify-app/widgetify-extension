import { useMemo } from 'react'
import type jalaliMoment from 'jalali-moment'
import { moodOptions } from '@/common/constant/moods'
import type { MoodEntry } from '@/services/hooks/mood-log/get-moods.hook'
import type { MoodType } from '@/services/hooks/mood-log/upsert-mood-log.hook'
import { toPersianDigits } from '@/common/utils/persian-digits'
import { cn } from '@/common/utils/cn'

interface Mood2x3Props {
	today: jalaliMoment.Moment
	todayMood?: MoodEntry
	moods: MoodEntry[]
	onSelectMood: (mood: MoodType) => void
	isSaving?: boolean
}

const DAY_LETTERS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

export function Mood2x3({
	today,
	todayMood,
	moods,
	onSelectMood,
	isSaving,
}: Mood2x3Props) {
	const currentOption = moodOptions.find((m) => m.value === todayMood?.mood)

	const pastDays = useMemo(() => {
		return Array.from({ length: 7 }, (_, i) => {
			const d = today.clone().subtract(6 - i, 'days')
			const gDateStr = d.clone().doAsGregorian().format('YYYY-MM-DD')
			const entry = moods.find((m) => m.date === gDateStr)
			const option = moodOptions.find((o) => o.value === entry?.mood)
			const dayIndex = (d.day() + 1) % 7
			const isToday = i === 6

			return {
				moment: d,
				dayLetter: DAY_LETTERS[dayIndex] || '',
				dayNumber: toPersianDigits(d.jDate()),
				emoji: option ? option.emoji : '·',
				isToday,
				hasMood: Boolean(option),
			}
		})
	}, [today, moods])

	const motivationalMessage = useMemo(() => {
		switch (todayMood?.mood) {
			case 'excited':
				return 'انرژی و حال خوبت عالیه! امروز روز توئه 🌟'
			case 'happy':
				return 'خوشحالم که اوکی و آرومی، روز خوبی داشته باشی ✨'
			case 'normal':
				return 'یکم به خودت استراحت بده و یه فنجون چای بنوش ☕'
			case 'sad':
				return 'روزهای ابری هم می‌گذرن، مراقب خودت باش 💛'
			default:
				return 'حست در طول روز رو ثبت کن تا الگوی احساست رو بشناسی 🌱'
		}
	}, [todayMood?.mood])

	return (
		<div className="w-full h-full flex flex-col justify-between p-3 select-none overflow-hidden text-right">
			{/* Top Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<span className="text-base">🥰</span>
					<span className="text-xs font-bold text-content leading-none">
						حال و هوای روزانه
					</span>
				</div>
			</div>

			{/* Today's Mood Selector */}
			<div className="flex flex-col gap-1.5">
				<span className="text-[11px] font-bold text-muted leading-none">
					امروز چه حسی داری؟
				</span>
				<div className="grid grid-cols-4 gap-1.5 w-full">
					{moodOptions.map((opt) => {
						const isSelected = todayMood?.mood === opt.value

						return (
							<button
								key={opt.value}
								type="button"
								disabled={isSaving}
								onClick={() => onSelectMood(opt.value as MoodType)}
								className={cn(
									'flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer border',
									isSelected
										? 'bg-primary/15 border-primary shadow-xs font-black'
										: 'bg-base-200/50 hover:bg-base-200 border-transparent'
								)}
							>
								<span className="text-2xl leading-none transition-transform hover:scale-110">
									{opt.emoji}
								</span>
								<span
									className={cn(
										'text-[10px] mt-1.5 truncate leading-none',
										isSelected
											? 'font-bold text-primary'
											: 'text-muted'
									)}
								>
									{opt.label}
								</span>
							</button>
						)
					})}
				</div>
			</div>

			{/* Past 7 Days Strip */}
			<div className="flex flex-col gap-1.5 pt-2 border-t border-base-content/10">
				<span className="text-[10px] font-bold text-muted leading-none">
					روند ۷ روز گذشته:
				</span>
				<div className="grid grid-cols-7 gap-1 w-full text-center">
					{pastDays.map((d, idx) => (
						<div
							key={idx}
							className={cn(
								'flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors',
								d.isToday
									? 'bg-primary/15 border border-primary/40 font-bold'
									: 'bg-base-200/50'
							)}
						>
							<span className="text-[9px] text-muted leading-none">
								{d.dayLetter}
							</span>
							<span className="text-xs mt-1 leading-none">
								{d.hasMood ? d.emoji : '·'}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Message Footer Card */}
			<div className="mt-1 p-1.5 rounded-xl bg-base-200/40 text-[10px] text-muted text-center font-medium leading-tight">
				{motivationalMessage}
			</div>
		</div>
	)
}
