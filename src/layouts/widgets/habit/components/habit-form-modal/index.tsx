import { useCallback, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { HABIT_COLOR_PRESETS, HABIT_EMOJI_PRESETS } from '@/common/constant/habit-options'
import { showToast } from '@/common/toast'
import { Modal, TextInput } from '@/components/ui'
import {
	type CreateHabitInput,
	type Habit,
	HabitComparison,
	HabitFrequency,
	HabitUnit,
} from '@/services/hooks/habit/habit.interface'
import { useAddHabit } from '@/services/hooks/habit/add-habit.hook'
import { useUpdateHabit } from '@/services/hooks/habit/update-habit.hook'
import type { HabitIcon } from '@/services/hooks/habit/get-habits.hook'
import { addOpacityToColor } from '@/common/color'
import { safeAwait } from '@/services/api'
import { translateError } from '@/common/utils/translate-error'
import { HabitFormActions } from './habit-form-actions'
import { HABIT_QUICK_PRESETS, type HabitPresetItem } from './habit-form.constants'
import { HabitFormHeader } from './habit-form-header'
import { HabitFormPresets } from './habit-form-presets'
import { HabitGoalFrequencySection } from './habit-goal-frequency-section'
import { HabitIconColorPicker } from './habit-icon-color-picker'
import { HabitLivePreview } from './habit-live-preview'

export interface HabitFormModalProps {
	isOpen: boolean
	habit: Habit | null
	onClose: () => void
	onSaved: () => void
	icons: HabitIcon[]
	colors: string[]
}

export const HabitFormModal: React.FC<HabitFormModalProps> = ({
	isOpen,
	onClose,
	onSaved,
	habit,
}) => {
	const isEdit = Boolean(habit)

	const [title, setTitle] = useState('')
	const [emoji, setEmoji] = useState(HABIT_EMOJI_PRESETS[0] || '💧')
	const [color, setColor] = useState(HABIT_COLOR_PRESETS[0] || '#3b82f6')
	const [comparison, setComparison] = useState<HabitComparison>(
		HabitComparison.AT_LEAST
	)
	const [unit, setUnit] = useState<HabitUnit>(HabitUnit.TIMES)
	const [customUnit, setCustomUnit] = useState('')
	const [target, setTarget] = useState(1)
	const [frequency, setFrequency] = useState<HabitFrequency>(HabitFrequency.DAILY)
	const [frequencyCount, setFrequencyCount] = useState(1)
	const [activePresetId, setActivePresetId] = useState<string | null>(null)

	const { mutateAsync: addHabit, isPending: isAdding } = useAddHabit()
	const { mutateAsync: updateHabit, isPending: isUpdating } = useUpdateHabit()
	const isPending = isAdding || isUpdating

	useEffect(() => {
		if (!isOpen) return

		if (habit) {
			setTitle(habit.title)
			setEmoji(habit.emoji || HABIT_EMOJI_PRESETS[0])
			setColor(habit.color || HABIT_COLOR_PRESETS[0])
			setComparison(habit.comparison || HabitComparison.AT_LEAST)
			setUnit(habit.unit || HabitUnit.TIMES)
			setCustomUnit(habit.customUnit || '')
			setTarget(habit.target || 1)
			setFrequency(habit.frequency || HabitFrequency.DAILY)
			setFrequencyCount(habit.frequencyCount || 1)
			setActivePresetId(null)
		} else {
			setTitle('')
			setEmoji(HABIT_EMOJI_PRESETS[0] || '💧')
			setColor(HABIT_COLOR_PRESETS[0] || '#3b82f6')
			setComparison(HabitComparison.AT_LEAST)
			setUnit(HabitUnit.TIMES)
			setCustomUnit('')
			setTarget(1)
			setFrequency(HabitFrequency.DAILY)
			setFrequencyCount(1)
			setActivePresetId(null)
		}
	}, [habit, isOpen])

	const handleSelectPreset = useCallback((preset: HabitPresetItem) => {
		setActivePresetId(preset.id)
		setTitle(preset.values.title)
		setEmoji(preset.values.emoji || '💧')
		setColor(preset.values.color || '#3b82f6')
		setComparison(preset.values.comparison || HabitComparison.AT_LEAST)
		setUnit(preset.values.unit || HabitUnit.GLASSES)
		setCustomUnit(preset.values.customUnit || '')
		setTarget(preset.values.target || 1)
		setFrequency(preset.values.frequency || HabitFrequency.DAILY)
		setFrequencyCount(preset.values.frequencyCount || 1)
	}, [])

	const handleEmojiChange = useCallback((newEmoji: string) => {
		setEmoji(newEmoji)
		setActivePresetId(null)
	}, [])

	const handleColorChange = useCallback((newColor: string) => {
		setColor(newColor)
		setActivePresetId(null)
	}, [])

	const handleChangeUnit = useCallback((newUnit: HabitUnit) => {
		setUnit(newUnit)
	}, [])

	const handleChangeCustomUnit = useCallback((newCustomUnit: string) => {
		setCustomUnit(newCustomUnit)
	}, [])

	const handleChangeFrequency = useCallback((newFreq: HabitFrequency) => {
		setFrequency(newFreq)
	}, [])

	const handleChangeComparison = useCallback((newComp: HabitComparison) => {
		setComparison(newComp)
	}, [])

	const handleSubmit = async () => {
		if (!title.trim()) {
			showToast('عنوان عادت را وارد کنید.', 'error')
			return
		}

		if (unit === HabitUnit.CUSTOM && !customUnit.trim()) {
			showToast('واحد دلخواه را وارد کنید.', 'error')
			return
		}

		if (target <= 0) {
			showToast('هدف باید بزرگتر از صفر باشد', 'error')
			return
		}

		const payload: CreateHabitInput = {
			title: title.trim(),
			emoji,
			color,
			comparison,
			unit,
			customUnit: unit === HabitUnit.CUSTOM ? customUnit.trim() : undefined,
			target,
			frequency,
			frequencyCount: frequency === HabitFrequency.DAILY ? 1 : frequencyCount || 1,
		}

		const [error] = await safeAwait(
			isEdit ? updateHabit({ id: habit!.id, input: payload }) : addHabit(payload)
		)

		if (error) {
			showToast(translateError(error) as string, 'error')
			return
		}

		showToast(isEdit ? 'عادت ویرایش شد.' : 'عادت جدید اضافه شد.', 'success')
		Analytics.event(isEdit ? 'habit_updated' : 'habit_created')
		onSaved()
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			direction="rtl"
			size="lg"
			closeOnBackdropClick={false}
			showCloseButton={false}
		>
			<div className="flex flex-col gap-4 text-right select-none">
				<HabitFormHeader isEdit={isEdit} onClose={onClose} />

				{!isEdit && (
					<HabitFormPresets
						presets={HABIT_QUICK_PRESETS}
						activePresetId={activePresetId}
						onSelectPreset={handleSelectPreset}
					/>
				)}

				<div className="flex flex-col gap-1.5">
					<label className="text-xs text-muted">عنوان</label>
					<div className="flex items-center px-3 py-2 transition-colors border rounded-2xl border-base-content/15 bg-base-200/40 focus-within:border-primary">
						<div
							className="flex items-center justify-center w-8 h-8 text-lg transition-transform rounded-xl shrink-0"
							style={{
								backgroundColor: addOpacityToColor(color, 0.15),
								border: `1.5px solid ${addOpacityToColor(color, 0.4)}`,
							}}
						>
							<span>{emoji || '💧'}</span>
						</div>

						<TextInput
							value={title}
							onChange={(val) => {
								setTitle(val)
								setActivePresetId(null)
							}}
							placeholder="عنوان عادت (مثلا: نوشیدن آب)"
							className="flex-1 text-sm font-medium bg-transparent border-none shadow-none text-content placeholder:text-muted/60 focus:outline-none focus:ring-0"
						/>
					</div>
				</div>

				<HabitIconColorPicker
					selectedEmoji={emoji}
					selectedColor={color}
					onSelectEmoji={handleEmojiChange}
					onSelectColor={handleColorChange}
				/>

				<HabitGoalFrequencySection
					target={target}
					unit={unit}
					customUnit={customUnit}
					frequency={frequency}
					comparison={comparison}
					onChangeTarget={setTarget}
					onChangeUnit={handleChangeUnit}
					onChangeCustomUnit={handleChangeCustomUnit}
					onChangeFrequency={handleChangeFrequency}
					onChangeComparison={handleChangeComparison}
				/>

				<HabitLivePreview
					title={title}
					emoji={emoji}
					color={color}
					target={target}
					unit={unit}
					customUnit={customUnit}
					frequency={frequency}
				/>

				<HabitFormActions
					isEdit={isEdit}
					isPending={isPending}
					onClose={onClose}
					onSubmit={handleSubmit}
				/>
			</div>
		</Modal>
	)
}
