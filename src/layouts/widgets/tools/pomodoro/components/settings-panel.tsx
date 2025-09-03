import type React from 'react'
import { Button } from '@/components/button/button'
import CustomCheckbox from '@/components/checkbox'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import type { PomodoroSettings } from '../types'

interface SettingInputProps {
	label: string
	value: number
	onChange: (value: number) => void
	max: number
}

const SettingInput: React.FC<SettingInputProps> = ({ label, value, onChange, max }) => {
	return (
		<div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-base-200/30">
			<label className="flex-1 text-sm font-medium text-base-content">
				{label}
			</label>
			<div className="relative w-20">
				<TextInput
					type="number"
					value={String(value)}
					className="text-center"
					onChange={(newValue) => {
						const value = Number.parseInt(newValue, 10)
						if (value > 0 && value <= max) {
							onChange(value)
						}
					}}
				/>
				<span className="absolute text-xs -translate-y-1/2 right-2 top-1/2 text-base-content/50">
					<span>{max}</span>
					<span>/</span>
				</span>
			</div>
		</div>
	)
}

interface PomodoroSettingsPanelProps {
	isOpen: boolean
	onClose: () => void
	settings: PomodoroSettings
	onUpdateSettings: (newSettings: PomodoroSettings) => void
	onReset: () => void
}

export const PomodoroSettingsPanel: React.FC<PomodoroSettingsPanelProps> = ({
	isOpen,
	onClose,
	settings,
	onUpdateSettings,
	onReset,
}) => {
	const handleSettingChange = (key: keyof PomodoroSettings, value: any) => {
		onUpdateSettings({
			...settings,
			[key]: value,
		})
	}

	const handleSaveAndClose = () => {
		onClose()
		onReset()
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="تنظیمات تایمر پومودورو"
			direction="rtl"
		>
			<div className={'rounded-xl'}>
				<h4
					className={
						'pb-2 text-sm font-medium text-base-content border-b border-b-base-300'
					}
				>
					تنظیمات زمان (دقیقه)
				</h4>

				<div className="my-2">
					<SettingInput
						label="زمان کار:"
						value={settings.workTime}
						onChange={(value) => {
							handleSettingChange('workTime', value)
						}}
						max={90}
					/>

					<SettingInput
						label="استراحت کوتاه:"
						value={settings.shortBreakTime}
						onChange={(value) => {
							handleSettingChange('shortBreakTime', value)
						}}
						max={30}
					/>
					<div className="flex items-start gap-3">
						<CustomCheckbox
							checked={settings.alarmEnabled}
							onChange={() =>
								handleSettingChange(
									'alarmEnabled',
									!settings.alarmEnabled
								)
							}
						/>
						<div
							onClick={() =>
								handleSettingChange(
									'alarmEnabled',
									!settings.alarmEnabled
								)
							}
							className="cursor-pointer"
						>
							<p className={'font-medium text-content'}>
								فعال‌سازی هشدار صوتی
							</p>
							<p className={'text-sm font-light text-muted'}>
								با فعال‌سازی این گزینه، در پایان هر دوره کاری، یک هشدار
								صوتی پخش خواهد شد.
							</p>
						</div>
					</div>
				</div>
				<div className="text-center">
					<Button
						size="md"
						onClick={handleSaveAndClose}
						isPrimary={true}
						className="w-full rounded-xl"
					>
						ذخیره و بستن
					</Button>
				</div>
			</div>
		</Modal>
	)
}
