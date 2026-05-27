import { MdSearch } from 'react-icons/md'

interface Prop {
	suggestions: string[]
	onSearch: (query: string) => void
}
export function Suggestions({ suggestions, onSearch }: Prop) {
	return suggestions.map((s, i) => (
		<button
			key={i}
			onMouseDown={(e) => {
				e.preventDefault()
				onSearch(s)
			}}
			className="flex items-center w-full gap-2 px-3 py-2 text-right transition-colors cursor-pointer rounded-xl hover:bg-base-content/5"
		>
			<MdSearch size={15} className="text-base-content/30 shrink-0" />
			<span className="text-sm font-medium truncate text-base-content/80">{s}</span>
		</button>
	))
}
