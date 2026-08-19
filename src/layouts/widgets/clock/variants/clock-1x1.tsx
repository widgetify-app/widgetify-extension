import { toPersianDigits } from '@/common/utils/persian-digits'
import { MiniAnalogClock } from '../components/mini-analog-clock'
import {
	type ClockSettings,
	ClockType,
} from '@/layouts/widgets/wigi-pad/clock-display/clock-setting.interface'

interface Clock1x1Props {
	time: Date
	setting: ClockSettings
	showSeconds: boolean
	hours: string
	minutes: string
	seconds: string
}

export function Clock1x1({
	time,
	setting,
	showSeconds,
	hours,
	minutes,
	seconds,
}: Clock1x1Props) {
	const isAnalog = setting.clockType === ClockType.Analog

	return (
		<div className="w-full h-full flex flex-col items-center justify-center p-1 overflow-hidden select-none">
			{isAnalog ? (
				<MiniAnalogClock time={time} showSeconds={showSeconds} size={60} />
			) : (
				<div className="flex flex-col items-center justify-center leading-none text-center">
					<span
						className={`text-2xl sm:text-3xl font-black text-content tracking-tight ${!setting.useSelectedFont ? 'font-sans' : ''}`}
					>
						{hours}
					</span>
					<div className="w-4 h-0.5 bg-base-content/20 my-1 rounded-full" />
					<span
						className={`text-2xl sm:text-3xl font-black text-content tracking-tight ${!setting.useSelectedFont ? 'font-sans' : ''}`}
					>
						{minutes}
					</span>
					{showSeconds && (
						<span className="text-[10px] text-muted mt-1">:{seconds}</span>
					)}
				</div>
			)}
		</div>
	)
}
