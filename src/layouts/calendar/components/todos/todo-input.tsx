import { useState } from 'react'

interface Prop {
	onAdd: (text: string) => void
}

export function TodoInput({ onAdd }: Prop) {
	const [text, setText] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (text.trim()) {
			onAdd(text.trim())
			setText('')
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex gap-2 mb-4">
			<input
				type="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="یادداشت جدید..."
				className="flex-1 px-3 py-2 text-gray-600 placeholder-gray-500 rounded-lg dark:placeholder-gray-500/80 dark:text-gray-300 bg-gray-300/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 "
			/>
			<button
				type="submit"
				className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
			>
				افزودن
			</button>
		</form>
	)
}
