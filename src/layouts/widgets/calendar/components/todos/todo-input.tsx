import Analytics from '@/analytics'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { getButtonStyles, getTextColor, useTheme } from '@/context/theme.context'
import { useEffect, useState } from 'react'
import {
	FiChevronDown,
	FiChevronUp,
	FiFlag,
	FiMessageSquare,
	FiPlus,
	FiTag,
} from 'react-icons/fi'

interface Prop {
	onAdd: (
		text: string,
		priority: 'low' | 'medium' | 'high',
		category?: string,
		notes?: string,
	) => void
	show: boolean
	onClose: () => void
}

export function TodoInput({ onAdd, show, onClose }: Prop) {
	const { theme } = useTheme()
	const [text, setText] = useState('')
	const [showAdvanced, setShowAdvanced] = useState(false)
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
			title="افزودن یادداشت جدید"
			size="md"
			direction="rtl"
		>
			<div className="space-y-4">
				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="mb-1">
						<label
							htmlFor="todo-text-input"
							className={`block mb-1.5 text-sm font-normal ${getTextColor(theme)}`}
						>
							متن یادداشت
						</label>
						<div className="relative">
							<TextInput
								id="todo-text-input"
								type="text"
								value={text}
								onChange={(value) => setText(value)}
								placeholder="چیکار میخای انجام بدی؟"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-2 mb-1">
						<div className="flex items-center justify-between">
							<span className={`text-sm font-normal ${getTextColor(theme)}`}>
								اولویت:
							</span>
							<button
								type="button"
								onClick={() => setShowAdvanced(!showAdvanced)}
								className={`flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 transition-colors duration-200 cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ${getTextColor(theme)}`}
							>
								{showAdvanced ? (
									<FiChevronUp className="w-3.5 h-3.5" />
								) : (
									<FiChevronDown className="w-3.5 h-3.5" />
								)}
								<span>گزینه‌های بیشتر</span>
							</button>
						</div>

						<div className="grid grid-cols-3 gap-2 p-1 rounded-lg">
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
										flex flex-col cursor-pointer items-center justify-center gap-1 p-2 rounded-lg
										transition-all duration-150
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
											${priority === value ? 'scale-110' : ''} transition-transform duration-150
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

					{showAdvanced && (
						<div
							className={`grid gap-3 p-3 rounded-lg border ${theme === 'light' ? ' border-gray-200/70' : ' border-gray-700/30'}`}
						>
							<div className="flex items-center gap-2">
								<FiTag className="text-indigo-400" />
								<TextInput
									type="text"
									value={category}
									onChange={(value) => setCategory(value)}
									placeholder="دسته‌بندی (مثلاً: شخصی، کاری)"
								/>
							</div>

							<div className="flex items-start gap-2">
								<FiMessageSquare className="mt-2 text-indigo-400" />
								<TextInput
									value={notes}
									onChange={(value) => setNotes(value)}
									placeholder="یادداشت یا توضیحات اضافی..."
								/>
							</div>
						</div>
					)}

					<div className="flex justify-end pt-2">
						<button
							type="submit"
							disabled={!text.trim()}
							className={`flex gap-2 items-center cursor-pointer px-4 py-2 rounded-lg ${getButtonStyles(theme, true)}`}
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
