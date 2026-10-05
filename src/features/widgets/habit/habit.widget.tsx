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

interface HabitsContentProps {
	tabs?: ReactNode
	isCompact?: boolean
}

export function HabitsContent({ tabs, isCompact = false }: HabitsContentProps = {}) {
	const { selected_timezone: timezone } = useGeneralSetting()
	const today = getCurrentDate(timezone.value)
	const actions = useHabitActions()
	const { isAuthenticated, isLoading, habits, openAddHabit, onRefresh } = actions

	useWidgetMenuActions(
		<PopoverMenuItem
			icon={<Icon name="refresh" size={14} />}
			label="بارگذاری مجدد"
			onClick={onRefresh}
		/>
	)

	const doneCount = habits.filter(isHabitDoneToday).length
	const info =
		isAuthenticated && !isLoading && habits.length > 0
			? `${doneCount} از ${habits.length}${tabs ? '' : ' امروز'}`
			: undefined

	return (
		<>
			<WidgetHeader
				title={tabs ?? 'عادت‌ها'}
				info={info}
				actions={
					isAuthenticated && (
						<WidgetHeaderButton
							label="عادت جدید"
							icon="plus"
							onClick={openAddHabit}
						/>
					)
				}
			/>
			{isCompact ? (
				<Habit2x1 actions={actions} today={today} />
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
	const isCompact = size.w === 2 && size.h === 1

	return (
		<WidgetContainer
			contentClassName={isCompact ? 'px-3 py-2.5 gap-1.5' : 'p-3 gap-2'}
		>
			<HabitsContent isCompact={isCompact} />
		</WidgetContainer>
	)
}
