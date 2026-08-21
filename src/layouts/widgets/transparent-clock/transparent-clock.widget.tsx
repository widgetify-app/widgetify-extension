import { useEffect, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { useGeneralSetting } from '@/context/general-setting.context'
import {
	type ClockSettings,
	ClockType,
} from '@/layouts/widgets/wigi-pad/clock-display/clock-setting.interface'
import { WidgetContainer } from '../widget-container'
import type { WidgetSize } from '../layout-engine/types'
import { getTimeZoneLabel } from '@/common/utils/get-timezone-label'

interface TransparentClockWidgetProps {
	size?: WidgetSize
}

export function TransparentClockWidget({
	size = { w: 4, h: 2 },
}: TransparentClockWidgetProps) {
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

	const rawHours = time.getHours().toString().padStart(2, '0')
	const rawMinutes = time.getMinutes().toString().padStart(2, '0')

	const weekday = time.toLocaleDateString('fa-IR', { weekday: 'long' })
	const jalaliDate = time.toLocaleDateString('fa-IR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
	const gregorianDate = time.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})

	const isCompact = size.h === 1
	const isSmallWidth = size.w <= 2

	const timeSizeClass = (() => {
		if (size.w >= 4 && size.h >= 2) return 'text-6xl sm:text-7xl md:text-8xl'
		if (size.w >= 4 && size.h === 1) return 'text-4xl sm:text-5xl md:text-6xl'
		if (size.w <= 2 && size.h >= 2) return 'text-4xl sm:text-5xl'
		return 'text-2xl sm:text-3xl md:text-4xl'
	})()

	const subtitleSizeClass = (() => {
		if (size.w >= 4 && size.h >= 2) return 'text-sm sm:text-base md:text-lg mt-2 sm:mt-3'
		if (size.w >= 4 && size.h === 1) return 'text-xs sm:text-sm mt-1'
		if (size.w <= 2 && size.h >= 2) return 'text-xs sm:text-sm mt-1.5'
		return 'text-[10px] sm:text-xs mt-0.5'
	})()

	return (
		<WidgetContainer
			background={false}
			padding={false}
			className="h-full w-full select-none"
		>
			<div className="flex flex-col items-center justify-center w-full h-full text-center drop-shadow-lg">
				<div
					dir="ltr"
					className={`font-black tracking-tight leading-none text-white ${timeSizeClass}`}
				>
					<span>{rawHours}</span>
					<span className="inline-block mx-0.5">:</span>
					<span>{rawMinutes}</span>
				</div>

				<div
					className={`flex items-center justify-center gap-1.5 font-medium text-white/95 ${subtitleSizeClass}`}
				>
					<span>{weekday}</span>
					<span className="opacity-60">•</span>
					<span>{getTimeZoneLabel(timezone.label)}</span>
				</div>

				{!isCompact && (
					<div className="flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm font-light text-white/85 mt-1">
						<span>{jalaliDate}</span>
						{!isSmallWidth && (
							<>
								<span className="opacity-60">•</span>
								<span dir="ltr">{gregorianDate}</span>
							</>
						)}
					</div>
				)}
			</div>
		</WidgetContainer>
	)
}
