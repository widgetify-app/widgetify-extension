import { useGeneralSetting } from '@/context/general-setting.context'
import { useZonedClock } from '@/hooks/use-zoned-clock'
import { WidgetContainer } from '../widget-container'
import type { TransparentClockVariant } from './types'
import { TransparentClockEnglish } from './variants/transparent-clock-english'
import { TransparentClockPersian } from './variants/transparent-clock-persian'

interface TransparentClockWidgetProps {
	meta?: { variant?: TransparentClockVariant | string }
}

export function TransparentClockWidget({ meta }: TransparentClockWidgetProps) {
	const { selected_timezone: timezone } = useGeneralSetting()

	const time = useZonedClock(timezone?.value)

	const hours = time.getHours().toString().padStart(2, '0')
	const minutes = time.getMinutes().toString().padStart(2, '0')
	const isoDateTime = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()).padStart(2, '0')}T${hours}:${minutes}`

	const ClockVariant =
		meta?.variant === 'english' ? TransparentClockEnglish : TransparentClockPersian

	return (
		<WidgetContainer
			background={false}
			padding={false}
			className="w-full h-full select-none"
		>
			<ClockVariant
				time={time}
				hours={hours}
				minutes={minutes}
				isoDateTime={isoDateTime}
			/>
		</WidgetContainer>
	)
}
