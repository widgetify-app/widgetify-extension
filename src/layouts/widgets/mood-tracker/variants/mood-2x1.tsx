import { moodOptions } from '@/common/constant/moods'
import type { MoodEntry } from '@/services/hooks/mood-log/get-moods.hook'
import type { MoodType } from '@/services/hooks/mood-log/upsert-mood-log.hook'
import { cn } from '@/common/utils/cn'

interface Mood2x1Props {
	todayMood?: MoodEntry
	onSelectMood: (mood: MoodType) => void
	isSaving?: boolean
}

export function Mood2x1({ todayMood, onSelectMood, isSaving }: Mood2x1Props) {
	return (
		<div className="w-full h-full flex flex-col justify-between p-2.5 select-none overflow-hidden text-right">
			<div className="flex items-center justify-between px-0.5">
				<span className="text-[11px] font-bold text-content leading-none">
					امروز چه حسی داری؟
				</span>
			</div>

			<div className="grid grid-cols-4 gap-1.5 w-full my-3">
				{moodOptions.map((opt) => {
					const isSelected = todayMood?.mood === opt.value

					return (
						<button
							key={opt.value}
							type="button"
							disabled={isSaving}
							onClick={() => onSelectMood(opt.value as MoodType)}
							className={cn(
								'flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer border',
								isSelected
									? 'bg-primary/15 border-primary shadow-xs font-black'
									: 'bg-base-200/50 hover:bg-base-200 border-transparent'
							)}
						>
							<span className="text-xl leading-none transition-transform hover:scale-110">
								{opt.emoji}
							</span>
							<span
								className={cn(
									'text-[9px] mt-1 truncate leading-none',
									isSelected ? 'font-bold text-primary' : 'text-muted'
								)}
							>
								{opt.label}
							</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}
