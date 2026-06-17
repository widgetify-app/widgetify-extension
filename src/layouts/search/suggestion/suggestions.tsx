import { useGeneralSetting } from '@/context/general-setting.context'
import { LuHistory } from 'react-icons/lu'
import { MdSearch } from 'react-icons/md'

interface Prop {
	combinedSuggestions: { text: string; isRecent: boolean }[]
	handleSearch: (query: string) => void
}
export function Suggestions({ combinedSuggestions, handleSearch }: Prop) {
	const { blurMode } = useGeneralSetting()
	return (
		<div className="px-2 pt-1.5 pb-1 space-y-0.5 max-h-60 overflow-y-auto">
			{combinedSuggestions.map((item, index) => (
				<button
					key={index}
					onMouseDown={(e) => {
						e.preventDefault()
						handleSearch(item.text)
					}}
					className={`flex items-center w-full gap-2 px-3 py-2 text-right transition-colors cursor-pointer rounded-xl hover:bg-base-content/5 ${item.isRecent && blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
				>
					{item.isRecent ? (
						<LuHistory size={15} className="text-base-content/30 shrink-0" />
					) : (
						<MdSearch size={15} className="text-base-content/30 shrink-0" />
					)}
					<span className="text-sm font-medium truncate text-base-content/80">
						{item.text}
					</span>
				</button>
			))}
		</div>
	)
}
