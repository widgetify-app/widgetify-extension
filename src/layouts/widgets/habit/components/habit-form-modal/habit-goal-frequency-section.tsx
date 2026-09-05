import React, { useCallback, useMemo } from 'react'
import {
	type HabitComparison,
	type HabitFrequency,
	HabitUnit,
} from '@/services/hooks/habit/habit.interface'
import {
	HABIT_COMPARISON_OPTIONS,
	HABIT_FREQUENCY_OPTIONS,
	HABIT_UNIT_OPTIONS,
} from '@/common/constant/habit-options'
import { Chip, Dropdown, type DropdownOption, TextInput } from '@/components/ui'
import { Icon } from '@/src/icons'

interface HabitGoalFrequencySectionProps {
	target: number
	unit: HabitUnit
	customUnit?: string
	frequency: HabitFrequency
	comparison: HabitComparison
	onChangeTarget: (val: number) => void
	onChangeUnit: (val: HabitUnit) => void
	onChangeCustomUnit?: (val: string) => void
	onChangeFrequency: (val: HabitFrequency) => void
	onChangeComparison: (val: HabitComparison) => void
}

const PRIMARY_UNIT_IDS: HabitUnit[] = [
	HabitUnit.TIMES,
	HabitUnit.MINUTES,
	HabitUnit.GLASSES,
	HabitUnit.PAGES,
]

const MORE_UNIT_IDS: HabitUnit[] = [HabitUnit.HOURS, HabitUnit.CUSTOM]

interface StepperCounterProps {
	target: number
	onDecrease: () => void
	onIncrease: () => void
}

const StepperCounter = React.memo<StepperCounterProps>(
	({ target, onDecrease, onIncrease }) => {
		return (
			<div className="flex items-center px-1.5 py-0.5 rounded-full bg-base-200">
				<button
					type="button"
					onClick={onDecrease}
					className="flex items-center justify-center w-5 h-5 text-sm cursor-pointer text-muted hover:text-content"
				>
					<Icon name="minus" size={12} />
				</button>
				<span className="px-1.5 text-xs font-bold text-center text-content min-w-5">
					{target}
				</span>
				<button
					type="button"
					onClick={onIncrease}
					className="flex items-center justify-center w-5 h-5 text-sm cursor-pointer text-muted hover:text-content"
				>
					<Icon name="plus" size={12} />
				</button>
			</div>
		)
	}
)
StepperCounter.displayName = 'StepperCounter'

interface UnitSelectionRowProps {
	unit: HabitUnit
	onChangeUnit: (val: HabitUnit) => void
}

const UnitSelectionRow = React.memo<UnitSelectionRowProps>(({ unit, onChangeUnit }) => {
	const primaryUnits = useMemo(
		() =>
			PRIMARY_UNIT_IDS.map((id) => ({
				id,
				label: HABIT_UNIT_OPTIONS.find((opt) => opt.value === id)?.label || '',
			})),
		[]
	)

	const moreUnits = useMemo(
		() =>
			MORE_UNIT_IDS.map((id) => ({
				id,
				label: HABIT_UNIT_OPTIONS.find((opt) => opt.value === id)?.label || '',
			})),
		[]
	)

	const isMoreUnitSelected = MORE_UNIT_IDS.includes(unit)
	const selectedMoreUnit = moreUnits.find((u) => u.id === unit)

	const moreUnitDropdownOptions: DropdownOption[] = useMemo(
		() =>
			moreUnits.map((opt) => ({
				id: opt.id,
				label: (
					<div className="flex items-center justify-between w-full px-1 text-xs">
						<span>{opt.label}</span>
						{unit === opt.id && (
							<Icon name="check" size={13} className="text-primary" />
						)}
					</div>
				),
				onClick: () => onChangeUnit(opt.id),
			})),
		[moreUnits, unit, onChangeUnit]
	)

	return (
		<div className="flex items-center gap-1.5 shrink-0">
			{primaryUnits.map((opt) => {
				const isSelected = unit === opt.id

				return (
					<Chip
						key={opt.id}
						selected={isSelected}
						onClick={() => onChangeUnit(opt.id)}
						className="px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
					>
						{opt.label}
					</Chip>
				)
			})}

			<Dropdown
				trigger={
					<Chip
						selected={isMoreUnitSelected}
						onClick={() => {}}
						className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
					>
						<span>
							{isMoreUnitSelected ? selectedMoreUnit?.label : 'بیشتر'}
						</span>
						<Icon name="chevronDown" size={12} />
					</Chip>
				}
				options={moreUnitDropdownOptions}
				position="bottom-left"
				width="8rem"
			/>
		</div>
	)
})
UnitSelectionRow.displayName = 'UnitSelectionRow'

