import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import {
	HABIT_COLOR_PRESETS,
	HABIT_COMPARISON_OPTIONS,
	HABIT_EMOJI_PRESETS,
	HABIT_FREQUENCY_OPTIONS,
	HABIT_UNIT_OPTIONS,
} from '@/common/constant/habit-options'
import { showToast } from '@/common/toast'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { SelectBox } from '@/components/selectbox/selectbox'
import { TextInput } from '@/components/text-input'
import { safeAwait } from '@/services/api'
import { useAddHabit } from '@/services/hooks/habit/add-habit.hook'
import {
	type CreateHabitInput,
	type Habit,
	HabitComparison,
	HabitFrequency,
	HabitUnit,
} from '@/services/hooks/habit/habit.interface'
import { useUpdateHabit } from '@/services/hooks/habit/update-habit.hook'
import { translateError } from '@/utils/translate-error'
import Tooltip from '@/components/toolTip'
import { BiInfoCircle } from 'react-icons/bi'

interface HabitFormModalProps {
	isOpen: boolean
	habit: Habit | null
	onClose: () => void
	onSaved: () => void
}

const defaultForm: CreateHabitInput = {
	title: '',
	emoji: HABIT_EMOJI_PRESETS[0],
	color: HABIT_COLOR_PRESETS[0],
	comparison: HabitComparison.AT_LEAST,
	unit: HabitUnit.TIMES,
	customUnit: '',
	target: 1,
	frequency: HabitFrequency.DAILY,
	frequencyCount: 1,
}

