import type { ReactNode } from 'react'
import type { WidgetifyDate } from '@/common/utils/date-events'
import { WidgetMenuButton } from '@/features/widgets/components/widget-menu-button'
import { Icon, type IconName } from '@/icons'
import { CONVERTER_DEFAULT_PAIR } from '../constants'
import { useReligiousTimes } from '../hooks/use-religious-times'
import { usePomodoroGlance } from '../hooks/use-pomodoro-glance'
import { formatTimer } from '../utils/pomodoro-time'
import type { ToolsTabType } from '../types'
import { nextPrayerIndex } from '../utils/next-prayer'

interface ToolsCompactRowProps {
	currentDate: WidgetifyDate
	onSelectTab: (tab: ToolsTabType) => void
}

export function ToolsCompactRow({ currentDate, onSelectTab }: ToolsCompactRowProps) {
	const pomodoro = usePomodoroGlance()
	const { times } = useReligiousTimes(currentDate)

	const nextIndex = nextPrayerIndex(
		times.map((time) => time.value),
		new Date()
	)
	const prayer = times[nextIndex < 0 ? 0 : nextIndex]

	return (
		<>
			<div className="flex items-center justify-between h-4.5 shrink-0">
				<span className="font-bold text-3xs text-fg-muted">ابزارها</span>
				<span className="widget-control">
					<WidgetMenuButton placement="compact" />
				</span>
			</div>
			<ul
				aria-label="ابزارها"
				className="grid flex-1 min-h-0 grid-cols-3 gap-1.5 select-none"
			>
				<ToolTile
					icon="timer"
					label="پومودورو"
					onClick={() => onSelectTab('pomodoro')}
				>
					{formatTimer(pomodoro.secondsLeft)}
				</ToolTile>
				<ToolTile
					icon={prayer.icon}
					label={prayer.title}
					onClick={() => onSelectTab('religious-time')}
				>
					{prayer.value ?? '—'}
				</ToolTile>
				<ToolTile
					icon="currency"
					label="تبدیل ارز"
					onClick={() => onSelectTab('currency-converter')}
				>
					<span dir="ltr" className="inline-flex items-center gap-1 font-latin">
						{CONVERTER_DEFAULT_PAIR.from}
						<Icon
							name="arrowRightLeft"
							size={12}
							aria-hidden="true"
							className="text-fg-faint"
						/>
						{CONVERTER_DEFAULT_PAIR.to}
					</span>
				</ToolTile>
			</ul>
		</>
	)
}

interface ToolTileProps {
	icon: IconName
	label: string
	onClick: () => void
	children: ReactNode
}

function ToolTile({ icon, label, onClick, children }: ToolTileProps) {
	return (
		<li className="min-w-0">
			<button
				type="button"
				onClick={onClick}
				className="flex flex-col items-start justify-center w-full h-full min-w-0 gap-0.5 px-2.5 rounded-xl cursor-pointer bg-fill transition-ui hover:bg-fill-2 focus-visible:focus-ring"
			>
				<span className="flex items-center w-full min-w-0 gap-1 font-semibold text-3xs text-fg-faint">
					<Icon name={icon} size={12} aria-hidden="true" className="shrink-0" />
					<span className="truncate">{label}</span>
				</span>
				<span className="w-full text-sm font-extrabold truncate text-start tabular-nums text-fg-strong">
					{children}
				</span>
			</button>
		</li>
	)
}
