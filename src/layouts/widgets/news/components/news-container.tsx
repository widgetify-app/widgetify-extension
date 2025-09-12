interface NewsContainerProps {
	isLoading: boolean
	isEmpty: boolean
	noFeedsConfigured: boolean
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
					'flex-1 flex flex-col items-center justify-center gap-y-1.5 px-5 py-8'
				}
			>
				<div
					className={
						'flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300/70 border-base/70'
					}
				>
					<div className="border-2 border-t-2 rounded-full w-7 h-7 animate-spin border-base-content border-t-transparent" />
				</div>
				<p className="mt-1 text-center text-content">در حال دریافت اخبار...</p>
			</div>
		)
	}

	if (isEmpty) {
		return (
			<div
				className={
					'flex flex-col items-center justify-center gap-y-1.5 px-5 py-12'
				}
			>
				<div
					className={
						'flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300/70 border-base/70'
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
				<p className="mt-1 text-center text-content">
					هیچ خبری برای نمایش وجود ندارد.
				</p>
				<p className="text-center text-[.65rem] text-content opacity-75">
					{noFeedsConfigured
						? 'لطفا یک فید RSS اضافه کنید تا اخبار مورد نظر خود را دریافت کنید.'
						: 'در حال حاضر خبری از منابع شما موجود نیست.'}
				</p>
			</div>
		)
	}

	return (
		<div
			className={`flex flex-col h-full gap-1 ${inComboWidget ? '' : 'overflow-y-auto'}`}
		>
			{children}
		</div>
	)
}
