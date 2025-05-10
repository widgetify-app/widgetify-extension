import Analytics from '@/analytics'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import {
	getBorderColor,
	getButtonStyles,
	getTextColor,
	useTheme,
} from '@/context/theme.context'
import { useEffect, useState } from 'react'
import { FiFlag, FiMessageSquare, FiPlus, FiTag } from 'react-icons/fi'

interface Prop {
	todoText: string
	onAdd: (
		text: string,
		priority: 'low' | 'medium' | 'high',
		category?: string,
		notes?: string,
	) => void
	show: boolean
	onClose: () => void
}

export function TodoInput({ onAdd, show, todoText, onClose }: Prop) {
	if (!show) return null
	const { theme } = useTheme()
	const [text, setText] = useState(todoText)
	const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
	const [category, setCategory] = useState('')
	const [notes, setNotes] = useState('')

	useEffect(() => {
		if (show) {
			const timer = setTimeout(() => {
				const inputElement = document.getElementById('todo-text-input')
				if (inputElement) inputElement.focus()
			}, 100)
			return () => clearTimeout(timer)
		}
	}, [show])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (text.trim()) {
			onAdd(text.trim(), priority, category, notes)
			Analytics.featureUsed('todo_added')
			resetForm()
		}
	}

	const resetForm = () => {
		setText('')
		setCategory('')
		setNotes('')
		setPriority('medium')
		onClose()
	}

	return (
		<Modal
			isOpen={show}
			onClose={() => onClose()}
			title="افزودن وظیفه جدید"
			size="md"
			direction="rtl"
		>
			<div className="space-y-4">
				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="mb-3">
						<label
							htmlFor="todo-text-input"
							className={`block mb-1.5 text-sm font-medium ${getTextColor(theme)}`}
						>
							عنوان وظیفه
						</label>
						<div className="relative">
							<TextInput
								id="todo-text-input"
								type="text"
								value={text}
								onChange={(value) => setText(value)}
								placeholder="عنوان وظیفه جدید..."
							/>
						</div>
					</div>

					<div className="mb-3">
						<label className={`block mb-1.5 text-sm font-medium ${getTextColor(theme)}`}>
							اولویت
						</label>
						<div className="grid grid-cols-3 gap-2">
							{[
								{
									value: 'low',
									label: 'کم',
									icon: <FiFlag size={16} />,
									ariaLabel: 'اولویت کم',
								},
								{
									value: 'medium',
									label: 'متوسط',
									icon: <FiFlag size={16} />,
									ariaLabel: 'اولویت متوسط',
								},
								{
									value: 'high',
									label: 'زیاد',
									icon: <FiFlag size={16} />,
									ariaLabel: 'اولویت زیاد',
								},
							].map(({ value, label, icon, ariaLabel }) => (
								<button
									key={value}
									type="button"
									onClick={() => setPriority(value as 'low' | 'medium' | 'high')}
									aria-label={ariaLabel}
									aria-pressed={priority === value}
									className={`
										flex items-center justify-center gap-2 p-2 rounded-lg
										transition-all duration-150 cursor-pointer
										${
											priority === value
												? theme === 'light'
													? 'bg-indigo-100 border border-indigo-200 shadow-sm'
													: 'bg-indigo-900/30 border border-indigo-700/50 shadow-sm'
												: theme === 'light'
													? 'bg-gray-50 border border-gray-200 hover:bg-indigo-50'
													: 'bg-gray-800/50 border border-gray-700/30 hover:bg-indigo-900/20'
										}
									`}
								>
									<span
										className={`
											${
												priority === value
													? 'text-indigo-600 dark:text-indigo-400'
													: 'text-gray-500 dark:text-gray-400'
											}
										`}
									>
										{icon}
									</span>
									<span
										className={`
											${
												priority === value
													? 'font-semibold text-indigo-600 dark:text-indigo-300'
													: `font-medium ${getTextColor(theme)} opacity-75`
											}
										`}
									>
										{label}
									</span>
								</button>
							))}
						</div>
					</div>

					<div
						className={`grid gap-3 p-3 mb-3 border rounded-lg ${getBorderColor(theme)}`}
					>
						<div className="flex items-center gap-2">
							<FiTag className="text-indigo-400" />
							<TextInput
								type="text"
								value={category}
								onChange={(value) => setCategory(value)}
								placeholder="دسته‌بندی (مثال: شخصی، کاری)"
							/>
						</div>

						<div className="flex items-start gap-2">
							<FiMessageSquare className="mt-2 text-indigo-400" />
							<TextInput
								value={notes}
								onChange={(value) => setNotes(value)}
								placeholder="یادداشت یا توضیحات تکمیلی..."
							/>
						</div>
					</div>

					<div className="flex justify-end pt-2">
						<button
							type="submit"
							disabled={!text.trim()}
							className={`flex items-center cursor-pointer justify-center gap-2 px-4 py-2 rounded-lg ${getButtonStyles(theme, true)}`}
						>
							<FiPlus />
							<span>افزودن</span>
						</button>
					</div>
				</form>
			</div>
		</Modal>
	)
}
