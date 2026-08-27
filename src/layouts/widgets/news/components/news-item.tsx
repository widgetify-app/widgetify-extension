import { useState } from 'react'
import moment from 'jalali-moment'
import { Icon } from '@/src/icons'

interface NewsItemProps {
	title: string
	description?: string
	source: {
		name: string
		url: string
	}
	image_url?: string
	publishedAt: string
	link?: string
	index: number
	onClick: (url: string) => void
}

const toPersianDigits = (str: string) => {
	const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
	return str.replace(/[0-9]/g, (w) => persianDigits[+w])
}

export const NewsItem = ({
	title,
	source,
	publishedAt,
	link,
	image_url,
	onClick,
}: NewsItemProps) => {
	const [imageError, setImageError] = useState(false)

	const formatRelativeTime = (dateString: string) => {
		try {
			const date = new Date(dateString)
			if (isNaN(date.getTime())) return dateString
			return toPersianDigits(moment(date).locale('fa').fromNow())
		} catch {
			return dateString
		}
	}

	const handleClick = () => {
		const url = link || source.url
		if (url && typeof url === 'string') onClick(url)
	}

	const hasImage = Boolean(image_url && !imageError)

	return (
		<div
			className="flex items-center gap-2.5 p-2 transition-all duration-200 border rounded-2xl cursor-pointer bg-base-300/70 hover:bg-base-300/40 border-base-300/70 active:scale-[0.98]"
			onClick={handleClick}
		>
			{hasImage ? (
				<img
					src={image_url}
					alt={title}
					className="object-cover w-14 h-14 rounded-xl shrink-0 bg-base-300"
					loading="lazy"
					onError={() => setImageError(true)}
				/>
			) : (
				<div className="flex items-center justify-center w-14 h-14 rounded-xl shrink-0 bg-base-300 text-muted">
					<Icon name="outlineNewspaper" size={20} className="opacity-60" />
				</div>
			)}

			<div className="flex flex-col justify-between flex-1 min-w-0 h-full py-0.5">
				<h3 className="text-xs font-medium leading-snug text-content line-clamp-2">
					{title}
				</h3>
				<div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-muted opacity-70">
					<span className="truncate max-w-[120px]">{source.name}</span>
					<span>·</span>
					<span className="shrink-0">{formatRelativeTime(publishedAt)}</span>
				</div>
			</div>
		</div>
	)
}
