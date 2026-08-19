import { MiniAnalogClock } from '../components/mini-analog-clock'
import {
	type ClockSettings,
	ClockType,
} from '@/layouts/widgets/wigi-pad/clock-display/clock-setting.interface'
import type { FetchedTimezone } from '@/services/hooks/timezone/get-timezones.hook'

interface Clock4x1Props {
	time: Date
	setting: ClockSettings
	timezone: FetchedTimezone
	timezoneLabel: string
	showSeconds: boolean
	hours: string
	minutes: string
	seconds: string
}

export function Clock4x1({
	time,
	setting,
	timezone,
	timezoneLabel,
	showSeconds,
	hours,
	minutes,
	seconds,
}: Clock4x1Props) {
	const isAnalog = setting.clockType === ClockType.Analog

	return (
		<div className="w-full h-full flex items-center justify-between px-6 py-2 overflow-hidden select-none">
			<div className="flex items-center gap-4">
				{isAnalog && (
					<div className="shrink-0">
						<MiniAnalogClock
							time={time}
							showSeconds={showSeconds}
							size={68}
						/>
					</div>
				)}
				<div className="flex flex-col items-start justify-center">
					<div className="flex items-baseline gap-2 leading-none">
						<span
							className={`text-4xl sm:text-5xl font-black text-content tracking-wide ${!setting.useSelectedFont ? 'font-sans' : ''}`}
						>
							{hours} : {minutes}
						</span>
						{showSeconds && (
							<span className="text-sm font-bold text-muted">
								:{seconds}
							</span>
						)}
					</div>
					{setting.showTimeZone && (
						<span className="text-xs font-medium text-muted mt-1.5">
							{timezone?.label || timezoneLabel}
						</span>
					)}
				</div>
			</div>

			<div className="flex flex-col items-end justify-center text-left pl-2">
				<div className="px-2.5 py-1 rounded-xl bg-base-300/60 text-xs text-content font-bold">
					{timezoneLabel}
				</div>
				<span className="text-[11px] text-muted mt-1.5">
					{time.toLocaleDateString('fa-IR', {
						weekday: 'long',
						month: 'short',
						day: 'numeric',
					})}
				</span>
			</div>
		</div>
	)
}
