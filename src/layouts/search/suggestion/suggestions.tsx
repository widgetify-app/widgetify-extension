import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/src/icons'

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
		<div className="px-2 pt-1.5 pb-1 space-y-0.5 max-h-60 overflow-y-auto">
			{combinedSuggestions.map((item, index) => {
				const isSelected = selectedIndex === index
				return (
					<button
						key={index}
						onMouseDown={(e) => {
							e.preventDefault()
							handleSearch(item.text)
						}}
						className={`relative flex items-center w-full gap-2 px-3 py-2 text-right transition-colors cursor-pointer rounded-xl ${
							isSelected
								? 'bg-base-content/10 text-primary'
								: 'hover:bg-base-content/5'
						} ${item.isRecent && blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
					>
						{item.isRecent ? (
							<div>
								<Icon
									name="history"
									size={15}
									className={`shrink-0 ${isSelected ? 'text-primary' : 'text-base-content/30'}`}
								/>
								<div
									className="absolute top-2.5 left-2 text-base-content/80 hover:text-base-content/70"
									onMouseDown={(e) => {
										e.stopPropagation()
										e.preventDefault()
									}}
									onClick={(e) => {
										e.stopPropagation()
										e.preventDefault()
										onRemove(item.text)
									}}
								>
									<Icon name="close" size={14} />
								</div>
							</div>
						) : (
							<Icon
								name="search"
								size={15}
								className={`shrink-0 ${isSelected ? 'text-primary' : 'text-base-content/30'}`}
							/>
						)}
						<span
							className={`text-sm font-medium truncate ${
								isSelected ? 'text-content font-bold' : 'text-base-content/80'
							}`}
						>
							{item.text}
						</span>
					</button>
				)
			})}
		</div>
	)
}
