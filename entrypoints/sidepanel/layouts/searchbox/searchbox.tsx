import { HiSearch } from 'react-icons/hi'
import Analytics from '@/analytics'
import { TextInput } from '@/components/text-input'
import Tooltip from '@/components/toolTip'

export function SearchBoxSidePanel() {
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const handleSearch = async (query: string) => {
		if (query.trim()) {
			await browser.search.query({ text: query })
			setSearchQuery('')
			setIsSearchOpen(false)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch(searchQuery)
			Analytics.event('sidepanel_searchbox_submitted')
		} else if (e.key === 'Escape') {
			setIsSearchOpen(false)
			setSearchQuery('')
		}
	}

	const toggleSearchBox = () => {
		setIsSearchOpen(!isSearchOpen)
		Analytics.event(`sidepanel_searchbox_${!isSearchOpen ? 'opened' : 'closed'}`)
	}

	return (
		<div className="relative flex items-center">
			<div
				className={`absolute left-10 transition-all duration-300 ease-in-out ${
					isSearchOpen
						? 'opacity-100 translate-x-0 pointer-events-auto w-56'
						: 'opacity-0 translate-x-4 pointer-events-none w-0'
				}`}
			>
				{isSearchOpen && (
					<TextInput
						onChange={setSearchQuery}
						value={searchQuery}
						placeholder="جستجو در وب..."
						className="!text-gray-500"
						onKeyDown={handleKeyDown}
					/>
				)}
			</div>

			{/* Search Icon Button */}
			<Tooltip content={isSearchOpen ? 'بستن جستجو' : 'باز کردن جستجو'}>
				<button
					onClick={() => toggleSearchBox()}
					className="p-2 transition-colors rounded-lg cursor-pointer hover:bg-base-300 text-content"
					aria-label="جستجو"
				>
					<HiSearch className="w-5 h-5" />
				</button>
			</Tooltip>
		</div>
	)
}
