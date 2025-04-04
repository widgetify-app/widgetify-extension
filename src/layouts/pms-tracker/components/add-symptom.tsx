import Modal from '@/components/modal'
import { SectionPanel } from '@/components/section-panel'
import { TextInput } from '@/components/text-input'
import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { PMSSymptom } from '../types'

interface AddSymptomProps {
	isOpen: boolean
	onAdd: (symptom: Omit<PMSSymptom, 'id' | 'date'>) => void
	onCancel: () => void
	commonSymptoms: string[]
}

export const AddSymptom = ({
	isOpen,
	onAdd,
	onCancel,
	commonSymptoms,
}: AddSymptomProps) => {
	const [newSymptom, setNewSymptom] = useState({ name: '', severity: 'mild' as const })
	const { themeUtils, theme } = useTheme()

	const handleAdd = () => {
		if (!newSymptom.name) return
		onAdd(newSymptom)
		setNewSymptom({ name: '', severity: 'mild' })
	}

	const getSeverityColor = (severity: string, selected: boolean) => {
		if (!selected) {
			// Return theme-appropriate unselected state
			return theme === 'light'
				? 'bg-gray-100 text-gray-500 border-gray-200'
				: 'bg-transparent text-gray-500 border-gray-700/50'
		}

		switch (severity) {
			case 'mild':
				return 'bg-green-500/20 text-green-500 border-green-500/50'
			case 'moderate':
				return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
			case 'severe':
				return 'bg-red-500/20 text-red-500 border-red-500/50'
			default:
				return 'bg-transparent text-gray-500'
		}
	}

	const getSeverityLabel = (severity: string) => {
		switch (severity) {
			case 'mild':
				return 'خفیف'
			case 'moderate':
				return 'متوسط'
			case 'severe':
				return 'شدید'
			default:
				return severity
		}
	}

	const getCommonSymptomStyle = (isSelected: boolean) => {
		if (isSelected) {
			return 'bg-pink-500/20 text-pink-500 border-pink-500/30'
		}

		switch (theme) {
			case 'light':
				return 'bg-gray-200/80 hover:bg-gray-300/50 border-transparent'
			case 'dark':
				return 'bg-gray-800/80 hover:bg-gray-700/70 border-transparent'
			default: // glass
				return 'bg-gray-800/30 hover:bg-gray-700/40 border-gray-700/30'
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onCancel}
			title="افزودن علامت جدید"
			size="sm"
			direction="rtl"
		>
			<div className="p-1">
				<div
					className={`flex flex-col gap-5 p-2 rounded-xl ${themeUtils.getCardBackground()}`}
				>
					<div>
						<label
							className={`block mb-2 text-sm ${themeUtils.getDescriptionTextStyle()}`}
						>
							نام علامت
						</label>
						<TextInput
							value={newSymptom.name}
							onChange={(value) => setNewSymptom({ ...newSymptom, name: value })}
							placeholder="نام علامت را وارد کنید"
							direction="rtl"
						/>
					</div>

					<div>
						<label
							className={`block mb-2 text-sm ${themeUtils.getDescriptionTextStyle()}`}
						>
							شدت
						</label>
						<div className="flex justify-between gap-2">
							{(['mild', 'moderate', 'severe'] as const).map((severity) => (
								<button
									key={severity}
									className={`flex-1 px-3 py-2 text-sm border rounded-xl transition-all ${getSeverityColor(severity, newSymptom.severity === severity)}`}
									onClick={() => setNewSymptom({ ...newSymptom, severity })}
								>
									{getSeverityLabel(severity)}
								</button>
							))}
						</div>
					</div>

					<div>
						<label
							className={`block mb-2 text-sm ${themeUtils.getDescriptionTextStyle()}`}
						>
							علائم رایج
						</label>
						<div className="flex flex-wrap gap-2">
							{commonSymptoms.map((symptom) => (
								<motion.button
									key={symptom}
									whileTap={{ scale: 0.95 }}
									className={`px-3 py-1.5 text-sm rounded-full border transition-colors 
                                        ${getCommonSymptomStyle(newSymptom.name === symptom)}`}
									onClick={() => setNewSymptom({ ...newSymptom, name: symptom })}
								>
									{symptom}
								</motion.button>
							))}
						</div>
					</div>
				</div>

				<div
					className={`flex justify-end gap-2 mt-5 px-2 ${themeUtils.getBorderColor()}`}
				>
					<button
						className={`px-4 py-2 text-sm transition-colors rounded-xl ${themeUtils.getButtonStyles()}`}
						onClick={onCancel}
					>
						انصراف
					</button>
					<button
						className="px-4 py-2 text-sm text-white transition-colors bg-pink-500 rounded-xl hover:bg-pink-600 disabled:opacity-50 disabled:hover:bg-pink-500"
						onClick={handleAdd}
						disabled={!newSymptom.name.trim()}
					>
						افزودن
					</button>
				</div>
			</div>
		</Modal>
	)
}
