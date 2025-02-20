import { CiSearch } from 'react-icons/ci'
interface Bookmark {
	title: string
	url: string
	icon: string
}
export function SearchLayout() {
	const GOOGLE_URL = 'https://www.google.com/search?q='
	const bookmarks: Bookmark[] = [
		{
			title: 'یوتیوب',
			url: 'https://youtube.com',
			icon: 'https://www.youtube.com/favicon.ico',
		},
		{
			title: 'گیت هاب',
			url: 'https://github.com',
			icon: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
		},
		{
			title: 'Stack Overflow',
			url: 'https://stackoverflow.com',
			icon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
		},
		{
			title: 'Gmail',
			url: 'https://mail.google.com',
			icon: 'https://mail.google.com/favicon.ico',
		},
		{
			title: 'Google Drive',
			url: 'https://drive.google.com',
			icon: 'https://drive.google.com/favicon.ico',
		},
		{
			title: 'Google Maps',
			url: 'https://maps.google.com',
			icon: 'https://maps.google.com/favicon.ico',
		},
	]

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const query = (e.target as HTMLFormElement).search.value
		if (query.trim()) {
			window.open(GOOGLE_URL + encodeURIComponent(query))
		}
	}

	return (
		<div
			className="flex flex-col items-center justify-center p-2 mx-1 text-white lg:mx-4"
			dir="rtl"
		>
			<form className="w-full max-w-xl" onSubmit={handleSubmit}>
				<div className="relative overflow-hidden transition-all duration-300 shadow-xl backdrop-blur-sm bg-neutral-900/70 rounded-2xl hover:bg-neutral-800/80 group">
					<input
						type="text"
						name="search"
						className="w-full py-4 pl-16 pr-6 text-lg text-right text-gray-200 placeholder-gray-400 transition-all duration-300 bg-transparent focus:outline-none"
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

			<div className="grid w-full max-w-xl grid-cols-3 gap-3 mt-6 sm:grid-cols-4 md:grid-cols-6">
				{bookmarks.map((bookmark, i) => (
					<a
						href="https://youtube.com"
						target="_blank"
						rel="noopener noreferrer"
						key={i}
						className="relative flex flex-col items-center justify-center p-4 overflow-hidden transition-all duration-300 border group bg-neutral-900/70 backdrop-blur-sm hover:bg-neutral-800/80 rounded-xl border-white/10 hover:border-white/20"
					>
						<div className="relative w-8 h-8 mb-2">
							<img
								src={bookmark.icon}
								alt={bookmark.title}
								className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
							/>
						</div>
						<span className="text-[10px] w-full text-center font-medium text-gray-200 transition-colors duration-300 group-hover:text-white">
							{bookmark.title}
						</span>
						<div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-white/5 to-transparent" />
					</a>
				))}
			</div>
		</div>
	)
}
