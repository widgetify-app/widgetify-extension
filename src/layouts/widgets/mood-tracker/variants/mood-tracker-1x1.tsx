import { moodOptions } from '@/common/constants/moods'
import type { MoodEntry } from '@/services/hooks/mood-log/get-moods.hook'
import type { MoodType } from '@/services/hooks/mood-log/upsert-mood-log.hook'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'

interface Mood1x1Props {
	todayMood?: MoodEntry
	onSelectMood: (mood: MoodType) => void
	isSaving?: boolean
	onOpenMenu?: (e: React.MouseEvent) => void
	menuTriggerRef?: React.RefObject<HTMLButtonElement | null>
}

export function Mood1x1({
	todayMood,
	onSelectMood,
	isSaving,
	onOpenMenu,
	menuTriggerRef,
}: Mood1x1Props) {
	const currentOption = moodOptions.find((m) => m.value === todayMood?.mood)

	return (
		<div className="relative flex flex-col items-center justify-between w-full h-full p-2 overflow-hidden text-center select-none group">
			<div className="flex items-center justify-between w-full px-1">
				<span
					className={cn(
						'px-2 py-0.5 rounded-full text-[10px] font-bold leading-none transition-colors truncate',
						currentOption ? 'text-primary' : 'bg-base-200/90 text-muted'
					)}
				>
					{currentOption ? currentOption.label : 'حس امروزت؟'}
				</span>

				{onOpenMenu && (
					<button
						ref={menuTriggerRef}
						type="button"
						onClick={onOpenMenu}
						className="p-1 leading-none transition-all rounded-lg opacity-0 cursor-pointer text-base-content/40 hover:text-base-content hover:bg-base-200 group-hover:opacity-100"
					>
						<Icon name="menuOption" size={12} />
					</button>
				)}
			</div>

			<div className="flex items-center justify-center my-auto">
				<span className="text-3xl leading-none transition-transform duration-200 hover:scale-110 active:scale-95">
					{currentOption ? currentOption.emoji : '🤍'}
				</span>
			</div>

			<div className="w-full flex items-center justify-center gap-1.5 p-1 rounded-full bg-base-200/70">
				{moodOptions.map((opt) => {
					const isSelected = todayMood?.mood === opt.value

					return (
						<button
							key={opt.value}
							type="button"
							title={opt.label}
							disabled={isSaving}
							onClick={(e) => {
								e.stopPropagation()
								onSelectMood(opt.value as MoodType)
							}}
							className={cn(
								'w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer leading-none',
								isSelected
									? 'bg-primary text-white scale-110 shadow-xs'
									: 'hover:bg-base-300 hover:scale-105 opacity-70 hover:opacity-100'
							)}
						>
							<span>{opt.emoji}</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}
