import { t } from '@/common/i18n'
import type { ReactNode } from 'react'
import { getCurrentDate } from '@/common/utils/date-events'
import { PopoverMenuItem } from '@/components/ui'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/icons'
import type { WidgetSize } from '../utils/layout-engine/types'
import { WidgetContainer } from '../components/widget-container'
import { WidgetHeader, WidgetHeaderButton } from '../components/widget-header'
import { useWidgetMenuActions } from '../widget-menu.context'
import { HabitModals } from './components/habit-modals'
import { useHabitActions } from './hooks/use-habit-actions'
import { isHabitDoneToday } from './utils/habit-goal'
import { Habit2x1 } from './variants/habit-2x1'
import { Habit2x3 } from './variants/habit-2x3'
import { Habit4x3 } from './variants/habit-4x3'

interface HabitsContentProps {
	size?: WidgetSize
	tabs?: ReactNode
}

export function HabitsContent({ size = { w: 2, h: 3 }, tabs }: HabitsContentProps = {}) {
	const { selected_timezone: timezone } = useGeneralSetting()
	const today = getCurrentDate(timezone.value)
	const actions = useHabitActions()
	const { isAuthenticated, isLoading, habits, openAddHabit, onRefresh } = actions

	useWidgetMenuActions(
		<PopoverMenuItem
			icon={<Icon name="refresh" size={14} />}
			label={t('widgets.habit.widget.refresh')}
			onClick={onRefresh}
		/>
	)

	const doneCount = habits.filter(isHabitDoneToday).length
	const info =
		isAuthenticated && !isLoading && habits.length > 0
			? t('widgets.habit.widget.progressOf', {
					p0: doneCount,
					p1: habits.length,
					p2: tabs ? '' : t('widgets.habit.widget.todaySuffix'),
				})
			: undefined

	return (
		<>
			<WidgetHeader
				title={tabs ?? t('widgets.habit.widget.title')}
				info={info}
				actions={
					isAuthenticated && (
						<WidgetHeaderButton
							label={t('widgets.habit.empty.cta')}
							icon="plus"
							onClick={openAddHabit}
						/>
					)
				}
			/>
			{size.h === 1 ? (
				<Habit2x1 actions={actions} today={today} />
			) : size.w === 4 ? (
				<Habit4x3 actions={actions} today={today} />
			) : size.h === 6 ? (
				<Habit4x3 actions={actions} today={today} layout="panel" />
			) : (
				<Habit2x3 actions={actions} today={today} />
			)}
			<HabitModals actions={actions} />
		</>
	)
}

interface HabitsLayoutProps {
	size?: WidgetSize
}

export function HabitsLayout({ size = { w: 2, h: 3 } }: HabitsLayoutProps = {}) {
	return (
		<WidgetContainer
			contentClassName={size.h === 1 ? 'px-3 py-2.5 gap-1.5' : 'p-3 gap-2'}
		>
			<HabitsContent size={size} />
		</WidgetContainer>
	)
}
