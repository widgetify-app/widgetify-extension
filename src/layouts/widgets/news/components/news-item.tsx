import moment from 'jalali-moment'
import { useState } from 'react'
import { Icon } from '@/icons'

interface NewsItemProps {
	title: string
	source: {
		name: string
		url: string
	}
	image_url?: string
	publishedAt: string
	link?: string
	onOpen: (url: string) => void
}

const toPersianDigits = (value: string) =>
	value.replace(/[0-9]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)])

function formatRelativeTime(dateString: string) {
	const date = new Date(dateString)
	if (Number.isNaN(date.getTime())) return dateString

	return toPersianDigits(moment(date).locale('fa').fromNow())
}

export const NewsItem = ({
	title,
	source,
	publishedAt,
	link,
	image_url,
	onOpen,
}: NewsItemProps) => {
	const [imageError, setImageError] = useState(false)

	const url = link || source.url
	const hasImage = Boolean(image_url && !imageError)

	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			onClick={() => onOpen(url)}
			className="flex items-center gap-2.5 p-2 border rounded-2xl cursor-pointer bg-base-content/5 border-base-content/10 transition-ui hover:bg-base-content/10 active:scale-[0.98] focus-visible:focus-ring"
		>
			{hasImage ? (
				<img
					src={image_url}
					alt=""
					className="object-cover w-14 h-14 rounded-xl shrink-0 bg-base-content/10"
					loading="lazy"
					onError={() => setImageError(true)}
				/>
			) : (
				<span className="flex items-center justify-center w-14 h-14 rounded-xl shrink-0 bg-base-content/10 text-muted">
					<Icon
						name="outlineNewspaper"
						size={20}
						className="opacity-60"
						aria-hidden="true"
					/>
				</span>
			)}

			<span className="flex flex-col justify-between flex-1 min-w-0 h-full py-0.5">
				<span className="text-xs font-medium leading-snug text-content line-clamp-2">
					{title}
				</span>
				<span className="flex items-center gap-1.5 mt-1.5 text-[11px] text-muted opacity-70">
					<span className="truncate max-w-[120px]">{source.name}</span>
					<span aria-hidden="true">·</span>
					<time dateTime={publishedAt} className="shrink-0">
						{formatRelativeTime(publishedAt)}
					</time>
				</span>
			</span>
		</a>
	)
}
