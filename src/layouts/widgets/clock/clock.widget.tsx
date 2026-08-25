import { useEffect, useMemo, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { useGeneralSetting } from '@/context/general-setting.context'
import type { FetchedTimezone } from '@/services/hooks/timezone/get-timezones.hook'
import {
	type ClockSettings,
	ClockType,
} from '../wigi-pad/clock-display/clock-setting.interface'
import { WidgetContainer } from '../widget-container'
import type { WidgetSize } from '../layout-engine/types'
import { Clock1x1 } from './variants/clock-1x1'
import { Clock2x1 } from './variants/clock-2x1'
import { ClockAnalog } from './variants/clock-analog'
import { ClockFlip } from './variants/clock-flip'
import { getTimeZoneLabel } from '@/common/utils/get-timezone-label'

interface ClockWidgetProps {
	size?: WidgetSize
	meta?: {
		variant?: string
	}
}

export function ClockWidget({ size = { w: 2, h: 1 }, meta }: ClockWidgetProps) {
	const [clockSettings, setClockSettings] = useState<ClockSettings | null>(null)
	const { selected_timezone: timezone, isOptimalMode } = useGeneralSetting()

	useEffect(() => {
		async function load() {
			const clockFromStore = await getFromStorage('clock')
			if (clockFromStore) {
				setClockSettings(clockFromStore)
			} else {
				setClockSettings({
					clockType: ClockType.Digital,
					showSeconds: false,
					showTimeZone: false,
					useSelectedFont: true,
				})
			}
		}

		const event = listenEvent('wigiPadClockSettingsChanged', (data) => {
			setClockSettings({
				clockType: data.clockType,
				showSeconds: data.showSeconds,
				showTimeZone: data.showTimeZone,
				useSelectedFont: data.useSelectedFont,
			})
		})

		load()

		return () => {
			event()
		}
	}, [])

	if (!clockSettings) {
		return null
	}

	const background = !['analog', 'flip'].includes(meta?.variant || '')

	return (
		<WidgetContainer
			background={background}
			padding={background}
			className="h-full w-full"
		>
			<ClockContent
				size={size}
				timezone={timezone}
				isOptimalMode={Boolean(isOptimalMode)}
				meta={meta}
			/>
		</WidgetContainer>
	)
}

interface ClockContentProps {
	size: WidgetSize
	timezone: FetchedTimezone
	isOptimalMode: boolean
	meta?: {
		variant?: string
	}
}

function ClockContent({ size, timezone, isOptimalMode, meta }: ClockContentProps) {
	const [time, setTime] = useState(
		() =>
			new Date(
				new Date().toLocaleString('en-US', {
					timeZone: timezone?.value || undefined,
				})
			)
	)

	const isAnalog = meta?.variant === 'analog'
	const showSeconds = isAnalog || !isOptimalMode

	useEffect(() => {
		function updateTime() {
			setTime(
				new Date(
					new Date().toLocaleString('en-US', {
						timeZone: timezone?.value || undefined,
					})
				)
			)
		}

		updateTime()
		const interval = showSeconds ? 1000 : 30_000
		const timer = setInterval(updateTime, interval)

		return () => clearInterval(timer)
	}, [timezone?.value, showSeconds])

	const rawHours = time.getHours().toString().padStart(2, '0')
	const rawMinutes = time.getMinutes().toString().padStart(2, '0')

	const timezoneLabel = useMemo(() => {
		return getTimeZoneLabel(timezone.label)
	}, [timezone])

	if (meta?.variant === 'analog') {
		return <ClockAnalog size={size.w === 1 && size.h === 1 ? 76 : 96} time={time} />
	}

	if (meta?.variant === 'flip') {
		return <ClockFlip />
	}

	if (
		meta?.variant === 'digital-vertical' ||
		meta?.variant === 'vertical' ||
		(size.w === 1 && size.h === 1)
	) {
		return <Clock1x1 time={time} hours={rawHours} minutes={rawMinutes} />
	}

	return (
		<Clock2x1
			time={time}
			timezoneLabel={timezoneLabel}
			hours={rawHours}
			minutes={rawMinutes}
		/>
	)
}
