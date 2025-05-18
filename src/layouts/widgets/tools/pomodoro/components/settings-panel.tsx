import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { motion } from 'framer-motion'
import type React from 'react'
import type { PomodoroSettings } from '../types'

interface SettingInputProps {
	label: string
	value: number
	onChange: (value: number) => void
	max: number
}

const SettingInput: React.FC<SettingInputProps> = ({ label, value, onChange, max }) => {
	return (
		<div className="flex items-center justify-between">
			<label className={'text-xs text-base-content'}>{label}</label>
			<TextInput
				type="number"
				value={String(value)}
				onChange={(newValue) => {
					const value = Number.parseInt(newValue)
					if (value > 0 && value <= max) {
						onChange(value)
					}
				}}
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
}

export const PomodoroSettingsPanel: React.FC<PomodoroSettingsPanelProps> = ({
	isOpen,
	onClose,
	settings,
	onUpdateSettings,
	onReset,
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
					<h4 className={'text-sm font-medium mb-3 text-base-content'}>
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
						/>

						<SettingInput
							label="استراحت کوتاه:"
							value={settings.shortBreakTime}
							onChange={(value) => {
								handleSettingChange('shortBreakTime', value)
							}}
							max={30}
						/>

						<SettingInput
							label="استراحت بلند:"
							value={settings.longBreakTime}
							onChange={(value) => {
								handleSettingChange('longBreakTime', value)
							}}
							max={60}
						/>

						<SettingInput
							label="تعداد دوره قبل از استراحت بلند:"
							value={settings.cyclesBeforeLongBreak}
							onChange={(value) => {
								handleSettingChange('cyclesBeforeLongBreak', value)
							}}
							max={10}
						/>

						<div className="text-center">
							<Button size="md" onClick={handleSaveAndClose}>
								ذخیره و بستن
							</Button>
						</div>
					</div>
				</div>
			</motion.div>
		</Modal>
	)
}