export function HabitFormModal({ isOpen, habit, onClose, onSaved }: HabitFormModalProps) {
	const isEdit = !!habit
	const [form, setForm] = useState<CreateHabitInput>(defaultForm)
	const { mutateAsync: addHabit, isPending: isAdding } = useAddHabit()
	const { mutateAsync: updateHabit, isPending: isUpdating } = useUpdateHabit()
	const isPending = isAdding || isUpdating

	useEffect(() => {
		if (!isOpen) return

		if (habit) {
			setForm({
				title: habit.title,
				emoji: habit.emoji || HABIT_EMOJI_PRESETS[0],
				color: habit.color || HABIT_COLOR_PRESETS[0],
				comparison: habit.comparison,
				unit: habit.unit,
				customUnit: habit.customUnit || '',
				target: habit.target,
				frequency: habit.frequency,
				frequencyCount: habit.frequencyCount,
			})
		} else {
			setForm(defaultForm)
		}
	}, [habit, isOpen])

	const updateField = <K extends keyof CreateHabitInput>(
		key: K,
		value: CreateHabitInput[K]
	) => {
		setForm((prev) => ({ ...prev, [key]: value }))
	}

	const handleSubmit = async () => {
		if (isPending) return

		if (!form.title.trim()) {
			showToast('عنوان عادت را وارد کنید.', 'error')
			return
		}

		if (form.unit === HabitUnit.CUSTOM && !form.customUnit?.trim()) {
			showToast('واحد دلخواه را وارد کنید.', 'error')
			return
		}

		const payload: CreateHabitInput = {
			...form,
			customUnit: form.unit === HabitUnit.CUSTOM ? form.customUnit : undefined,
			frequencyCount:
				form.frequency === HabitFrequency.DAILY ? 1 : form.frequencyCount || 1,
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
			size="md"
			closeOnBackdropClick={false}
			title={isEdit ? 'ویرایش عادت' : 'عادت جدید'}
		>
			<div className="flex flex-col gap-4">
				<div>
					<label className="block mb-1 text-xs text-muted">عنوان</label>
					<TextInput
						value={form.title}
						onChange={(value) => updateField('title', value)}
						placeholder="مثلا نوشیدن آب"
						direction="rtl"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block mb-1 text-xs text-muted">شکلک</label>
						<div className="grid grid-cols-5 gap-1.5  h-20 max-h-20 overflow-y-auto">
							{HABIT_EMOJI_PRESETS.map((emoji) => (
								<button
									key={emoji}
									type="button"
									onClick={() => updateField('emoji', emoji)}
									className={`flex items-center justify-center cursor-pointer w-8 h-8 text-base rounded-lg border transition-all ${
										form.emoji === emoji
											? 'border-primary bg-primary/10'
											: 'border-content bg-base-300/40'
									}`}
								>
									{emoji}
								</button>
							))}
						</div>
					</div>
					<div>
						<label className="block mb-1 text-xs text-muted">رنگ</label>
						<div className="grid grid-cols-5 gap-1.5  h-20 max-h-20 overflow-y-auto">
							{HABIT_COLOR_PRESETS.map((color) => (
								<button
									key={color}
									type="button"
									onClick={() => updateField('color', color)}
									className={`w-7 h-7 rounded-full cursor-pointer border-2 ${
										form.color === color
											? 'border-content scale-110'
											: 'border-transparent'
									}`}
									style={{ backgroundColor: color }}
								/>
							))}
						</div>
					</div>
				</div>

				<div className="p-3 border bg-base-200/50 rounded-xl border-base-300">
					<div className="grid grid-cols-2 gap-3 mb-3">
						<div>
							<div className="flex items-center gap-1 mb-1">
								<label className="text-xs text-muted">
									واحد اندازه‌گیری
								</label>
								<Tooltip content="واحد شمارش کار شما چیه؟ مثلاً 'لیوان' برای آب یا 'دقیقه' برای ورزش.">
									<BiInfoCircle
										name="info-circle"
										className="w-3 h-3 text-muted"
									/>
								</Tooltip>
							</div>
							<SelectBox
								options={HABIT_UNIT_OPTIONS}
								value={form.unit}
								onChange={(value) =>
									updateField('unit', value as HabitUnit)
								}
								className="!w-full h-8!"
							/>
						</div>
						<div>
							<div className="flex items-center gap-1 mb-1">
								<label className="text-xs text-muted">
									نحوه رسیدن به هدف
								</label>
								<Tooltip content="می‌خوای حداقل به این مقدار برسی یا دقیقاً همین مقدار؟">
									<BiInfoCircle
										name="info-circle"
										className="w-3 h-3 text-muted"
									/>
								</Tooltip>
							</div>
							<SelectBox
								options={HABIT_COMPARISON_OPTIONS}
								value={form.comparison}
								onChange={(value) =>
									updateField('comparison', value as HabitComparison)
								}
								className="!w-full h-8!"
							/>
						</div>
					</div>

					{form.unit === HabitUnit.CUSTOM && (
						<div className="mb-3">
							<TextInput
								value={form.customUnit}
								onChange={(value) => updateField('customUnit', value)}
								placeholder="نام واحد (مثلا: کیلومتر)"
								direction="rtl"
								className="h-8!"
							/>
						</div>
					)}

					<div className="grid grid-cols-2 gap-3">
						<div>
							<div className="flex items-center gap-1 mb-1">
								<label className="text-xs text-muted">مقدار هدف</label>
								<Tooltip content="یعنی می‌خوای در نهایت چقدر از اون واحد رو انجام بدی؟ مثلا اگه واحد رو 'لیوان' انتخاب کردی و اینجا عدد 8 رو بزنی، یعنی هدفت نوشیدن 8 لیوان آبه.">
									<BiInfoCircle
										name="info-circle"
										className="w-3 h-3 text-muted"
									/>
								</Tooltip>
							</div>
							<TextInput
								type="number"
								min={0}
								className="h-8!"
								value={String(form.target)}
								onChange={(value) =>
									updateField('target', Number(value) || 0)
								}
							/>
						</div>
						<div>
							<div className="flex items-center gap-1 mb-1">
								<label className="text-xs text-muted">تکرار برنامه</label>
								<Tooltip content="تعیین کن که می‌خوای این عادت رو به صورت روزانه پیگیری کنی یا قصد داری فقط در روزهای خاصی از هفته یا ماه انجامش بدی؟">
									<BiInfoCircle
										name="info-circle"
										className="w-3 h-3 text-muted"
									/>
								</Tooltip>
							</div>
							<SelectBox
								options={HABIT_FREQUENCY_OPTIONS}
								value={form.frequency}
								onChange={(value) =>
									updateField('frequency', value as HabitFrequency)
								}
								className="!w-full h-8!"
							/>
						</div>
					</div>

					{form.frequency !== HabitFrequency.DAILY && (
						<div className="mt-3">
							<div className="flex items-center gap-1 mb-1">
								<label className="text-xs text-muted">
									تعداد دفعات انجام
								</label>
								<Tooltip
									content={`توی هر ${form.frequency === HabitFrequency.WEEKLY ? 'هفته' : 'ماه'}، چند بار می‌خوای این کار رو تکرار کنی؟`}
								>
									<BiInfoCircle
										name="info-circle"
										className="w-3 h-3 text-muted"
									/>
								</Tooltip>
							</div>
							<TextInput
								type="number"
								min={1}
								value={String(form.frequencyCount || 1)}
								onChange={(value) =>
									updateField('frequencyCount', Number(value) || 1)
								}
								className="h-8!"
							/>
						</div>
					)}
				</div>

				<Button
					onClick={handleSubmit}
					size="md"
					isPrimary
					loading={isPending}
					className="w-full text-white border-none rounded-2xl"
				>
					{isEdit ? 'ذخیره تغییرات' : 'افزودن عادت'}
				</Button>
			</div>
		</Modal>
	)
}
