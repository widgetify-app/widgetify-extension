import { t } from '@/common/i18n'
import type { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'
import type { WidgetifyDate } from '@/common/utils/date-events'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { Icon } from '@/icons'
import { useReligiousTimes } from '../hooks/use-religious-times'
import { formatTimeLeft, minutesUntil, nextPrayerIndex } from '../utils/next-prayer'
import { ToolHeader } from './tool-header'

const DAILY_ZIKR: Record<string, string> = {
	شنبه: t('widgets.tools.religious.dhikrRabbilAlamin'),
	یک‌شنبه: t('widgets.tools.religious.dhikrDhalJalali'),
	دوشنبه: t('widgets.tools.religious.dhikrQadiAlHajat'),
	سه‌شنبه: t('widgets.tools.religious.dhikrArhamAlRahimin'),
	چهارشنبه: t('widgets.tools.religious.dhikrHayyQayyum'),
	پنج‌شنبه: t('widgets.tools.religious.dhikrLaIlaha'),
	جمعه: t('widgets.tools.religious.dhikrSalawat'),
}

interface ReligiousTimeProps {
	currentDate: WidgetifyDate
	tabs?: ReactNode
}

export function ReligiousTime({ currentDate, tabs }: ReligiousTimeProps) {
	const { times, cityName, isLoading, isError, refetch } =
		useReligiousTimes(currentDate)
	const weekDay = currentDate.format('dddd')
	const zikr = DAILY_ZIKR[weekDay]
	const now = new Date()
	const nextIndex = nextPrayerIndex(
		times.map((time) => time.value),
		now
	)

	return (
		<>
			<ToolHeader tabs={tabs} info={cityName} />

			{isLoading ? (
				<div aria-hidden="true" className="flex flex-col gap-px">
					{times.map((time) => (
						<div
							key={time.title}
							className="flex items-center gap-2.5 px-2 h-7"
						>
							<div className="rounded-sm size-3.5 skeleton" />
							<div className="w-16 h-2.5 rounded-sm skeleton" />
							<div className="w-10 h-2.5 ms-auto rounded-sm skeleton" />
						</div>
					))}
				</div>
			) : isError ? (
				<WidgetError
					message={t('widgets.tools.religious.loadError')}
					onRetry={() => refetch()}
				/>
			) : (
				<>
					<ul className="flex flex-col flex-1 min-h-0 gap-px">
						{times.map((time, index) => {
							const isNext = index === nextIndex
							return (
								<li
									key={time.title}
									className={cn(
										'flex items-center gap-2.5 px-2 text-xs rounded-xl min-h-7 text-fg',
										isNext && 'bg-brand-fill'
									)}
								>
									<Icon
										name={time.icon}
										size={14}
										aria-hidden="true"
										className={
											isNext ? 'text-brand' : 'text-fg-faint'
										}
									/>
									<span className="min-w-0 truncate">
										{time.title}
										{isNext && time.value && (
											<span className="font-semibold text-3xs text-brand">
												{' · '}
												{formatTimeLeft(
													minutesUntil(time.value, now)
												)}
											</span>
										)}
									</span>
									<time className="font-bold ms-auto tabular-nums text-fg-strong">
										{time.value}
									</time>
								</li>
							)
						})}
					</ul>

					{zikr && (
						<div className="flex flex-col flex-none gap-0.5 px-2.5 py-2 text-center rounded-xl bg-fill">
							<span className="text-sm font-semibold text-fg-strong">
								{zikr}
							</span>
							<span className="text-3xs text-fg-faint">
								{t('widgets.tools.religious.dhikrLabel')} {weekDay}
							</span>
						</div>
					)}
				</>
			)}
		</>
	)
}
