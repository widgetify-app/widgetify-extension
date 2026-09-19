import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/icons'

interface Prop {
	combinedSuggestions: { text: string; isRecent: boolean }[]
	handleSearch: (query: string) => void
	onRemove: (query: string) => void
	selectedIndex?: number
}

export function Suggestions({
	combinedSuggestions,
	handleSearch,
	onRemove,
	selectedIndex = -1,
}: Prop) {
	const { blurMode } = useGeneralSetting()

	return (
		<ul className="px-2 pt-1.5 pb-1 space-y-0.5">
			{combinedSuggestions.map((item, index) => {
				const isSelected = selectedIndex === index

				return (
					<li
						key={item.text}
						className={`relative flex items-center rounded-xl transition-ui ${
							isSelected ? 'bg-hovered' : 'hover:bg-subtle'
						}`}
					>
						<button
							type="button"
							onMouseDown={(e) => {
								e.preventDefault()
								handleSearch(item.text)
							}}
							className={`flex items-center flex-1 min-w-0 gap-2 px-3 py-2 text-right bg-transparent border-none cursor-pointer rounded-xl focus-visible:focus-ring ${
								item.isRecent && blurMode
									? 'blur-mode'
									: 'disabled-blur-mode'
							}`}
						>
							<Icon
								name={item.isRecent ? 'history' : 'search'}
								size={15}
								aria-hidden="true"
								className={`shrink-0 ${isSelected ? 'text-primary' : 'text-faint'}`}
							/>
							<span
								className={`text-sm font-medium truncate ${
									isSelected ? 'text-content font-bold' : 'text-muted'
								}`}
							>
								{item.text}
							</span>
						</button>

						{item.isRecent && (
							<button
								type="button"
								aria-label={`حذف ${item.text} از تاریخچه`}
								onMouseDown={(e) => {
									e.preventDefault()
									e.stopPropagation()
									onRemove(item.text)
								}}
								className="flex items-center justify-center w-6 h-6 mr-1 ml-2 bg-transparent border-none rounded-full cursor-pointer shrink-0 text-faint transition-ui hover:bg-hovered hover:text-content focus-visible:focus-ring"
							>
								<Icon name="close" size={14} aria-hidden="true" />
							</button>
						)}
					</li>
				)
			})}
		</ul>
	)
}
