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
import { toPersianDigits } from '@/common/utils/persian-digits'
import { Clock1x1 } from './variants/clock-1x1'
import { Clock2x1 } from './variants/clock-2x1'

interface ClockWidgetProps {
	size?: WidgetSize
}

export function ClockWidget({ size = { w: 2, h: 1 } }: ClockWidgetProps) {
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

	return (
		<WidgetContainer className="h-full w-full">
			<ClockContent
				size={size}
				setting={clockSettings}
				timezone={timezone}
				isOptimalMode={Boolean(isOptimalMode)}
			/>
		</WidgetContainer>
	)
}

interface ClockContentProps {
	size: WidgetSize
	setting: ClockSettings
	timezone: FetchedTimezone
	isOptimalMode: boolean
}

function ClockContent({
	size,
	setting,
	timezone,
	isOptimalMode,
}: ClockContentProps) {
	const [time, setTime] = useState(
		() =>
			new Date(
				new Date().toLocaleString('en-US', {
					timeZone: timezone?.value || undefined,
				})
			)
	)

	const showSeconds = setting.showSeconds && !isOptimalMode

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
		const interval = showSeconds ? 1000 : 30_000
		const timer = setInterval(updateTime, interval)

		return () => clearInterval(timer)
	}, [timezone?.value, showSeconds])

	const rawHours = time.getHours().toString().padStart(2, '0')
	const rawMinutes = time.getMinutes().toString().padStart(2, '0')
	const rawSeconds = time.getSeconds().toString().padStart(2, '0')

	const hours = setting.useSelectedFont ? toPersianDigits(rawHours) : rawHours
	const minutes = setting.useSelectedFont
		? toPersianDigits(rawMinutes)
		: rawMinutes
	const seconds = setting.useSelectedFont
		? toPersianDigits(rawSeconds)
		: rawSeconds

	const timezoneLabel = useMemo(() => {
		if (!timezone?.value) return 'UTC'
		const parts = timezone.value.split('/')
		if (parts.length > 1) {
			return parts[1].replace(/_/g, ' ')
		}
		return timezone.value
	}, [timezone])

	if (size.w === 1) {
		return (
			<Clock1x1
				time={time}
				setting={setting}
				showSeconds={showSeconds}
				hours={hours}
				minutes={minutes}
				seconds={seconds}
			/>
		)
	}

	return (
		<Clock2x1
			time={time}
			setting={setting}
			timezone={timezone}
			timezoneLabel={timezoneLabel}
			showSeconds={showSeconds}
			hours={hours}
			minutes={minutes}
			seconds={seconds}
		/>
	)
}
