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
			className="group flex items-center gap-2 p-1.5 rounded-xl cursor-pointer bg-raised hover:bg-hovered transition-all border border-transparent hover:border-subtle active:scale-[0.99] focus-visible:focus-ring shrink-0"
		>
			{hasImage && (
				<img
					src={image_url}
					alt=""
					className="object-cover w-10 h-10 rounded-lg shrink-0 bg-raised"
					loading="lazy"
					onError={() => setImageError(true)}
				/>
			)}

			<span className="flex flex-col justify-center flex-1 min-w-0 py-0.5">
				<span className="text-[11.5px] font-medium leading-[1.4] text-content group-hover:text-primary transition-colors line-clamp-2">
					{title}
				</span>
				<span className="flex items-center gap-1 mt-0.5 text-[10px] text-muted">
					<span className="truncate max-w-[100px]">{source.name}</span>
					<span aria-hidden="true" className="opacity-50">
						·
					</span>
					<time dateTime={publishedAt} className="shrink-0 opacity-80">
						{formatRelativeTime(publishedAt)}
					</time>
				</span>
			</span>
		</a>
	)
}
