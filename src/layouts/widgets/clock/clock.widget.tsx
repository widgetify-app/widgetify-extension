import { useEffect, useMemo, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { useGeneralSetting } from '@/context/general-setting.context'
import type { FetchedTimezone } from '@/services/hooks/timezone/get-timezones.hook'
import { type ClockSettings, ClockType } from '../wigi-pad/clock-display/clock-setting.interface'
import { WidgetContainer } from '../widget-container'
import type { WidgetSize } from '../layout-engine/types'

interface ClockWidgetProps {
	size?: WidgetSize
}

function toPersianDigits(val: string | number): string {
	return String(val).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
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
	const minutes = setting.useSelectedFont ? toPersianDigits(rawMinutes) : rawMinutes
	const seconds = setting.useSelectedFont ? toPersianDigits(rawSeconds) : rawSeconds

	const timezoneLabel = useMemo(() => {
		if (!timezone?.value) return 'UTC'
		const parts = timezone.value.split('/')
		if (parts.length > 1) {
			return parts[1].replace(/_/g, ' ')
		}
		return timezone.value
	}, [timezone])

	const isAnalog = setting.clockType === ClockType.Analog

	if (size.w === 1) {
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
							<span className="text-[10px] font-mono text-muted mt-1">
								:{seconds}
							</span>
						)}
					</div>
				)}
			</div>
		)
	}

	if (size.w >= 4) {
		return (
			<div className="w-full h-full flex items-center justify-between px-6 py-2 overflow-hidden select-none">
				<div className="flex items-center gap-4">
					{isAnalog && (
						<div className="shrink-0">
							<MiniAnalogClock time={time} showSeconds={showSeconds} size={68} />
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
								<span className="text-sm font-mono font-bold text-muted">
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
					<div className="px-2.5 py-1 rounded-xl bg-base-300/60 text-xs font-mono text-content font-bold">
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

	return (
		<div className="w-full h-full flex flex-col items-center justify-center p-2 overflow-hidden select-none">
			{isAnalog ? (
				<div className="flex items-center justify-center gap-3 w-full">
					<MiniAnalogClock time={time} showSeconds={showSeconds} size={62} />
					<div className="flex flex-col items-start justify-center">
						<span
							className={`text-2xl sm:text-3xl font-black text-content tracking-wide ${!setting.useSelectedFont ? 'font-sans' : ''}`}
						>
							{hours} : {minutes}
						</span>
						{setting.showTimeZone && (
							<span className="text-[10px] text-muted truncate max-w-24 mt-0.5">
								{timezoneLabel}
							</span>
						)}
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center text-center">
					<div className="flex items-baseline gap-1.5 leading-none">
						<span
							className={`text-3xl sm:text-4xl font-black text-content tracking-wider ${!setting.useSelectedFont ? 'font-sans' : ''}`}
						>
							{hours} : {minutes}
						</span>
						{showSeconds && (
							<span className="text-xs font-mono font-bold text-muted">
								:{seconds}
							</span>
						)}
					</div>
					{setting.showTimeZone && (
						<div className="mt-1.5 px-2 py-0.5 rounded-full bg-base-300/40 text-[10px] font-medium text-muted truncate max-w-36">
							{timezoneLabel}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

function MiniAnalogClock({
	time,
	showSeconds,
	size = 56,
}: {
	time: Date
	showSeconds: boolean
	size?: number
}) {
	const hours = time.getHours() % 12
	const minutes = time.getMinutes()
	const seconds = time.getSeconds()

	const hourAngle = hours * 30 + minutes * 0.5
	const minuteAngle = minutes * 6
	const secondAngle = seconds * 6

	return (
		<div
			style={{ width: size, height: size }}
			className="relative shrink-0 flex items-center justify-center rounded-full bg-base-300/30 border border-base-content/10"
		>
			<svg width={size} height={size} viewBox="0 0 100 100" className="w-full h-full">
				{[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
					(angle, i) => {
						const isMain = angle % 90 === 0
						const r1 = isMain ? 38 : 42
						const r2 = 46
						const rad = ((angle - 90) * Math.PI) / 180
						return (
							<line
								key={i}
								x1={50 + r1 * Math.cos(rad)}
								y1={50 + r1 * Math.sin(rad)}
								x2={50 + r2 * Math.cos(rad)}
								y2={50 + r2 * Math.sin(rad)}
								stroke="currentColor"
								strokeWidth={isMain ? 3 : 1.5}
								className="text-base-content/40"
							/>
						)
					}
				)}

				<line
					x1="50"
					y1="50"
					x2={50 + 26 * Math.cos(((hourAngle - 90) * Math.PI) / 180)}
					y2={50 + 26 * Math.sin(((hourAngle - 90) * Math.PI) / 180)}
					stroke="currentColor"
					strokeWidth="4"
					strokeLinecap="round"
					className="text-content"
				/>

				<line
					x1="50"
					y1="50"
					x2={50 + 36 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)}
					y2={50 + 36 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)}
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					className="text-content/80"
				/>

				{showSeconds && (
					<line
						x1="50"
						y1="50"
						x2={50 + 38 * Math.cos(((secondAngle - 90) * Math.PI) / 180)}
						y2={50 + 38 * Math.sin(((secondAngle - 90) * Math.PI) / 180)}
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						className="text-primary"
					/>
				)}

				<circle cx="50" cy="50" r="3" fill="currentColor" className="text-content" />
			</svg>
		</div>
	)
}
