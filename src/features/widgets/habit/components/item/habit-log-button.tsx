import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { getContrastingTextColor } from '@/common/utils/color'
import type { WidgetifyDate } from '@/common/utils/date-events'
import { playAlarm } from '@/common/utils/play-alarm'
import { translateError } from '@/common/utils/translate-error'
import { Spinner } from '@/components/ui'
import { Icon } from '@/icons'
import { safeAwait } from '@/services/api'
import type { Habit } from '@/services/habit/habit.interface'
import { useLogHabitProgress } from '@/services/habit/log-habit-progress.hook'
import { DEFAULT_HABIT_COLOR } from '../../constants'
import { isHabitDoneToday } from '../../utils/habit-goal'
import { resolveHabitStep } from '../../utils/habit-step'
import { SegmentedProgressRing } from './button-progress-ring'
import { SimpleProgressRing } from './button-simple-progress-ring'

interface HabitLogButtonProps {
	habit: Habit
	today: WidgetifyDate
	onLogged: () => void
}

export function HabitLogButton({ habit, today, onLogged }: HabitLogButtonProps) {
	const { mutateAsync: logProgress, isPending } = useLogHabitProgress()

	const color = habit.color || DEFAULT_HABIT_COLOR
	const target = habit.target || 1
	const value = habit.today.value
	const isDone = isHabitDoneToday(habit)

	const handleQuickLog = async (e: React.MouseEvent) => {
		e.stopPropagation()
		if (isPending) return

		const { amount, blockedMessage } = resolveHabitStep(habit, value)
		if (blockedMessage) {
			showToast(blockedMessage, 'error')
			return
		}

		const date = today.clone().doAsGregorian().format('YYYY-MM-DD')
		const [error] = await safeAwait(
			logProgress({ id: habit.id, input: { date, amount } })
		)
		if (error) {
			showToast(translateError(error) as string, 'error')
			return
		}
		playAlarm('info')
		onLogged()
	}

	return (
		<button
			type="button"
			onClick={handleQuickLog}
			disabled={isPending}
			aria-label={t('widgets.habit.item.logProgressAria', {
				p0: habit.title,
			})}
			className="relative grid rounded-full cursor-pointer place-items-center size-8 shrink-0 transition-ui active:scale-95 disabled:opacity-70 focus-visible:focus-ring"
			style={
				isDone
					? { backgroundColor: color, color: getContrastingTextColor(color) }
					: { color }
			}
		>
			{!isDone && (
				<span className="absolute inset-0 pointer-events-none">
					{target > 6 || target === 1 ? (
						<SimpleProgressRing
							value={value}
							target={target}
							color={color}
							strokeWidth={2.5}
						/>
					) : (
						<SegmentedProgressRing
							value={value}
							target={target}
							color={color}
							strokeWidth={2.5}
							gap={6}
						/>
					)}
				</span>
			)}

			<span className="relative grid place-items-center">
				{isPending ? (
					<Spinner size="sm" tone="current" />
				) : isDone ? (
					<Icon name="check" size={14} strokeWidth={2.5} aria-hidden="true" />
				) : habit.emoji ? (
					<span aria-hidden="true" className="text-xs">
						{habit.emoji}
					</span>
				) : (
					<Icon name="plus" size={14} strokeWidth={2.5} aria-hidden="true" />
				)}
			</span>
		</button>
	)
}
