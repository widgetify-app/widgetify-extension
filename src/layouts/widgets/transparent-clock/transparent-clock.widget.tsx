import { useEffect, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { useGeneralSetting } from '@/context/general-setting.context'
import {
	type ClockSettings,
	ClockType,
} from '@/layouts/widgets/wigi-pad/clock-display/clock-setting.interface'
import { WidgetContainer } from '../widget-container'
import { TransparentClockEnglish } from './variants/transparent-clock-english'
import { TransparentClockPersian } from './variants/transparent-clock-persian'

interface TransparentClockWidgetProps {
	meta?: {
		variant?: string
	}
}

export function TransparentClockWidget({ meta }: TransparentClockWidgetProps) {
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

	const [time, setTime] = useState(
		() =>
			new Date(
				new Date().toLocaleString('en-US', {
					timeZone: timezone?.value || undefined,
				})
			)
	)

	const showSeconds = clockSettings?.showSeconds && !isOptimalMode

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

	const hours = time.getHours().toString().padStart(2, '0')
	const minutes = time.getMinutes().toString().padStart(2, '0')

	return (
		<WidgetContainer
			background={false}
			padding={false}
			className="w-full h-full select-none"
		>
			<div className="w-full h-full drop-shadow-lg">
				{meta?.variant === 'english' ? (
					<TransparentClockEnglish
						time={time}
						hours={hours}
						minutes={minutes}
						timezoneLabel={timezone.value}
					/>
				) : (
					<TransparentClockPersian
						time={time}
						hours={hours}
						minutes={minutes}
						timezoneLabel={timezone.label}
					/>
				)}
			</div>
		</WidgetContainer>
	)
}
