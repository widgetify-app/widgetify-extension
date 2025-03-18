import { useState } from 'react'
import { FiFlag, FiTag } from 'react-icons/fi'
import Analytics from '../../../../analytics'
import { useTheme } from '@/context/theme.context'

interface Prop {
	onAdd: (
		text: string,
		priority: 'low' | 'medium' | 'high',
		category?: string,
		notes?: string,
	) => void
}

export function TodoInput({ onAdd }: Prop) {
	const { theme } = useTheme()
	const [text, setText] = useState('')
	const [showAdvanced, setShowAdvanced] = useState(false)
	const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
	const [category, setCategory] = useState('')
	const [notes, setNotes] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (text.trim()) {
			onAdd(text.trim(), priority, category, notes)

			Analytics.featureUsed('todo_added')

			setText('')
			setCategory('')
			setNotes('')
			setPriority('medium')
		}
	}

	// Theme-specific styles
	const getInputStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600 placeholder-gray-500 bg-gray-200/70 focus:ring-2 focus:ring-blue-500'
			case 'dark':
				return 'text-gray-300 placeholder-gray-500/80 bg-gray-700/50 focus:ring-2 focus:ring-blue-500'
			default: // glass
				return 'text-gray-300 placeholder-gray-500/80 bg-gray-700/30 focus:ring-2 focus:ring-blue-500'
		}
	}

	const getToggleButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600 bg-gray-300/70 hover:bg-gray-300/90'
			case 'dark':
				return 'text-gray-400 bg-gray-700/50 hover:bg-gray-600/50'
			default: // glass
				return 'text-gray-400 bg-gray-700/30 hover:bg-gray-600/30'
		}
	}

	const getAddButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-white bg-blue-600 hover:bg-blue-700'
			default:
				return 'text-white bg-blue-500 hover:bg-blue-600'
		}
	}

	const getAdvancedPanelStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-gray-300/50 bg-gray-100/90 backdrop-blur-md'
			case 'dark':
				return 'border-gray-700/50 bg-gray-800/95 backdrop-blur-md'
			default: // glass
				return 'border-gray-700/30 bg-gray-800/80 backdrop-blur-md'
		}
	}

	const getFormFieldStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700 bg-white/70 hover:bg-white transition-colors focus:ring-2 focus:ring-blue-500/50 focus:outline-none'
			case 'dark':
				return 'text-gray-300 bg-gray-700/70 hover:bg-gray-700/90 transition-colors focus:ring-2 focus:ring-blue-500/50 focus:outline-none'
			default: // glass
				return 'text-gray-300 bg-gray-700/50 hover:bg-gray-700/70 transition-colors focus:ring-2 focus:ring-blue-500/50 focus:outline-none'
		}
	}

	const getLabelTextStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600'
			default:
				return 'text-gray-400'
		}
	}

	return (
		<div className="relative mb-4">
			<form onSubmit={handleSubmit} className="flex gap-2">
				<input
					type="text"
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="یادداشت جدید..."
					className={`flex-1 px-3 py-2 rounded-lg focus:outline-none ${getInputStyle()}`}
				/>
				<button
					type="button"
					onClick={() => setShowAdvanced(!showAdvanced)}
					className={`px-3 py-2 transition-colors rounded-lg cursor-pointer ${getToggleButtonStyle()}`}
				>
					{showAdvanced ? '▲' : '▼'}
				</button>
				<button
					type="submit"
					className={`px-4 py-2 transition-colors rounded-lg cursor-pointer ${getAddButtonStyle()}`}
				>
					افزودن
				</button>
			</form>

			{showAdvanced && (
				<div
					className={`absolute left-0 right-0 z-10 flex flex-col gap-2 p-4 mt-2 border rounded-lg shadow-lg top-full ${getAdvancedPanelStyle()}`}
				>
					<div className="flex items-center w-full gap-2">
						<FiFlag className={getLabelTextStyle()} />
						<select
							value={priority}
							onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
							className={`flex-1 px-2 py-1.5 text-sm rounded ${getFormFieldStyle()}`}
						>
							<option value="low">اولویت کم</option>
							<option value="medium">اولویت متوسط</option>
							<option value="high">اولویت زیاد</option>
						</select>
					</div>

					<div className="flex items-center col-span-2 gap-2">
						<FiTag className={getLabelTextStyle()} />
						<input
							type="text"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className={`flex-1 px-2 py-1.5 text-sm rounded ${getFormFieldStyle()}`}
							placeholder="دسته‌بندی (مثال: کار، شخصی)"
						/>
					</div>

					<div className="col-span-2">
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							className={`w-full px-2 py-1.5 text-sm rounded ${getFormFieldStyle()}`}
							placeholder="یادداشت تکمیلی..."
							rows={2}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
