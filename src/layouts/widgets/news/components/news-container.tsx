interface NewsContainerProps {
	isLoading: boolean
	isEmpty: boolean
	noFeedsConfigured: boolean
	onAddFeed: () => void
	children: React.ReactNode
	inComboWidget: boolean
}

export const NewsContainer = ({
	isLoading,
	isEmpty,
	noFeedsConfigured,
	children,
	inComboWidget,
}: NewsContainerProps) => {
	if (isLoading) {
		return (
			<div
				className={
					'flex-1 flex flex-col items-center justify-center gap-y-2 px-5 py-24'
				}
			>
				<div
					className={
						'mt-1 flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300'
					}
				>
					<div className="w-7 h-7 border-2 border-t-2 rounded-full animate-spin border-primary border-t-transparent"></div>
				</div>
				<p className="text-center text-content">در حال دریافت اخبار...</p>
			</div>
		)
	}

	if (isEmpty) {
		return (
			<div
				className={
					'flex-1 flex flex-col items-center justify-center gap-y-1 px-5 py-8'
				}
			>
				<div
					className={
						'mt-1 flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300'
					}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-7 h-7 stroke-base-content"
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
				</div>
				<p className="text-center text-content">هیچ خبری برای نمایش وجود ندارد</p>
				<p className="text-center text-[.65rem] text-content opacity-75">
					{noFeedsConfigured
						? 'لطفا یک فید RSS اضافه کنید تا اخبار مورد نظر خود را دریافت کنید'
						: 'در حال حاضر خبری از منابع شما موجود نیست'}
				</p>
			</div>
		)
	}

	return (
		<div
			className={`flex flex-col h-full gap-3 ${inComboWidget ? '' : 'overflow-y-auto'}`}
		>
			{children}
		</div>
	)
}
