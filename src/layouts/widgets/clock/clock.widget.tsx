import { useMemo } from 'react'
import { getTimeZoneLabel } from '@/common/utils/get-timezone-label'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useZonedClock } from '@/hooks/use-zoned-clock'
import type { WidgetSize } from '../layout-engine/types'
import { WidgetContainer } from '../widget-container'
import { Clock1x1 } from './variants/clock-1x1'
import { Clock2x1 } from './variants/clock-2x1'
import { ClockAnalog } from './variants/clock-analog'
import { ClockFlip } from './variants/clock-flip'

const BACKGROUNDLESS_VARIANTS = ['analog', 'flip']
const VERTICAL_VARIANTS = ['digital-vertical', 'vertical']

interface ClockWidgetProps {
	size?: WidgetSize
	meta?: {
		variant?: string
	}
}

export function ClockWidget({ size = { w: 2, h: 1 }, meta }: ClockWidgetProps) {
	const variant = meta?.variant
	const hasBackground = !BACKGROUNDLESS_VARIANTS.includes(variant || '')

	return (
		<WidgetContainer
			background={hasBackground}
			padding={hasBackground}
			className="w-full h-full"
		>
			{variant === 'flip' ? (
				<ClockFlip />
			) : (
				<ClockContent size={size} variant={variant} />
			)}
		</WidgetContainer>
	)
}

interface ClockContentProps {
	size: WidgetSize
	variant?: string
}

function ClockContent({ size, variant }: ClockContentProps) {
	const { selected_timezone: timezone } = useGeneralSetting()

	const isAnalog = variant === 'analog'
	const time = useZonedClock(timezone?.value, isAnalog)

	const hours = time.getHours().toString().padStart(2, '0')
	const minutes = time.getMinutes().toString().padStart(2, '0')

	const timezoneLabel = useMemo(
		() => getTimeZoneLabel(timezone.label),
		[timezone.label]
	)

	if (isAnalog) {
		return <ClockAnalog size={size.w === 1 && size.h === 1 ? 76 : 96} time={time} />
	}

	if (
		VERTICAL_VARIANTS.includes(variant || '') ||
		(size.w === 1 && size.h === 1)
	) {
		return <Clock1x1 hours={hours} minutes={minutes} />
	}

	return (
		<Clock2x1
			time={time}
			timezoneLabel={timezoneLabel}
			hours={hours}
			minutes={minutes}
		/>
	)
}
