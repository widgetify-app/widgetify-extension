import type React from 'react'
import { moodOptions } from '@/common/constants/moods'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import type { MoodEntry } from '@/services/hooks/mood-log/get-moods.hook'
import type { MoodType } from '@/services/hooks/mood-log/upsert-mood-log.hook'

interface Mood2x1Props {
	todayMood?: MoodEntry
	onSelectMood: (mood: MoodType) => void
	isSaving?: boolean
	onOpenMenu?: (e: React.MouseEvent) => void
	menuTriggerRef?: React.RefObject<HTMLButtonElement | null>
}

export function Mood2x1({
	todayMood,
	onSelectMood,
	isSaving,
	onOpenMenu,
	menuTriggerRef,
}: Mood2x1Props) {
	return (
		<section
			aria-label="حال روزانه"
			className="flex flex-col justify-between w-full h-full p-[10.4cqh] overflow-hidden text-right select-none group"
		>
			<header className="flex items-center justify-between px-0.5">
				<h3 className="text-[11.5cqh] font-bold leading-none text-content">
					امروز چه حسی داری؟
				</h3>

				{onOpenMenu && (
					<button
						ref={menuTriggerRef}
						type="button"
						onClick={onOpenMenu}
						aria-label="گزینه‌های حال روزانه"
						className="p-1 leading-none transition-ui rounded-lg opacity-0 cursor-pointer text-muted hover:text-content hover:bg-hovered group-hover:opacity-100 focus-visible:focus-ring"
					>
						<Icon name="menuOption" size={13} aria-hidden="true" />
					</button>
				)}
			</header>

			<div className="grid w-full grid-cols-4 gap-1.5">
				{moodOptions.map((opt) => {
					const isSelected = todayMood?.mood === opt.value

					return (
						<button
							key={opt.value}
							type="button"
							disabled={isSaving}
							aria-pressed={isSelected}
							aria-label={opt.label}
							onClick={() => onSelectMood(opt.value as MoodType)}
							className={cn(
								'flex flex-col items-center justify-center py-[4cqh] px-0.5 rounded-xl border transition-ui cursor-pointer',
								'disabled:cursor-not-allowed disabled:opacity-60 focus-visible:focus-ring',
								isSelected
									? 'bg-brand-subtle border-primary shadow-xs font-black'
									: 'bg-subtle hover:bg-hovered border-transparent'
							)}
						>
							<span
								aria-hidden="true"
								className="text-[20.8cqh] leading-none transition-transform hover:scale-110"
							>
								{opt.emoji}
							</span>
							<span
								aria-hidden="true"
								className={cn(
									'text-[9.4cqh] mt-0.5 truncate leading-none',
									isSelected ? 'font-bold text-primary' : 'text-muted'
								)}
							>
								{opt.label}
							</span>
						</button>
					)
				})}
			</div>
		</section>
	)
}
