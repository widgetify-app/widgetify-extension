import moment from 'jalali-moment'

interface NewsItemProps {
	title: string
	description?: string
	source: {
		name: string
		url: string
	}
	publishedAt: string
	link?: string
	index: number
	onClick: (url: string) => void
}

export const NewsItem = ({
	title,
	description,
	source,
	publishedAt,
	link,
	onClick,
}: NewsItemProps) => {
	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString)
			return moment(date).locale('fa').format('HH:mm - jYYYY/jMM/jDD')
		} catch (e) {
			return dateString
		}
	}

	const handleClick = () => {
		const url = link || source.url
		if (url && typeof url === 'string') onClick(url)
	}

	return (
		<div className="transition-all">
			<div
				className="p-2 rounded-lg bg-base-300/90 hover:bg-base-300 border border-base-300/70 active:scale-98 cursor-pointer transition-all duration-300"
				onClick={handleClick}
			>
				<div className="flex items-start gap-2">
					<h3 className="flex-1 text-sm font-medium">{title}</h3>
				</div>
				{description && (
					<p className="mt-1 text-xs font-light text-muted truncate opacity-80">
						{description.replace(/\n/g, ' ').replace(/<.*?>/g, '')}
					</p>
				)}
				<div className="flex items-center justify-between mt-1 text-xs">
					<span className="px-2 py-[1px] text-xs rounded-full bg-primary/10 text-primary border border-primary/20 flex-shrink-0 max-w-[100px] truncate">
						{source.name}
					</span>
					<span dir="ltr" className="flex items-center gap-1 text-muted opacity-60">
						{formatDate(publishedAt)}
					</span>
				</div>
			</div>
		</div>
	)
}
