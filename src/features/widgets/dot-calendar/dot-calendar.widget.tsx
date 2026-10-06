import jalaliMoment from 'jalali-moment'
import { callEvent } from '@/common/utils/call-event'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useZonedClock } from '@/features/widgets/hooks/use-zoned-clock'
import { WidgetTabKeys } from '@/features/widgets/types'
import type { WidgetSize } from '../utils/layout-engine/types'
import { WidgetContainer } from '../components/widget-container'
import { useWidgetSettingsSummary } from '../widget-menu.context'
import { GOAL_DATE_FORMAT } from './constants'
import type { DotCalendarMeta } from './types'
import { normalizeDotCalendarMeta } from './utils/normalize-meta'
import { DotCalendarGoal } from './variants/dot-calendar-goal'
import { DotCalendarYear } from './variants/dot-calendar-year'

export { normalizeDotCalendarMeta } from './utils/normalize-meta'

interface DotCalendarWidgetProps {
	instanceId: string
	size: WidgetSize
	meta?: DotCalendarMeta
}

export function DotCalendarWidget({ instanceId, size, meta }: DotCalendarWidgetProps) {
	const { selected_timezone: timezone } = useGeneralSetting()
	const now = useZonedClock(timezone?.value)
	const today = jalaliMoment(now).locale('fa')
	const options = normalizeDotCalendarMeta(meta)
	const isCompact = size.h === 1

	const goalEnd = options.goalEndDate
		? jalaliMoment(options.goalEndDate, GOAL_DATE_FORMAT, true)
		: null
	const goalEndLabel = goalEnd?.isValid()
		? goalEnd.locale('fa').format('jD jMMMM')
		: null
	useWidgetSettingsSummary(
		options.variant !== 'goal'
			? null
			: goalEndLabel
				? `هدف: ${options.goalTitle || 'هدف من'} · ${goalEndLabel}`
				: 'هنوز هدفی نداری'
	)

	const openSettings = () => {
		callEvent('openWidgetsSettings', {
			tab: WidgetTabKeys.dot_calendar_settings,
			instanceId,
			size,
		})
	}

	return (
		<WidgetContainer
			contentClassName={isCompact ? 'px-3 py-2.5 gap-1.5' : 'p-3 gap-2'}
		>
			{options.variant === 'goal' ? (
				<DotCalendarGoal
					today={today}
					options={options}
					isCompact={isCompact}
					onOpenSettings={openSettings}
				/>
			) : (
				<DotCalendarYear today={today} isCompact={isCompact} />
			)}
		</WidgetContainer>
	)
}
