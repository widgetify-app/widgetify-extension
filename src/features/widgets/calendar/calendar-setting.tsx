import type { ReactNode } from 'react'
import { moodOptions } from '@/common/constants/moods'
import { cn } from '@/common/utils/cn'
import { ToggleSwitch } from '@/components/ui'
import { WidgetSettingWrapper } from '@/features/widgets/components/widget-settings-wrapper'
import type { WidgetSize } from '@/features/widgets/utils/layout-engine/types'
import { useFreeWidgets } from '@/features/widgets/widgets.context'
import type { CalendarMeta } from './types'
import { normalizeCalendarDisplay } from './utils/normalize-calendar-display'

const PREVIEW_MOOD = moodOptions[moodOptions.length - 1]

interface CalendarSettingProps {
	instanceId?: string
	size?: WidgetSize
}

export function CalendarSetting({ instanceId, size }: CalendarSettingProps = {}) {
	const { runtimeLayout, updateWidgetSettings } = useFreeWidgets()
	const targetWidget = instanceId
		? runtimeLayout.find((widget) => widget.instanceId === instanceId)
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

	const meta = (targetWidget.meta ?? {}) as CalendarMeta
	const { showEvents, showMoods } = normalizeCalendarDisplay(meta)
	const isTodayOnly = size?.w === 1 && size?.h === 1

	const save = (next: CalendarMeta) => {
		updateWidgetSettings(instanceId, { ...meta, ...next })
	}

	return (
		<WidgetSettingWrapper>
			<div className="flex flex-col gap-3">
				<p className="text-xs leading-relaxed text-fg-muted">
					انتخاب کن روی روزهای تقویم چی دیده بشه. با کلیک روی هر روز، همه‌ی
					رویدادها و حالش رو می‌بینی.
				</p>

				{isTodayOnly && (
					<p className="px-3 py-2 leading-relaxed rounded-xl bg-fill text-2xs text-fg-muted">
						این‌ها روی اندازه‌های ۲×۱ و ۲×۳ دیده می‌شن؛ ۱×۱ فقط امروز رو نشون
						می‌ده.
					</p>
				)}

				<ul className="flex flex-col gap-2">
					<DisplayOption
						title="رویدادها"
						description="یه نقطه زیر روزی که مناسبت داره؛ قرمز اگه تعطیل رسمیه."
						preview={<DayPreview showDot={showEvents} />}
						enabled={showEvents}
						onToggle={() => save({ showEvents: !showEvents })}
					/>
					<DisplayOption
						title="حال روز"
						description="دور روزهایی که حالت رو ثبت کردی، به رنگ همون حال."
						preview={<DayPreview showMood={showMoods} />}
						enabled={showMoods}
						onToggle={() => save({ showMoods: !showMoods })}
					/>
				</ul>
			</div>
		</WidgetSettingWrapper>
	)
}

interface DisplayOptionProps {
	title: string
	description: string
	preview: ReactNode
	enabled: boolean
	onToggle: () => void
}

function DisplayOption({
	title,
	description,
	preview,
	enabled,
	onToggle,
}: DisplayOptionProps) {
	return (
		<li className="flex items-center gap-3 p-3 rounded-2xl bg-fill">
			{preview}
			<div className="flex flex-col flex-1 min-w-0 gap-0.5">
				<span className="text-sm font-semibold text-fg-strong">{title}</span>
				<span className="text-xs leading-relaxed text-fg-muted">
					{description}
				</span>
			</div>
			<ToggleSwitch
				label={`نشون دادن ${title} روی تقویم`}
				enabled={enabled}
				onToggle={onToggle}
			/>
		</li>
	)
}

interface DayPreviewProps {
	showDot?: boolean
	showMood?: boolean
}

function DayPreview({ showDot = false, showMood = false }: DayPreviewProps) {
	return (
		<span
			aria-hidden="true"
			className="relative grid rounded-xl place-items-center size-11 shrink-0 bg-surface"
		>
			<span
				className={cn(
					'grid text-xs font-semibold border-2 rounded-full size-7 place-items-center tabular-nums text-fg transition-ui',
					showMood ? PREVIEW_MOOD.borderClass : 'border-transparent'
				)}
			>
				12
			</span>
			<span
				className={cn(
					'absolute rounded-full bottom-1.5 size-1 transition-ui',
					showDot ? 'bg-fg-faint' : 'bg-transparent'
				)}
			/>
		</span>
	)
}
