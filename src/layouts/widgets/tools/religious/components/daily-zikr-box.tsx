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
				'bg-content border border-content rounded-lg p-0.5 animate-in fade-in-0 slide-in-from-bottom-2 duration-300'
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
