import { moodOptions } from '@/common/constants/moods'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { MoodImage } from '@/components/mood-image'
import type { MoodEntry } from '@/services/mood-log/get-moods.hook'
import type { MoodType } from '@/services/mood-log/upsert-mood-log.hook'

interface Mood1x1Props {
	todayMood?: MoodEntry
	onSelectMood: (mood: MoodType) => void
	isSaving?: boolean
}

export function Mood1x1({ todayMood, onSelectMood, isSaving }: Mood1x1Props) {
	const currentOption = moodOptions.find((m) => m.value === todayMood?.mood)

	return (
		<section
			aria-label={t('widgets.moodTracker.aria')}
			className="flex flex-col items-center justify-between w-full h-full text-center select-none"
		>
			<span
				className={cn(
					'text-[11cqh] font-bold truncate leading-none',
					currentOption ? 'text-brand' : 'text-fg-muted'
				)}
			>
				{currentOption
					? t(currentOption.labelKey)
					: t('widgets.moodTracker.askShort')}
			</span>

			<MoodImage
				mood={currentOption?.value}
				className={currentOption ? 'size-[35cqh]' : 'size-[31cqh] opacity-80'}
			/>

			<div className="flex items-center justify-center gap-1 p-[3cqh] rounded-full bg-fill">
				{moodOptions.map((opt) => {
					const isSelected = todayMood?.mood === opt.value

					return (
						<button
							key={opt.value}
							type="button"
							disabled={isSaving}
							aria-pressed={isSelected}
							aria-label={t(opt.labelKey)}
							onClick={() => onSelectMood(opt.value as MoodType)}
							className={cn(
								'grid place-items-center size-[23cqh] rounded-full cursor-pointer transition-ui',
								'disabled:cursor-not-allowed disabled:opacity-60 focus-visible:focus-ring',
								isSelected ? 'bg-brand' : 'hover:bg-fill-2'
							)}
						>
							<MoodImage
								mood={opt.value}
								className={cn(
									'size-[16cqh]',
									!isSelected && 'opacity-75'
								)}
							/>
						</button>
					)
				})}
			</div>
		</section>
	)
}
