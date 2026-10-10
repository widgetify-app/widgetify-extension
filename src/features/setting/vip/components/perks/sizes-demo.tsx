import { t } from '@/common/i18n'
import { formatNumber } from '../../utils/format'

const STAGE_CLASS = 'absolute inset-x-0 top-0 bottom-11 flex items-center justify-center'

const WIDGET_CLASS =
	'border shadow-md bg-surface border-line text-fg-strong leading-tight animate-pro-size-cycle'

const FORECAST = [
	{ day: 12, value: 25 },
	{ day: 13, value: 26 },
	{ day: 14, value: 26 },
	{ day: 15, value: 24 },
]

const SIZE_LABELS = [
	'setting.vip.sizeSmall',
	'setting.vip.sizeMedium',
	'setting.vip.sizeLarge',
] as const

function Sun({ size }: { size: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
			<circle cx="12" cy="12" r="4" className="fill-warning" />
			<path
				d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"
				strokeWidth="2"
				strokeLinecap="round"
				fill="none"
				className="stroke-warning"
			/>
		</svg>
	)
}

export function SizesDemo() {
	const city = t('setting.vip.previewTehran')
	const condition = t('setting.vip.previewSunny')
	const degrees = t('setting.vip.previewDegrees', { value: formatNumber(24) })

	return (
		<>
			<div className={STAGE_CLASS}>
				<div
					className={`${WIDGET_CLASS} flex items-center gap-2.5 h-12 px-4.5 rounded-full opacity-0`}
				>
					<Sun size={22} />
					<span className="text-lg font-black">{degrees}</span>
					<span className="text-xs font-semibold text-fg-muted">
						{t('setting.vip.sizesCity', { city, condition })}
					</span>
				</div>
			</div>
			<div className={STAGE_CLASS}>
				<div
					className={`${WIDGET_CLASS} flex flex-col justify-between p-3 w-28 h-27 rounded-2xl [animation-delay:2s]`}
				>
					<span className="flex items-center justify-between">
						<span className="font-bold text-2xs text-fg-muted">{city}</span>
						<Sun size={22} />
					</span>
					<span className="text-3xl font-black">{degrees}</span>
					<span className="text-2xs text-fg-muted">{condition}</span>
				</div>
			</div>
			<div className={STAGE_CLASS}>
				<div
					className={`${WIDGET_CLASS} flex items-center gap-3.5 px-4 py-3 w-72.5 h-27 rounded-2xl opacity-0 [animation-delay:4s]`}
				>
					<span className="flex flex-col gap-0.5">
						<span className="font-bold text-2xs text-fg-muted">{city}</span>
						<span className="text-3xl font-black">{degrees}</span>
						<span className="text-2xs text-fg-muted">{condition}</span>
					</span>
					<span className="flex justify-between flex-1 border-s ps-3.5 border-line">
						{FORECAST.map((item) => (
							<span
								key={item.day}
								className="flex flex-col items-center gap-1.25 font-bold text-2xs text-fg-muted"
							>
								<span>{formatNumber(item.day)}</span>
								<span className="rounded-full size-3 bg-warning" />
								<span className="text-fg-strong">
									{t('setting.vip.previewDegrees', {
										value: formatNumber(item.value),
									})}
								</span>
							</span>
						))}
					</span>
				</div>
			</div>
			<div className="absolute flex rounded-full bottom-3 left-1/2 -ml-30 w-60 h-7.5 bg-fill-2">
				<span className="absolute rounded-full shadow-sm top-0.75 right-0.75 w-18.5 h-6 bg-surface [transform:translateX(-80px)] animate-pro-size-chip" />
				{SIZE_LABELS.map((key) => (
					<span
						key={key}
						className="relative w-20 text-xs font-bold leading-7.5 text-center text-fg-muted"
					>
						{t(key)}
					</span>
				))}
			</div>
		</>
	)
}
