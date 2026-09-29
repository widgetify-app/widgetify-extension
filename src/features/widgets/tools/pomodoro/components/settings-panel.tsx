import type React from 'react'
import { useId } from 'react'
import { Button, Checkbox } from '@/components/ui'
import { Modal } from '@/components/ui'
import { TextInput } from '@/components/ui'
import type { PomodoroSettings } from '../types'

interface SettingInputProps {
	label: string
	value: number
	onChange: (value: number) => void
	max: number
}

const SettingInput: React.FC<SettingInputProps> = ({ label, value, onChange, max }) => {
	const inputId = useId()

	return (
		<div className="flex items-center justify-between gap-3 p-2 border-surface-3 bg-surface-3 rounded-2xl">
			<label
				htmlFor={inputId}
				className="flex-1 text-sm font-medium text-fg-strong"
			>
				{label}
			</label>
			<div className="relative w-20">
				<TextInput
					id={inputId}
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
				<span className="absolute text-xs -translate-y-1/2 right-2 top-1/2 text-fg-faint">
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
		<Modal isOpen={isOpen} onClose={onClose} title="تنظیمات تایمر پومودورو">
			<div className={'rounded-xl'}>
				<h4
					className={
						'pb-2 text-sm font-medium text-fg-strong border-b border-surface-3'
					}
				>
					تنظیمات زمان (دقیقه)
				</h4>

				<div className="my-2 flex gap-2 flex-col">
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
					<Checkbox
						checked={settings.alarmEnabled}
						onChange={() =>
							handleSettingChange('alarmEnabled', !settings.alarmEnabled)
						}
					>
						<span>
							<span className="block font-medium text-fg">
								فعال‌سازی هشدار صوتی
							</span>
							<span className="block text-sm font-light text-fg-muted">
								با فعال‌سازی این گزینه، در پایان هر دوره کاری، یک هشدار
								صوتی پخش خواهد شد.
							</span>
						</span>
					</Checkbox>
				</div>
				<div className="text-center">
					<Button
						size="md"
						onClick={handleSaveAndClose}
						color={'brand'}
						rounded={'2xl'}
						className="w-full"
					>
						ذخیره و بستن
					</Button>
				</div>
			</div>
		</Modal>
	)
}
