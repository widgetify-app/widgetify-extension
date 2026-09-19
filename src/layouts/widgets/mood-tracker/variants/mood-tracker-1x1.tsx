import type React from 'react'
import { moodOptions } from '@/common/constants/moods'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import type { MoodEntry } from '@/services/hooks/mood-log/get-moods.hook'
import type { MoodType } from '@/services/hooks/mood-log/upsert-mood-log.hook'

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
		<section
			aria-label="حال روزانه"
			className="relative flex flex-col items-center justify-between w-full h-full p-[8.3cqh] overflow-hidden text-center select-none group"
		>
			<div className="flex items-center justify-between w-full px-1">
				<span
					className={cn(
						'px-2 py-0.5 rounded-full text-[10.4cqh] font-bold leading-none transition-colors truncate',
						currentOption ? 'text-primary' : 'bg-content text-muted'
					)}
				>
					{currentOption ? currentOption.label : 'حس امروزت؟'}
				</span>

				{onOpenMenu && (
					<button
						ref={menuTriggerRef}
						type="button"
						onClick={onOpenMenu}
						aria-label="گزینه‌های حال روزانه"
						className="p-1 leading-none transition-ui rounded-lg opacity-0 cursor-pointer text-muted hover:text-strong hover:bg-hovered group-hover:opacity-100 focus-visible:focus-ring"
					>
						<Icon name="menuOption" size={12} aria-hidden="true" />
					</button>
				)}
			</div>

			<span
				aria-hidden="true"
				className="my-auto text-[28cqh] leading-none transition-transform duration-200 hover:scale-110 active:scale-95"
			>
				{currentOption ? currentOption.emoji : '🤍'}
			</span>

			<div className="flex items-center justify-center w-full gap-1.5 p-[4cqh] rounded-full bg-content">
				{moodOptions.map((opt) => {
					const isSelected = todayMood?.mood === opt.value

					return (
						<button
							key={opt.value}
							type="button"
							disabled={isSaving}
							aria-pressed={isSelected}
							aria-label={opt.label}
							onClick={(e) => {
								e.stopPropagation()
								onSelectMood(opt.value as MoodType)
							}}
							className={cn(
								'flex items-center justify-center w-[22cqh] h-[22cqh] rounded-full leading-none',
								'text-[13cqh] transition-ui cursor-pointer',
								'disabled:cursor-not-allowed disabled:opacity-60 focus-visible:focus-ring',
								isSelected
									? 'bg-primary text-primary-content scale-110 shadow-xs'
									: 'hover:bg-hovered hover:scale-105 opacity-70 hover:opacity-100'
							)}
						>
							<span aria-hidden="true">{opt.emoji}</span>
						</button>
					)
				})}
			</div>
		</section>
	)
}
