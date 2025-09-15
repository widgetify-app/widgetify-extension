interface DailyZikrBoxProps {
	zikr?: string
	meaning?: string
	isLoading?: boolean
	delay?: number
}

export const DailyZikrBox = ({
	zikr,
	meaning,
	isLoading = false,
	delay = 0.3,
}: DailyZikrBoxProps) => {
	return (
		<div
			className={
				'rounded-lg bg-base-300/70 hover:bg-base-300 border  border-base-300/70 px-0.5 py-0.5 md:px-[.3rem] md:py-3  flex flex-col items-center transition-all duration-300'
			}
			style={{ animationDelay: `${delay}s` }}
		>
			<div className={'text-content text-center mt-2'}>
				{isLoading ? (
					<>
						<div className="w-40 h-5 mx-auto mb-1 bg-current rounded opacity-30 animate-pulse" />
						<div className="w-32 h-4 mx-auto mb-1 text-xs bg-current rounded opacity-20 animate-pulse" />
					</>
				) : (
					<>
						<div className="mb-1 text-sm font-medium w-52">{zikr}</div>
						<div className="text-xs truncate opacity-75 w-52">
							{meaning}
						</div>{' '}
					</>
				)}
			</div>
		</div>
	)
}
