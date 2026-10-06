import { useState } from 'react'

interface NewsItemProps {
	title: string
	source: {
		name: string
		url: string
	}
	image_url?: string
	publishedAgo: string | null
	link?: string
	onOpen: (url: string) => void
}

export const NewsItem = ({
	title,
	source,
	link,
	image_url,
	publishedAgo,
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
			className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl cursor-pointer transition-ui hover:bg-fill focus-visible:focus-ring"
		>
			{hasImage && (
				<img
					src={image_url}
					alt=""
					className="flex-none object-cover rounded-lg size-11 bg-fill-2"
					loading="lazy"
					onError={() => setImageError(true)}
				/>
			)}

			<span className="flex flex-col flex-1 min-w-0">
				<span className="text-xs font-semibold leading-relaxed text-fg line-clamp-2">
					{title}
				</span>
				<span className="mt-0.5 truncate text-3xs text-fg-faint">
					{publishedAgo ? `${source.name} · ${publishedAgo}` : source.name}
				</span>
			</span>
		</a>
	)
}
