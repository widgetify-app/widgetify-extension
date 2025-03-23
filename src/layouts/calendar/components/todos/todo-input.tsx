import { useState, useEffect } from 'react'
import { FiFlag, FiTag, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import Analytics from '../../../../analytics'
import { useTheme } from '@/context/theme.context'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { FaRegStickyNote } from 'react-icons/fa'

interface Prop {
	onAdd: (
		text: string,
		priority: 'low' | 'medium' | 'high',
		category?: string,
		notes?: string,
	) => void
	showModal: boolean
	setShowModal: (show: boolean) => void
}

export function TodoInput({ onAdd, setShowModal, showModal }: Prop) {
	const { theme } = useTheme()
	const [text, setText] = useState('')
	const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
	const [category, setCategory] = useState('')
	const [notes, setNotes] = useState('')
	const [error, setError] = useState('')

	// Reset form when modal opens
	useEffect(() => {
		if (showModal) {
			setText('')
			setCategory('')
			setNotes('')
			setPriority('medium')
			setError('')
		}
	}, [showModal])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!text.trim()) {
			setError('لطفاً متن یادداشت را وارد کنید')
			return
		}

		onAdd(text.trim(), priority, category, notes)
		Analytics.featureUsed('todo_added')
		setShowModal(false)
	}

	const getPriorityColor = (value: string) => {
		switch (value) {
			case 'low':
				return theme === 'light'
					? 'bg-emerald-500 border-emerald-600'
					: 'bg-emerald-600 border-emerald-700'
			case 'medium':
				return theme === 'light'
					? 'bg-amber-500 border-amber-600'
					: 'bg-amber-600 border-amber-700'
			case 'high':
				return theme === 'light'
					? 'bg-rose-500 border-rose-600'
					: 'bg-rose-600 border-rose-700'
			default:
				return ''
		}
	}

	const getInputStyle = () => {
		switch (theme) {
			case 'light':
				return `
                        bg-white/90 text-gray-800 border-gray-300/30
                        placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                        hover:bg-white disabled:bg-gray-100 disabled:text-gray-500
                    `
			case 'dark':
				return `
                        bg-gray-800/80 text-gray-200 border-gray-700/40
                        placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                        hover:bg-gray-800/90 disabled:bg-gray-800/50 disabled:text-gray-500
                    `
			default: // glass
				return `
                        bg-white/5 text-gray-200 border-white/10
                        placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                        hover:bg-white/10 disabled:bg-white/3 disabled:text-gray-500
                    `
		}
	}

	const getLabelStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700'
			case 'dark':
				return 'text-gray-300'
			default: // glass
				return 'text-gray-300'
		}
	}

	const getCancelButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-gray-300 text-gray-700 hover:bg-gray-100'
			case 'dark':
				return 'border-gray-700 text-gray-300 hover:bg-gray-700/70'
			default: // glass
				return 'border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
		}
	}

	const getSubmitButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-600 text-white hover:bg-blue-700'
			case 'dark':
				return 'bg-blue-700 text-white hover:bg-blue-800'
			default: // glass
				return 'bg-blue-600/90 text-white hover:bg-blue-700/90'
		}
	}

	return (
		<Modal
			isOpen={showModal}
			onClose={() => setShowModal(false)}
			title="افزودن یادداشت جدید"
			size="md"
			direction="rtl"
		>
			<div className="px-1 py-2">
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					{/* Main input with floating label */}
					<div className="relative">
						<div className={'relative rounded-lg p-1'}>
							<label className={`block text-sm font-medium ${getLabelStyle()}`}>
								<div className="flex items-center gap-2 mb-2">
									<FaRegStickyNote className="text-blue-500" />
									<span>
										متن یادداشت <span className="text-rose-500">*</span>
									</span>
								</div>
							</label>

							<TextInput
								placeholder="به عنوان مثال: جلسه با نقی"
								onChange={(value) => setText(value)}
								value={text}
							/>
						</div>

						<AnimatePresence>
							{error && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									className="absolute text-rose-500 text-sm sm:text-xs flex items-center gap-1 mt-1 mr-1"
								>
									<FiAlertCircle className="text-rose-500" />
									<span>{error}</span>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Priority Selection */}
					<div className="space-y-2">
						<label className={`block text-sm font-medium ${getLabelStyle()}`}>
							<div className="flex items-center gap-2 mb-2">
								<FiFlag className="text-blue-500" />
								<span>اولویت</span>
							</div>
						</label>
						<div className="flex gap-2">
							{['low', 'medium', 'high'].map((p) => (
								<motion.button
									key={p}
									type="button"
									whileTap={{ scale: 0.95 }}
									onClick={() => setPriority(p as 'low' | 'medium' | 'high')}
									className={`flex-1 py-2 px-3 rounded-md border-2 transition-all duration-200 ${
										priority === p
											? `${getPriorityColor(p)} text-white font-medium`
											: theme === 'light'
												? 'border-gray-300 bg-transparent text-gray-700'
												: 'border-gray-700 bg-transparent text-gray-300'
									}`}
								>
									{p === 'low' && 'کم'}
									{p === 'medium' && 'متوسط'}
									{p === 'high' && 'زیاد'}
								</motion.button>
							))}
						</div>
					</div>

					{/* Category */}
					<div className="space-y-2">
						<label
							htmlFor="todo-category"
							className={`block text-sm font-medium ${getLabelStyle()}`}
						>
							<div className="flex items-center gap-2 mb-2">
								<FiTag className="text-blue-500" />
								<span>دسته‌بندی</span>
							</div>
						</label>
						<div className="relative rounded-lg">
							<TextInput
								placeholder="مثال: کار، شخصی، خرید"
								onChange={(value) => setCategory(value)}
								value={category}
							/>
						</div>
					</div>

					{/* Notes */}
					<div className="space-y-2">
						<label
							htmlFor="todo-notes"
							className={`block text-sm font-medium ${getLabelStyle()}`}
						>
							<div className="flex items-center gap-2 mb-2">
								<FaRegStickyNote className="text-blue-500" />
								<span>توضیحات تکمیلی</span>
							</div>
						</label>
						<div className={'relative rounded-lg border'}>
							<textarea
								id="todo-notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="جزئیات بیشتر..."
								rows={3}
								className={`block w-full py-2.5 px-4 text-sm rounded-md outline-none transition-all duration-200 ${getInputStyle()}`}
							/>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={() => setShowModal(false)}
							className={`flex items-center justify-center gap-1 flex-1 py-2.5 px-4 rounded-lg border transition-colors ${getCancelButtonStyle()}`}
						>
							<FiX />
							<span>انصراف</span>
						</button>
						<motion.button
							type="submit"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className={`flex items-center justify-center gap-1 flex-1 py-2.5 px-4 rounded-lg transition-colors ${getSubmitButtonStyle()}`}
						>
							<FiCheck />
							<span>ثبت یادداشت</span>
						</motion.button>
					</div>
				</form>
			</div>
		</Modal>
	)
}
