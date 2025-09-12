import { FaGear, FaRss } from 'react-icons/fa6'
import { Button } from '@/components/button/button'
import { OfflineIndicator } from '@/components/offline-indicator'

interface NewsHeaderProps {
	title: string
	isCached?: boolean
	useDefaultNews: boolean
	platformName?: string
	platformUrl?: string
	onSettingsClick: () => void
}

export const NewsHeader = ({
	title,
	isCached,
	useDefaultNews,
	platformName,
	platformUrl,
	onSettingsClick,
}: NewsHeaderProps) => {
	// Use the RSS manager hook

	// For now, we'll use an empty array for availableSources
	// This should be populated from the news data when the news tab is active

	return (
		<div className={'top-0 z-20 flex items-center justify-between w-full pb-2'}>
			<div className="flex flex-col">
				<div className="flex items-center gap-1.5">
					<FaRss className="w-3.5 h-3.5 opacity-70" />
					<p className="text-base font-medium">{title}</p>
				</div>

				{isCached && useDefaultNews ? (
					<OfflineIndicator
						mode="status"
						message="به دلیل مشکل در اتصال، اطلاعات ذخیره شده قبلی نمایش داده می‌شود"
					/>
				) : platformName && useDefaultNews ? (
					<a
						href={platformUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center mt-1 text-xs transition-colors opacity-70 hover:opacity-100 hover:text-primary"
					>
						<span>قدرت گرفته از</span>
						<span className="mr-1 font-semibold">{platformName}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-3 h-3 mr-1"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M7 7h10v10" />
							<path d="M7 17 17 7" />
						</svg>
					</a>
				) : null}
			</div>

			<div className="flex items-center gap-x-0.5">
				<Button
					onClick={onSettingsClick}
					size="xs"
					className="h-6 w-6 p-0 flex items-center justify-center rounded-full !border-none !shadow-none"
				>
					<FaGear
						size={12}
						className="text-content opacity-70 hover:opacity-100"
					/>
				</Button>
			</div>
		</div>
	)
}
