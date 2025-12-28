import { getFaviconFromUrl } from '@/common/utils/icon'

const SUGGESTED_SITES = [
	{ id: 's1', title: 'یوتیوب', url: 'https://youtube.com' },
	{ id: 's2', title: 'گوگل', url: 'https://google.com' },
	{ id: 's3', title: 'ورزش سه', url: 'https://varzesh3.com' },
	{ id: 's4', title: 'دیجی‌کالا', url: 'https://digikala.com' },
	{ id: 's5', title: 'توییتر', url: 'https://twitter.com' },
	{ id: 's6', title: 'گیت‌هاب', url: 'https://github.com' },
	{
		id: 's7',
		title: 'ویکی‌پدیا',
		url: 'https://wikipedia.org',
	},
	{
		id: 's8',
		title: 'فیسبوک',
		url: 'https://facebook.com',
	},
	{
		id: 's9',
		title: 'اینستاگرام',
		url: 'https://instagram.com',
	},
	{
		id: 's10',
		title: 'لینکدین',
		url: 'https://linkedin.com',
	},
]
export const SuggestedSites = () => {
	return (
		<div className="flex flex-row items-center gap-4 p-2 overflow-x-auto scroll-smooth scrollbar-thin!">
			{SUGGESTED_SITES.map((site) => (
				<div
					key={site.id}
					className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group"
				>
					<div className="flex items-center justify-center w-8 h-8 transition-all duration-200 rounded-2xl bg-base-200 group-hover:bg-primary/10 group-hover:ring-2 group-hover:ring-primary/20">
						<img
							src={getFaviconFromUrl(site.url)}
							className="object-contain w-5 h-5 transition-all scale-100 rounded g group-active:scale-90"
							alt={site.title}
						/>
					</div>
					<span className="text-[9px] text-base-content/60 group-hover:text-primary truncate w-12 text-center">
						{site.title}
					</span>
				</div>
			))}
		</div>
	)
}
