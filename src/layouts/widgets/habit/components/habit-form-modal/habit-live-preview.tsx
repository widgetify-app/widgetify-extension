import React from 'react'
import { addOpacityToColor } from '@/common/color'
import {
	HABIT_FREQUENCY_OPTIONS,
	HABIT_UNIT_OPTIONS,
} from '@/common/constant/habit-options'
import { type HabitFrequency, HabitUnit } from '@/services/hooks/habit/habit.interface'
import { Icon } from '@/src/icons'

interface HabitLivePreviewProps {
	title: string
	emoji: string
	color: string
	target: number
	unit: HabitUnit
	customUnit?: string
	frequency: HabitFrequency
}

export const HabitLivePreview: React.FC<HabitLivePreviewProps> = React.memo(
	({ title, emoji, color, target, unit, customUnit, frequency }) => {
		const defaultUnitLabel =
			HABIT_UNIT_OPTIONS.find((opt) => opt.value === unit)?.label || ''
		const unitText = unit === HabitUnit.CUSTOM ? customUnit || '' : defaultUnitLabel
		const freqText =
			HABIT_FREQUENCY_OPTIONS.find((opt) => opt.value === frequency)?.label || ''
		const displayTitle = title.trim() || 'عنوان عادت'

		return (
			<div className="flex flex-col gap-1.5">
				<span className="text-xs font-bold text-muted">پیش‌نمایش</span>
				<div className="flex items-center justify-between p-3 border rounded-2xl border-base-content/15 bg-base-200/40">
					<div className="flex items-center min-w-0 gap-3">
						<div
							className="flex items-center justify-center w-10 h-10 text-xl rounded-xl shrink-0"
							style={{
								backgroundColor: addOpacityToColor(color, 0.15),
								border: `1.5px solid ${addOpacityToColor(color, 0.4)}`,
							}}
						>
							<span>{emoji || '💧'}</span>
						</div>

						<div className="flex flex-col min-w-0">
							<span className="text-sm font-bold truncate text-content">
								{displayTitle}
							</span>
							<span className="text-xs truncate text-muted">
								{`۰ از ${target} ${unitText} • ${freqText}`}
							</span>
						</div>
					</div>

					<div
						className="flex items-center justify-center w-8 h-8 border rounded-full cursor-default shrink-0"
						style={{
							borderColor: addOpacityToColor(color, 0.4),
							backgroundColor: addOpacityToColor(color, 0.15),
							color: color,
						}}
					>
						<Icon name="plus" size={14} />
					</div>
				</div>
			</div>
		)
	}
)

HabitLivePreview.displayName = 'HabitLivePreview'
