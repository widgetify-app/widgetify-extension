import { type MessageKey, t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import { formatClock, formatNumber } from '../../utils/format'
import {
	jalaliDateParts,
	jalaliMonthCells,
	jalaliWeekdayInitials,
} from '../../utils/jalali-calendar'
import { SunsetSea } from '../sunset-sea'

const GLASS_CLASS =
	'absolute rounded-2xl border border-image-line bg-image-fill backdrop-blur-md'

const FORECAST = [25, 26, 26, 25]

const CALLOUTS: { key: MessageKey; place: string }[] = [
	{ key: 'setting.vip.videoShort', place: 'top-13.5 left-4 [animation-delay:750ms]' },
	{
		key: 'setting.vip.calloutDuplicate',
		place: 'top-25 right-5 [animation-delay:900ms]',
	},
	{
		key: 'setting.vip.calloutSizes',
		place: 'top-41.5 left-5.5 [animation-delay:1050ms]',
	},
	{
		key: 'setting.vip.calloutSync',
		place: 'top-47 right-5.5 [animation-delay:1200ms]',
	},
]

function greetingKey(hour: number): MessageKey {
	if (hour >= 5 && hour < 12) return 'setting.vip.previewMorning'
	if (hour >= 12 && hour < 16) return 'setting.vip.previewNoon'
	if (hour >= 16 && hour < 20) return 'setting.vip.previewEvening'
	return 'setting.vip.previewNight'
}

interface ProNewTabProps {
	now: Date
	showCallouts: boolean
}

export function ProNewTab({ now, showCallouts }: ProNewTabProps) {
	const date = jalaliDateParts(now)
	const greeting = greetingKey(now.getHours())
	const gregorianMonth = new Intl.DateTimeFormat('fa-IR-u-ca-gregory', {
		month: 'long',
		year: 'numeric',
	}).format(now)

	return (
		<div className="absolute inset-0 text-image-fg">
			<SunsetSea detailed />

			<div className="absolute flex items-center gap-2 px-3 text-xs font-bold border rounded-full top-4 left-4 h-7.5 bg-scrim border-image-line">
				<span className="rounded-full size-2 bg-danger animate-pro-rec" />
				{t('setting.vip.previewVideo')}
			</div>

			<div className="absolute flex gap-2 top-4 right-4">
				{[
					{ city: t('setting.vip.previewTehran'), zone: 'Asia/Tehran' },
					{ city: t('setting.vip.previewIstanbul'), zone: 'Europe/Istanbul' },
				].map((clock) => (
					<div
						key={clock.zone}
						className={cn(
							GLASS_CLASS,
							'relative flex flex-col justify-between w-29 h-19 px-3 py-2.5 leading-tight'
						)}
					>
						<span className="font-bold text-2xs text-image-fg-muted">
							{clock.city}
						</span>
						<span className="text-2xl font-extrabold">
							{formatClock(now, clock.zone)}
						</span>
					</div>
				))}
			</div>

			<div className="absolute inset-x-0 text-2xl font-black text-center top-10 [text-shadow:0_2px_14px_var(--color-scrim-soft)]">
				{t(greeting)}
			</div>

			<div
				className={cn(
					GLASS_CLASS,
					'flex items-center gap-2 px-4 text-xs font-medium rounded-full top-23.5 left-1/2 -ml-42.5 w-85 h-10.5'
				)}
			>
				<Icon name="search" size={16} />
				<span className="text-image-fg-muted">
					{t('setting.vip.previewSearch')}
				</span>
			</div>

			<div
				className={cn(
					GLASS_CLASS,
					'flex flex-col justify-between left-4 bottom-4 w-57.5 h-33 px-3.5 py-3 leading-tight'
				)}
			>
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<span className="text-xs font-bold text-image-fg-muted">
							{t('setting.vip.previewTehran')}
						</span>
						<span className="text-4xl font-black">
							{t('setting.vip.previewDegrees', { value: formatNumber(24) })}
						</span>
						<span className="text-2xs text-image-fg-muted">
							{t('setting.vip.previewSunny')}
						</span>
					</div>
					<svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
						<g
							stroke="#ffd166"
							strokeWidth="3"
							strokeLinecap="round"
							className="[transform-box:fill-box] origin-center animate-pro-sun-rays"
						>
							<path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2" />
						</g>
						<circle cx="24" cy="24" r="9" fill="#ffd166" />
					</svg>
				</div>
				<div className="flex justify-between pt-1.5 font-bold border-t text-3xs border-image-line">
					{FORECAST.map((value, index) => (
						<span key={index}>
							{t('setting.vip.previewForecast', {
								hour: formatNumber((now.getHours() + index + 1) % 24),
								value: formatNumber(value),
							})}
						</span>
					))}
				</div>
			</div>

			<div
				className={cn(
					GLASS_CLASS,
					'left-64.5 bottom-4 w-49 px-3 py-2.5 leading-none'
				)}
			>
				<div className="flex items-center justify-between mb-2 text-xs font-extrabold">
					<span>
						{t('setting.vip.previewMonth', {
							month: date.month,
							year: date.year,
						})}
					</span>
					<span className="font-semibold text-3xs text-image-fg-muted">
						{gregorianMonth}
					</span>
				</div>
				<div className="grid grid-cols-7 mb-1 font-bold text-center text-4xs text-image-fg-muted">
					{jalaliWeekdayInitials().map((initial) => (
						<span key={initial}>{initial}</span>
					))}
				</div>
				<div className="grid grid-cols-7 text-center gap-y-0.5 text-3xs">
					{jalaliMonthCells(now).map((cell, index) => (
						<span
							key={index}
							className={cn(
								'flex items-center justify-center h-4.25 rounded-full',
								cell.isToday
									? 'bg-image-fg font-black text-vip'
									: cell.isFriday
										? 'font-semibold text-[#ffc2b8]'
										: 'font-semibold'
							)}
						>
							{cell.day === null ? '' : formatNumber(cell.day)}
						</span>
					))}
				</div>
			</div>

			<div
				className={cn(
					GLASS_CLASS,
					'flex flex-col gap-1.5 right-4 bottom-4 w-47.5 h-28 px-3 py-2.5 leading-tight'
				)}
			>
				<span className="text-xs font-extrabold">
					{t('setting.vip.previewTodos')}
				</span>
				<span className="flex items-center gap-2 font-semibold text-2xs">
					<span className="grid rounded-sm size-3.5 place-items-center bg-image-fg text-vip">
						<Icon name="check" size={10} strokeWidth={4} />
					</span>
					<span className="line-through text-image-fg-muted">
						{t('setting.vip.previewTodoMeeting')}
					</span>
				</span>
				{(
					[
						'setting.vip.previewTodoBook',
						'setting.vip.previewTodoWalk',
					] as const
				).map((key) => (
					<span
						key={key}
						className="flex items-center gap-2 font-semibold text-2xs"
					>
						<span className="rounded-sm size-3.5 border-[1.5px] border-image-fg-muted" />
						{t(key)}
					</span>
				))}
			</div>

			{showCallouts &&
				CALLOUTS.map((callout) => (
					<span
						key={callout.key}
						className={cn(
							'absolute inline-flex items-center gap-1.5 h-7 px-3 text-xs font-extrabold rounded-full shadow-lg whitespace-nowrap bg-image-fg text-vip animate-pro-pop',
							callout.place
						)}
					>
						<span className="rounded-full size-1.5 bg-vip" />
						{t(callout.key)}
					</span>
				))}
		</div>
	)
}
