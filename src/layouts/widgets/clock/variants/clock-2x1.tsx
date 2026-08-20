import { MiniAnalogClock } from '../components/mini-analog-clock'
import {
	type ClockSettings,
	ClockType,
} from '@/layouts/widgets/wigi-pad/clock-display/clock-setting.interface'
import type { FetchedTimezone } from '@/services/hooks/timezone/get-timezones.hook'

interface Clock2x1Props {
	time: Date
	setting: ClockSettings
	timezone: FetchedTimezone
	timezoneLabel: string
	showSeconds: boolean
	hours: string
	minutes: string
	seconds: string
}

export function Clock2x1({
	time,
	setting,
	timezone,
	timezoneLabel,
	showSeconds,
	hours,
	minutes,
	seconds,
}: Clock2x1Props) {
	const isAnalog = setting.clockType === ClockType.Analog

	return (
		<div className="w-full h-full flex items-center justify-between px-4 py-2 overflow-hidden select-none">
			<div className="flex items-center gap-3">
				{isAnalog && (
					<div className="shrink-0">
						<MiniAnalogClock
							time={time}
							showSeconds={showSeconds}
							size={56}
						/>
					</div>
				)}
				<div className="flex flex-col items-start justify-center">
					<div className="flex items-baseline gap-1.5 leading-none">
						<span
							className={`text-3xl sm:text-4xl font-black text-content tracking-tight ${!setting.useSelectedFont ? 'font-sans' : ''}`}
							dir="ltr"
						>
							{hours} : {minutes}
						</span>
						{showSeconds && (
							<span className="text-xs font-bold text-muted">
								:{seconds}
							</span>
						)}
					</div>
					{setting.showTimeZone && (
						<span className="text-[11px] font-medium text-muted mt-1">
							{timezone?.label || timezoneLabel}
						</span>
					)}
				</div>
			</div>

			<div className="flex flex-col items-end justify-center text-left pl-1">
				<div className="px-2 py-0.5 rounded-lg bg-base-300/60 text-[11px] text-content font-bold">
					{timezoneLabel}
				</div>
				<span className="text-[10px] text-muted mt-1">
					{time.toLocaleDateString('fa-IR', {
						weekday: 'short',
						month: 'short',
						day: 'numeric',
					})}
				</span>
			</div>
		</div>
	)
}
