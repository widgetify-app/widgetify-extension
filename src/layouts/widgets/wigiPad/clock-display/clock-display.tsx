import { getFromStorage, setToStorage } from '@/common/storage'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useEffect, useState } from 'react'
import { AnalogClock } from './clocks/analog.clock'
import { DigitalClock } from './clocks/digital.clock'
import { ClockSettingsModal } from './components/clock-settings-modal'
import { Button } from '@/components/button/button'
import { FaCog } from 'react-icons/fa'

export enum ClockType {
	Analog = 'analog',
	Digital = 'digital',
}
export interface ClockSettings {
	clockType: ClockType
	showSeconds: boolean
	showTimeZone: boolean
}

export function ClockDisplay() {
	const [clockSettings, setClockSettings] = useState<ClockSettings | null>(null)
	const { selected_timezone: timezone } = useGeneralSetting()
	const [time, setTime] = useState(
		new Date(new Date().toLocaleString('en-US', { timeZone: timezone.value }))
	)
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(
				new Date(new Date().toLocaleString('en-US', { timeZone: timezone.value }))
			)
		}, 1000)
		return () => clearInterval(timer)
	}, [timezone])

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
				})
			}
		}

		load()
	}, [])

	if (!clockSettings) {
		return null
	}

	const isDayTime = time.getHours() >= 6 && time.getHours() < 18

	async function updateClockSetting(newSetting: ClockSettings) {
		setClockSettings(newSetting)
		await setToStorage('clock', newSetting)
		setIsSettingsOpen(false)
	}

	return (
		<div className="relative bg-widget flex flex-col items-center px-2 py-1 overflow-hidden border border-b-0 rounded-2xl bg-widget widget-wrapper border-content">
			<div className="absolute inset-0 z-20 group">
				<Button
					onClick={() => setIsSettingsOpen(true)}
					size="xs"
					className="m-1.5 h-5 w-5 p-0 bg-widget flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 !border-none !shadow-none transition-all duration-300 delay-200"
				>
					<FaCog size={12} className="text-content" />
				</Button>
			</div>

			<div className="flex flex-col items-center justify-center flex-grow">
				{clockSettings.clockType === 'analog' ? (
					<AnalogClock
						time={time}
						isDayTime={isDayTime}
						timezone={timezone}
						setting={clockSettings}
					/>
				) : (
					<DigitalClock
						time={time}
						isDayTime={isDayTime}
						timezone={timezone}
						setting={clockSettings}
					/>
				)}
			</div>

			{/* Settings Modal */}
			<ClockSettingsModal
				isOpen={isSettingsOpen}
				onClose={(val) => updateClockSetting(val)}
				clockSetting={clockSettings}
			/>
		</div>
	)
}
