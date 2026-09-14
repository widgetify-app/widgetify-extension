import { useEffect, useState } from 'react'
import { useGeneralSetting } from '@/context/general-setting.context'
import { WidgetContainer } from '../widget-container'
import { TransparentClockEnglish } from './variants/transparent-clock-english'
import { TransparentClockPersian } from './variants/transparent-clock-persian'

import type { WidgetSize } from '../layout-engine/types'

interface TransparentClockWidgetProps {
	size?: WidgetSize
	meta?: {
		variant?: string
	}
}

export function TransparentClockWidget({ meta }: TransparentClockWidgetProps) {
	const { selected_timezone: timezone } = useGeneralSetting()

	const [time, setTime] = useState(
		() =>
			new Date(
				new Date().toLocaleString('en-US', {
					timeZone: timezone?.value || undefined,
				})
			)
	)

	useEffect(() => {
		const updateTime = () => {
			setTime(
				new Date(
					new Date().toLocaleString('en-US', {
						timeZone: timezone?.value || undefined,
					})
				)
			)
		}

		updateTime()

		let timer: ReturnType<typeof setTimeout>
		const scheduleNextMinuteTick = () => {
			const delay = 60_000 - (Date.now() % 60_000) + 100
			timer = setTimeout(() => {
				updateTime()
				scheduleNextMinuteTick()
			}, delay)
		}
		scheduleNextMinuteTick()

		return () => clearTimeout(timer)
	}, [timezone?.value])

	const hours = time.getHours().toString().padStart(2, '0')
	const minutes = time.getMinutes().toString().padStart(2, '0')

	return (
		<WidgetContainer
			background={false}
			padding={false}
			className="w-full h-full select-none"
		>
			<div className="w-full h-full">
				{meta?.variant === 'english' ? (
					<TransparentClockEnglish
						time={time}
						hours={hours}
						minutes={minutes}
					/>
				) : (
					<TransparentClockPersian
						time={time}
						hours={hours}
						minutes={minutes}
					/>
				)}
			</div>
		</WidgetContainer>
	)
}
