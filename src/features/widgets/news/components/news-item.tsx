import { useState } from 'react'

interface NewsItemProps {
	title: string
	source: {
		name: string
		url: string
	}
	image_url?: string
	publishedAt?: string
	link?: string
	onOpen: (url: string) => void
}

export const NewsItem = ({ title, source, link, image_url, onOpen }: NewsItemProps) => {
	const [imageError, setImageError] = useState(false)

	const url = link || source.url
	const hasImage = Boolean(image_url && !imageError)

	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			onClick={() => onOpen(url)}
			className="group flex items-center gap-2 p-1.5 rounded-2xl cursor-pointer bg-surface-2 hover:bg-fill-2 transition-ui border border-surface-3 hover:border-line active:scale-[0.99] focus-visible:focus-ring shrink-0"
		>
			{hasImage && (
				<img
					src={image_url}
					alt=""
					className="object-cover w-10 h-10 rounded-lg shrink-0 bg-fill-2"
					loading="lazy"
					onError={() => setImageError(true)}
				/>
			)}

			<span className="flex flex-col justify-center flex-1 min-w-0 py-0.5">
				<span className="text-2xs font-medium leading-control text-fg group-hover:text-brand transition-colors line-clamp-2">
					{title}
				</span>
				<span className="mt-0.5 text-3xs text-fg-muted truncate">
					{source.name}
				</span>
			</span>
		</a>
	)
}
