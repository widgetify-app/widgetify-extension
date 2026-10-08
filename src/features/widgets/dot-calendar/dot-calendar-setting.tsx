import jalaliMoment from 'jalali-moment'
import Analytics from '@/analytics'
import { DatePicker, SectionPanel, TextInput } from '@/components/ui'
import { useFreeWidgets } from '@/features/widgets/widgets.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { WidgetSettingWrapper } from '@/features/widgets/components/widget-settings-wrapper'
import { getCurrentDate } from '@/common/utils/date-events'
import { toIsoDateKey } from '@/features/widgets/utils/jalali-date'
import {
	GOAL_DATE_FORMAT,
	GOAL_TITLE_MAX_LENGTH,
	GOAL_TITLE_SAVE_DEBOUNCE_MS,
} from './constants'
import type { DotCalendarMeta } from './types'
import { getGoalProgress } from './utils/get-goal-progress'
import { isGoalDateAllowed } from './utils/is-goal-date-allowed'
import { normalizeDotCalendarMeta } from './utils/normalize-meta'

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
				<p className="text-sm leading-relaxed text-fg-muted">
					اول ویجت رو به صفحه اضافه کن، بعد از منوی خود ویجت تنظیمش کن.
				</p>
			</WidgetSettingWrapper>
		)
	}

	const storedMeta = (targetWidget.meta ?? {}) as DotCalendarMeta
	const { goalTitle, goalStartDate, goalEndDate } = normalizeDotCalendarMeta(storedMeta)
	const today = getCurrentDate(timezone.value).startOf('day')
	const progress = getGoalProgress(goalStartDate, goalEndDate, today)
	const parsedGoalDate = goalEndDate
		? jalaliMoment(goalEndDate, GOAL_DATE_FORMAT, true)
		: null
	const goalDate = parsedGoalDate?.isValid() ? parsedGoalDate.locale('fa') : undefined

	const saveMeta = (next: Partial<DotCalendarMeta>) => {
		updateWidgetSettings(instanceId, { ...storedMeta, ...next })
	}

	const onSelectGoalDate = (date: jalaliMoment.Moment) => {
		if (!isGoalDateAllowed(date, today)) return

		Analytics.event('dot_calendar_goal_date_set')
		saveMeta({
			goalStartDate: toIsoDateKey(today),
			goalEndDate: toIsoDateKey(date),
		})
	}

	const dateHint =
		progress && goalDate
			? progress.daysLeft > 0
				? `${progress.daysLeft.toLocaleString('fa-IR')} روز مونده تا ${goalDate.format('jD jMMMM jYYYY')}`
				: 'روز هدفت رسیده؛ یه روز تازه انتخاب کن'
			: 'از فردا تا یه سال بعد رو می‌تونی انتخاب کنی'

	return (
		<WidgetSettingWrapper>
			<div className="flex flex-col gap-3">
				<SectionPanel
					title={<label htmlFor="dot-calendar-goal-title">اسم هدف</label>}
					size="xs"
				>
					<TextInput
						id="dot-calendar-goal-title"
						size="sm"
						defaultValue={goalTitle}
						onChange={(value) => saveMeta({ goalTitle: value.trim() })}
						debounce
						debounceTime={GOAL_TITLE_SAVE_DEBOUNCE_MS}
						maxLength={GOAL_TITLE_MAX_LENGTH}
						placeholder="مثلاً کنکور، سفر یا تولد"
					/>
				</SectionPanel>

				<SectionPanel title="روز هدف" size="xs">
					<DatePicker
						size="lg"
						selectedDate={goalDate}
						onDateSelect={onSelectGoalDate}
						isDateDisabled={(date) => !isGoalDateAllowed(date, today)}
					/>
					<p aria-live="polite" className="mt-2 text-xs text-fg-muted">
						{dateHint}
					</p>
				</SectionPanel>
			</div>
		</WidgetSettingWrapper>
	)
}
