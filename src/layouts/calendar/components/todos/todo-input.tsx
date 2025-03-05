import { useState } from 'react'
import { FiClock, FiFlag, FiTag } from 'react-icons/fi'
import Analytics from '../../../../analytics'

interface Prop {
	onAdd: (
		text: string,
		priority: 'low' | 'medium' | 'high',
		category?: string,
		notes?: string,
	) => void
}

export function TodoInput({ onAdd }: Prop) {
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

	return (
		<div className="relative mb-4">
			<form onSubmit={handleSubmit} className="flex gap-2">
				<input
					type="text"
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="یادداشت جدید..."
					className="flex-1 px-3 py-2 text-gray-600 placeholder-gray-500 rounded-lg ab dark:placeholder-gray-500/80 dark:text-gray-300 bg-gray-300/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					type="button"
					onClick={() => setShowAdvanced(!showAdvanced)}
					className="px-3 py-2 text-gray-400 transition-colors rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-600/50"
				>
					{showAdvanced ? '▲' : '▼'}
				</button>
				<button
					type="submit"
					className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600"
				>
					افزودن
				</button>
			</form>

			{showAdvanced && (
				<div className="absolute left-0 right-0 z-10 flex flex-col gap-2 p-4 mt-2 border rounded-lg shadow-lg top-full bg-gray-800/95 backdrop-blur-md border-gray-700/50">
					<div className="flex items-center w-full gap-2">
						<FiFlag className="text-gray-400" />
						<select
							value={priority}
							onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
							className="flex-1 px-2 py-1.5 text-sm text-gray-300 rounded bg-gray-700/70 hover:bg-gray-700/90 transition-colors focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
						>
							<option value="low">اولویت کم</option>
							<option value="medium">اولویت متوسط</option>
							<option value="high">اولویت زیاد</option>
						</select>
					</div>

					<div className="flex items-center col-span-2 gap-2">
						<FiTag className="text-gray-400" />
						<input
							type="text"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="flex-1 px-2 py-1.5 text-sm text-gray-300 rounded bg-gray-700/70 hover:bg-gray-700/90 transition-colors focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
							placeholder="دسته‌بندی (مثال: کار، شخصی)"
						/>
					</div>

					<div className="col-span-2">
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							className="w-full px-2 py-1.5 text-sm text-gray-300 rounded bg-gray-700/70 hover:bg-gray-700/90 transition-colors focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
							placeholder="یادداشت تکمیلی..."
							rows={2}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
