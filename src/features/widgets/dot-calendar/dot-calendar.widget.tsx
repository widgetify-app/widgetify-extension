import jalaliMoment from 'jalali-moment'
import { callEvent } from '@/common/utils/call-event'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useZonedClock } from '@/features/widgets/hooks/use-zoned-clock'
import { WidgetTabKeys } from '@/features/widgets/types'
import type { WidgetSize } from '../utils/layout-engine/types'
import { WidgetContainer } from '../components/widget-container'
import type { DotCalendarMeta } from './types'
import { normalizeDotCalendarVariant } from './utils/normalize-variant'
import { DotCalendarGoal } from './variants/dot-calendar-goal'
import { DotCalendarYear } from './variants/dot-calendar-year'

interface DotCalendarWidgetProps {
	instanceId: string
	size: WidgetSize
	meta?: DotCalendarMeta
}

export function DotCalendarWidget({ instanceId, size, meta }: DotCalendarWidgetProps) {
	const { selected_timezone: timezone } = useGeneralSetting()
	const now = useZonedClock(timezone?.value)
	const today = jalaliMoment(now).locale('fa')
	const variant = normalizeDotCalendarVariant(meta?.variant)

	const openSettings = () => {
		callEvent('openWidgetsSettings', {
			tab: WidgetTabKeys.dot_calendar_settings,
			instanceId,
			size,
		})
	}

	return (
		<WidgetContainer padding={false}>
			{variant === 'goal' ? (
				<DotCalendarGoal
					today={today}
					meta={meta}
					onOpenSettings={openSettings}
				/>
			) : (
				<DotCalendarYear today={today} />
			)}
		</WidgetContainer>
	)
}
