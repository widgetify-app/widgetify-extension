import { getButtonStyles, useTheme } from '@/context/theme.context'

interface NewsContainerProps {
	isLoading: boolean
	isEmpty: boolean
	noFeedsConfigured: boolean
	onAddFeed: () => void
	children: React.ReactNode
}

export const NewsContainer = ({
	isLoading,
	isEmpty,
	noFeedsConfigured,
	onAddFeed,
	children,
}: NewsContainerProps) => {
	const { theme } = useTheme()

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-4">
				<div className="w-6 h-6 border-2 border-t-2 rounded-full animate-spin border-primary border-t-transparent"></div>
				<p className="mt-2 text-sm opacity-70">در حال دریافت اخبار...</p>
			</div>
		)
	}

	if (isEmpty) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-4 text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-12 h-12 mb-4 text-gray-400 opacity-40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="8" x2="12" y2="12" />
					<line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
				<p className="mb-2 text-sm font-medium opacity-70">
					هیچ خبری برای نمایش وجود ندارد
				</p>
				<p className="max-w-xs mb-4 text-xs opacity-50">
					{noFeedsConfigured
						? 'لطفا یک فید RSS اضافه کنید تا اخبار مورد نظر خود را دریافت کنید'
						: 'در حال حاضر خبری از منابع شما موجود نیست'}
				</p>
				{noFeedsConfigured && (
					<button
						className={`mt-2 text-sm cursor-pointer font-medium transition-all active:scale-95 ${getButtonStyles(theme)} rounded-lg`}
						onClick={onAddFeed}
					>
						<span className="flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-4 h-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
							افزودن فید RSS
						</span>
					</button>
				)}
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full gap-3 pb-12 overflow-y-auto">{children}</div>
	)
}
