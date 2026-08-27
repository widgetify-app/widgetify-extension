import { useEffect, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { useGeneralSetting } from '@/context/general-setting.context'
import { type ClockSettings, ClockType } from './clock-setting.interface'
import { AnalogClock } from './clocks/analog.clock'
import { DigitalClock } from './clocks/digital.clock'

export function ClockDisplay() {
	const [clockSettings, setClockSettings] = useState<ClockSettings | null>(null)
	const { selected_timezone: timezone } = useGeneralSetting()

	useEffect(() => {
		async function load() {
			const clockFromStore = await getFromStorage('clock')
			if (clockFromStore) {
				setClockSettings(clockFromStore)
			} else {
				setClockSettings({
					clockType: ClockType.Digital,
					showSeconds: false,
					showTimeZone: true,
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
		<div className="relative flex flex-col items-center justify-center p-1 overflow-hidden">
			<div className="flex flex-col items-center justify-center flex-grow">
				{clockSettings.clockType === 'analog' ? (
					<AnalogClock timezone={timezone} setting={clockSettings} />
				) : (
					<DigitalClock timezone={timezone} setting={clockSettings} />
				)}
			</div>
		</div>
	)
}
