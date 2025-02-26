import { CiSearch } from 'react-icons/ci'

import { BookmarkProvider } from '../../context/bookmark.context'
import { BookmarksComponent } from './bookmarks/bookmarks'

export function SearchLayout() {
	const GOOGLE_URL = 'https://www.google.com/search?q='

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const query = (e.target as HTMLFormElement).search.value
		if (query.trim()) {
			window.location.href = GOOGLE_URL + encodeURIComponent(query)
		}
	}
	return (
		<>
			<div className="flex flex-col items-center justify-center text-white max-h-80">
				<form className="w-full" onSubmit={handleSubmit}>
					<div className="relative overflow-hidden transition-all duration-300 shadow-xl backdrop-blur-sm bg-neutral-900/70 rounded-2xl hover:bg-neutral-800/80 group">
						<input
							type="text"
							name="search"
							className="w-full py-4 pl-16 pr-6 text-lg font-light text-right text-gray-200 transition-all duration-300 bg-transparent placeholder-gray-400/70 focus:outline-none"
							placeholder="جستجو در گوگل..."
						/>
						<button
							type="submit"
							className="absolute p-2 text-blue-400 transition-all duration-300 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-blue-500/10 hover:bg-blue-500/20 hover:text-blue-300"
						>
							<CiSearch size={20} />
						</button>
						<div className="absolute inset-0 transition-all duration-300 border pointer-events-none border-white/10 rounded-2xl group-hover:border-white/20" />
					</div>
				</form>
				<BookmarkProvider>
					<BookmarksComponent />
				</BookmarkProvider>
			</div>
		</>
	)
}
