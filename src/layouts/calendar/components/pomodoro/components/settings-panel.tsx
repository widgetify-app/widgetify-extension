import { motion } from 'framer-motion'
import type React from 'react'
import Modal from '../../../../../components/modal'
import type { PomodoroSettings } from '../types'

interface SettingInputProps {
	label: string
	value: number
	onChange: (value: number) => void
	max: number
	getInputStyle: () => string
	theme: string
}

const SettingInput: React.FC<SettingInputProps> = ({
	label,
	value,
	onChange,
	max,
	getInputStyle,
	theme,
}) => {
	return (
		<div className="flex items-center justify-between">
			<label
				className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}
			>
				{label}
			</label>
			<input
				type="number"
				min="1"
				max={max}
				value={value}
				onChange={(e) => {
					const value = Number.parseInt(e.target.value)
					if (value > 0 && value <= max) {
						onChange(value)
					}
				}}
				className={`w-16 px-2 py-1 text-sm rounded border transition-colors ${getInputStyle()} ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}
			/>
		</div>
	)
}

interface PomodoroSettingsPanelProps {
	isOpen: boolean
	onClose: () => void
	settings: PomodoroSettings
	onUpdateSettings: (newSettings: PomodoroSettings) => void
	onReset: () => void
	getTextStyle: () => string
	getInputStyle: () => string
	theme: string
}

export const PomodoroSettingsPanel: React.FC<PomodoroSettingsPanelProps> = ({
	isOpen,
	onClose,
	settings,
	onUpdateSettings,
	onReset,
	getTextStyle,
	getInputStyle,
	theme,
}) => {
	const handleSettingChange = (key: keyof PomodoroSettings, value: number) => {
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
			closeOnBackdropClick={false}
			title="تنظیمات تایمر پومودورو"
			direction="rtl"
		>
			<motion.div
				initial={{ opacity: 0, height: 0 }}
				animate={{ opacity: 1, height: 'auto' }}
				exit={{ opacity: 0, height: 0 }}
				transition={{ duration: 0.3 }}
				className="mt-6 overflow-hidden"
			>
				<div className={'p-4 rounded-xl'}>
					<h4 className={`text-sm font-medium mb-3 ${getTextStyle()}`}>
						تنظیمات زمان (دقیقه)
					</h4>

					<div className="space-y-3">
						<SettingInput
							label="زمان کار:"
							value={settings.workTime}
							onChange={(value) => {
								handleSettingChange('workTime', value)
							}}
							max={60}
							getInputStyle={getInputStyle}
							theme={theme}
						/>

						<SettingInput
							label="استراحت کوتاه:"
							value={settings.shortBreakTime}
							onChange={(value) => {
								handleSettingChange('shortBreakTime', value)
							}}
							max={30}
							getInputStyle={getInputStyle}
							theme={theme}
						/>

						<SettingInput
							label="استراحت بلند:"
							value={settings.longBreakTime}
							onChange={(value) => {
								handleSettingChange('longBreakTime', value)
							}}
							max={60}
							getInputStyle={getInputStyle}
							theme={theme}
						/>

						<SettingInput
							label="تعداد دوره قبل از استراحت بلند:"
							value={settings.cyclesBeforeLongBreak}
							onChange={(value) => {
								handleSettingChange('cyclesBeforeLongBreak', value)
							}}
							max={10}
							getInputStyle={getInputStyle}
							theme={theme}
						/>

						<div className="text-center">
							<button
								onClick={handleSaveAndClose}
								className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${
									theme === 'light'
										? 'bg-blue-500 text-white hover:bg-blue-600'
										: 'bg-blue-600 text-gray-200 hover:bg-blue-700'
								}`}
							>
								ذخیره و بستن
							</button>
						</div>
					</div>
				</div>
			</motion.div>
		</Modal>
	)
}
