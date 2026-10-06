import { moodOptions } from '@/common/constants/moods'
import { cn } from '@/common/utils/cn'
import { MoodImage } from '@/components/mood-image'
import { WidgetMenuButton } from '@/features/widgets/components/widget-menu-button'
import type { MoodEntry } from '@/services/mood-log/get-moods.hook'
import type { MoodType } from '@/services/mood-log/upsert-mood-log.hook'
import { SELECTED_MOOD_CLASS } from '../constants'

interface Mood2x1Props {
	todayMood?: MoodEntry
	onSelectMood: (mood: MoodType) => void
	isSaving?: boolean
}

export function Mood2x1({ todayMood, onSelectMood, isSaving }: Mood2x1Props) {
	return (
		<section
			aria-label="حال روزانه"
			className="flex flex-col w-full h-full min-h-0 gap-1.5 select-none"
		>
			<header className="flex items-center flex-none h-5 min-w-0 gap-2">
				<h3 className="text-xs font-bold truncate text-fg-strong">
					{todayMood ? 'حال امروز' : 'امروز چه حسی داری؟'}
				</h3>
				{todayMood && (
					<span className="font-medium text-3xs text-fg-faint">ثبت شد</span>
				)}
				<span className="ms-auto widget-control">
					<WidgetMenuButton placement="compact" />
				</span>
			</header>

			<div className="grid flex-1 min-h-0 grid-cols-4 gap-1.5">
				{moodOptions.map((opt) => {
					const isSelected = todayMood?.mood === opt.value

					return (
						<button
							key={opt.value}
							type="button"
							disabled={isSaving}
							aria-pressed={isSelected}
							onClick={() => onSelectMood(opt.value as MoodType)}
							className={cn(
								'flex flex-col items-center justify-center min-h-0 gap-0.5 overflow-hidden rounded-xl text-[10cqh] cursor-pointer transition-ui',
								'disabled:cursor-not-allowed disabled:opacity-60 focus-visible:focus-ring',
								isSelected
									? cn(
											'font-bold ring-[1.5px] ring-inset',
											SELECTED_MOOD_CLASS[opt.value]
										)
									: 'font-semibold bg-fill text-fg-muted hover:bg-fill-2'
							)}
						>
							<MoodImage mood={opt.value} className="size-[24cqh]" />
							<span className="max-w-full truncate">{opt.label}</span>
						</button>
					)
				})}
			</div>
		</section>
	)
}
