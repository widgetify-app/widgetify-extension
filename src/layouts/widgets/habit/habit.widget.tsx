import { getCurrentDate } from '@widget/calendar/utils/date-events'
import { useGeneralSetting } from '@/context/general-setting.context'
import type { WidgetSize } from '../layout-engine/types'
import { WidgetContainer } from '../widget-container'
import { HabitModals } from './components/habit-modals'
import { useHabitActions } from './hooks/use-habit-actions'
import { HabitCompactWide } from './variants/habit-2x1'
import { Habit2x3 } from './variants/habit-2x3'

export function HabitsContent() {
	const actions = useHabitActions()

	return (
		<>
			<Habit2x3 actions={actions} />
			<HabitModals actions={actions} />
		</>
	)
}

interface HabitsLayoutProps {
	size?: WidgetSize
}

export function HabitsLayout({ size = { w: 2, h: 3 } }: HabitsLayoutProps = {}) {
	const { selected_timezone: timezone } = useGeneralSetting()
	const actions = useHabitActions()

	if (size.w === 2 && size.h === 1) {
		return (
			<WidgetContainer>
				<HabitCompactWide
					habits={actions.habits}
					isLoading={actions.isLoading}
					isError={actions.isError}
					isAuthenticated={actions.isAuthenticated}
					today={getCurrentDate(timezone.value)}
					onChanged={actions.refetch}
					onRefresh={actions.onRefresh}
					onAddHabit={actions.openAddHabit}
					onViewDetails={actions.openHabitDetail}
				/>
				<HabitModals actions={actions} />
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer>
			<HabitsContent />
		</WidgetContainer>
	)
}
