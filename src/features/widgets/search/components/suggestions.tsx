import { t } from '@/common/i18n'
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
		<ul className="flex flex-col gap-0.5 p-1.5">
			{combinedSuggestions.map((item, index) => {
				const isSelected = selectedIndex === index

				return (
					<li
						key={item.text}
						className={`relative flex items-center rounded-xl transition-ui ${
							isSelected ? 'bg-fill-2' : 'hover:bg-fill'
						}`}
					>
						<button
							type="button"
							onMouseDown={(e) => {
								e.preventDefault()
								handleSearch(item.text)
							}}
							className={`flex items-center flex-1 min-w-0 gap-2.5 px-2.5 min-h-8 text-right bg-transparent border-none cursor-pointer rounded-xl focus-visible:focus-ring ${
								item.isRecent && blurMode
									? 'blur-mode'
									: 'disabled-blur-mode'
							}`}
						>
							<Icon
								name={item.isRecent ? 'history' : 'search'}
								size={14}
								aria-hidden="true"
								className={`shrink-0 ${isSelected ? 'text-brand' : 'text-fg-faint'}`}
							/>
							<span
								className={`text-xs truncate ${
									isSelected
										? 'text-fg-strong font-semibold'
										: 'text-fg'
								}`}
							>
								{item.text}
							</span>
						</button>

						{item.isRecent && (
							<button
								type="button"
								aria-label={t('widgets.search.removeHistory', {
									text: item.text,
								})}
								onMouseDown={(e) => {
									e.preventDefault()
									e.stopPropagation()
									onRemove(item.text)
								}}
								className="flex items-center justify-center w-6 h-6 mr-1 ml-2 bg-transparent border-none rounded-full cursor-pointer shrink-0 text-fg-faint transition-ui hover:bg-fill-2 hover:text-fg focus-visible:focus-ring"
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
