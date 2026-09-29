import jalaliMoment from 'jalali-moment'
import { cn } from '@/common/utils/cn'
import { DatePicker, SectionPanel, TabNavigation, TextInput } from '@/components/ui'
import { useFreeWidgets } from '@/features/widgets/widgets.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/icons'
import { WidgetSettingWrapper } from '@/features/widgets/components/widget-settings-wrapper'
import { getCurrentDate } from '@/common/utils/date-events'
import { toIsoDateKey } from '@/features/widgets/utils/jalali-date'
import {
	DOT_CALENDAR_VARIANT_LABEL,
	GOAL_DATE_FORMAT,
	GOAL_TITLE_MAX_LENGTH,
	GOAL_TITLE_SAVE_DEBOUNCE_MS,
} from './constants'
import type { DotCalendarMeta, DotCalendarVariant } from './types'
import { getGoalProgress } from './utils/get-goal-progress'
import { getYearProgress } from './utils/get-year-progress'
import { isGoalDateAllowed } from './utils/is-goal-date-allowed'
import { normalizeDotCalendarVariant } from './utils/normalize-variant'

interface DotCalendarSettingProps {
	instanceId?: string
}

export function DotCalendarSetting({ instanceId }: DotCalendarSettingProps = {}) {
	const { runtimeLayout, updateWidgetSettings } = useFreeWidgets()
	const { selected_timezone: timezone } = useGeneralSetting()
	const targetWidget = instanceId
		? runtimeLayout.find((w) => w.instanceId === instanceId)
		: null

	if (!instanceId || !targetWidget) {
		return (
			<WidgetSettingWrapper>
				<p className="text-sm leading-relaxed text-muted">
					اول ویجت رو به صفحه اضافه کن، بعد از منوی خود ویجت تنظیمش کن.
				</p>
			</WidgetSettingWrapper>
		)
	}

	const meta = (targetWidget.meta ?? {}) as DotCalendarMeta
	const variant = normalizeDotCalendarVariant(meta.variant)
	const today = getCurrentDate(timezone.value).startOf('day')
	const yearProgress = getYearProgress(today)
	const goalProgress = getGoalProgress(meta.goalStartDate, meta.goalEndDate, today)
	const goalDate = meta.goalEndDate
		? jalaliMoment(meta.goalEndDate, GOAL_DATE_FORMAT).locale('fa')
		: undefined

	const saveMeta = (next: Partial<DotCalendarMeta>) => {
		updateWidgetSettings(instanceId, { ...meta, ...next })
	}

	const onSelectGoalDate = (date: jalaliMoment.Moment) => {
		if (!isGoalDateAllowed(date, today)) return

		saveMeta({
			goalStartDate: toIsoDateKey(today),
			goalEndDate: toIsoDateKey(date),
		})
	}

	return (
		<WidgetSettingWrapper>
			<div className="flex flex-col gap-3">
				<TabNavigation<DotCalendarVariant>
					tabMode="simple"
					activeTab={variant}
					onTabClick={(tab) => saveMeta({ variant: tab })}
					tabs={[
						{
							id: 'year',
							label: DOT_CALENDAR_VARIANT_LABEL.year,
							icon: <Icon name="calendarDays" size={14} />,
						},
						{
							id: 'goal',
							label: DOT_CALENDAR_VARIANT_LABEL.goal,
							icon: <Icon name="target" size={14} />,
						},
					]}
					size="medium"
					className="w-full"
				/>

				<div className="grid">
					<div
						className={cn(
							'col-start-1 row-start-1',
							variant !== 'year' && 'invisible'
						)}
					>
						<SectionPanel title="روزهای سال" size="xs">
							<p className="text-xs leading-relaxed text-muted">
								هر روز امسال یک نقطه است؛ روزهای گذشته پررنگ‌اند و امروز با
								یک حلقه مشخص می‌شه.
							</p>
							<p className="mt-2 text-xs text-content">
								{`${yearProgress.passedDays.toLocaleString('fa-IR')} روز از سال ${yearProgress.year.toLocaleString('fa-IR', { useGrouping: false })} گذشته و ${yearProgress.daysLeft.toLocaleString('fa-IR')} روز مانده.`}
							</p>
						</SectionPanel>
					</div>

					<div
						className={cn(
							'flex flex-col gap-3 col-start-1 row-start-1',
							variant !== 'goal' && 'invisible'
						)}
					>
						<SectionPanel
							title={
								<label htmlFor="dot-calendar-goal-title">عنوان هدف</label>
							}
							size="xs"
						>
							<TextInput
								id="dot-calendar-goal-title"
								size="sm"
								defaultValue={meta.goalTitle ?? ''}
								onChange={(value) =>
									saveMeta({ goalTitle: value.trim() })
								}
								debounce
								debounceTime={GOAL_TITLE_SAVE_DEBOUNCE_MS}
								maxLength={GOAL_TITLE_MAX_LENGTH}
								placeholder="مثلا: کنکور، سفر، تولد..."
							/>
						</SectionPanel>

						<SectionPanel title="تاریخ هدف" size="xs">
							<DatePicker
								size="lg"
								selectedDate={goalDate}
								onDateSelect={onSelectGoalDate}
								isDateDisabled={(date) => !isGoalDateAllowed(date, today)}
							/>
							<p aria-live="polite" className="mt-2 text-xs text-muted">
								{goalProgress && goalDate
									? `${goalProgress.daysLeft.toLocaleString('fa-IR')} روز مانده تا ${goalDate.format('jD jMMMM jYYYY')}`
									: 'از فردا تا یک سال بعد رو می‌تونی انتخاب کنی.'}
							</p>
						</SectionPanel>
					</div>
				</div>
			</div>
		</WidgetSettingWrapper>
	)
}
