import { useEffect, useRef } from 'react'
import { HiSearch } from 'react-icons/hi'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import { TextInput } from '@/components/text-input'
import Tooltip from '@/components/toolTip'

export function SearchBoxSidePanel() {
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (isSearchOpen && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isSearchOpen])

	const handleSearch = async (query: string) => {
		if (query.trim()) {
			const isUrl =
				/^https?:\/\//.test(query.trim()) ||
				(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(query.trim()) &&
					!query.trim().includes(' '))

			if (isUrl) {
				const url = query.trim().startsWith('http')
					? query.trim()
					: `https://${query.trim()}`
				await browser.tabs.create({ url })
			} else {
				await browser.search.query({ text: query, disposition: 'NEW_TAB' })
			}
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
						ref={inputRef}
						onChange={setSearchQuery}
						value={searchQuery}
						placeholder="جستجو با متن یا آدرس وب"
						className="!text-gray-600 dark:!text-gray-300"
						onKeyDown={handleKeyDown}
					/>
				)}
			</div>

			{/* Search Icon Button */}
			<Tooltip content={isSearchOpen ? 'بستن جستجو' : 'باز کردن جستجو'}>
				<Button
					size="md"
					onClick={() => toggleSearchBox()}
					className={`p-2 transition-colors rounded-lg cursor-pointer hover:bg-base-300 text-content ${isSearchOpen ? 'bg-primary/20 !text-primary' : ''}`}
				>
					<HiSearch className="w-5 h-5" />
				</Button>
			</Tooltip>
		</div>
	)
}