interface FrequencyComparisonRowProps {
	frequency: HabitFrequency
	comparison: HabitComparison
	onChangeFrequency: (val: HabitFrequency) => void
	onChangeComparison: (val: HabitComparison) => void
}

const FrequencyComparisonRow = React.memo<FrequencyComparisonRowProps>(
	({ frequency, comparison, onChangeFrequency, onChangeComparison }) => {
		const comparisonDropdownOptions: DropdownOption[] = useMemo(
			() =>
				HABIT_COMPARISON_OPTIONS.map((opt) => ({
					id: opt.value,
					label: (
						<div className="flex items-center justify-between w-full px-1 text-xs">
							<span>{opt.label}</span>
							{comparison === opt.value && (
								<Icon name="check" size={13} className="text-primary" />
							)}
						</div>
					),
					onClick: () => onChangeComparison(opt.value as HabitComparison),
				})),
			[comparison, onChangeComparison]
		)

		const currentComparisonLabel =
			HABIT_COMPARISON_OPTIONS.find((c) => c.value === comparison)?.label || 'حداقل'

		return (
			<div className="flex items-center justify-between pt-3">
				<div className="flex items-center gap-2">
					<span className="text-xs font-bold text-content">تکرار</span>
					<div className="flex items-center gap-1.5">
						{HABIT_FREQUENCY_OPTIONS.map((freqOpt) => (
							<Chip
								key={freqOpt.value}
								selected={frequency === freqOpt.value}
								onClick={() =>
									onChangeFrequency(freqOpt.value as HabitFrequency)
								}
								className="px-3 py-1 text-xs font-medium rounded-full"
							>
								{freqOpt.label}
							</Chip>
						))}
					</div>
				</div>

				<Dropdown
					trigger={
						<div className="flex items-center gap-1 text-xs cursor-pointer text-muted hover:text-content">
							<span className="text-xs">{currentComparisonLabel}</span>
							<Icon name="chevronDown" size={14} />
						</div>
					}
					options={comparisonDropdownOptions}
					position="bottom-left"
					width="9rem"
				/>
			</div>
		)
	}
)
FrequencyComparisonRow.displayName = 'FrequencyComparisonRow'

export const HabitGoalFrequencySection: React.FC<HabitGoalFrequencySectionProps> =
	React.memo(
		({
			target,
			unit,
			customUnit = '',
			frequency,
			comparison,
			onChangeTarget,
			onChangeUnit,
			onChangeCustomUnit,
			onChangeFrequency,
			onChangeComparison,
		}) => {
			const handleDecrease = useCallback(() => {
				if (target > 1) {
					onChangeTarget(target - 1)
				}
			}, [target, onChangeTarget])

			const handleIncrease = useCallback(() => {
				onChangeTarget(target + 1)
			}, [target, onChangeTarget])

			return (
				<div className="flex flex-col p-3 border divide-y rounded-2xl border-base-content/15 bg-base-200/30 divide-base-content/10 gap-y-3">
					<div className="flex items-center justify-between gap-2 pb-1">
						<div className="flex items-center gap-2.5 shrink-0">
							<span className="text-xs font-bold text-content whitespace-nowrap">
								هدف روزانه
							</span>
							<StepperCounter
								target={target}
								onDecrease={handleDecrease}
								onIncrease={handleIncrease}
							/>
						</div>

						<UnitSelectionRow unit={unit} onChangeUnit={onChangeUnit} />
					</div>

					{unit === HabitUnit.CUSTOM && onChangeCustomUnit && (
						<div className="flex items-center gap-2 py-1">
							<span className="text-xs text-muted shrink-0">
								نام واحد دلخواه:
							</span>
							<TextInput
								value={customUnit}
								onChange={(val) => onChangeCustomUnit(val)}
								placeholder="مثال: کیلومتر، ست، فنجان"
								size="sm"
								className="flex-1 text-xs"
							/>
						</div>
					)}

					<FrequencyComparisonRow
						frequency={frequency}
						comparison={comparison}
						onChangeFrequency={onChangeFrequency}
						onChangeComparison={onChangeComparison}
					/>
				</div>
			)
		},
	)

HabitGoalFrequencySection.displayName = 'HabitGoalFrequencySection'
