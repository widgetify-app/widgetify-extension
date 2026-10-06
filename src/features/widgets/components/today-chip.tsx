interface TodayChipProps {
	onClick: () => void
}

export function TodayChip({ onClick }: TodayChipProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="inline-flex items-center px-2 font-semibold rounded-full cursor-pointer h-5.5 shrink-0 bg-brand-fill text-brand text-2xs transition-ui hover:bg-brand-fill-2 focus-visible:focus-ring"
		>
			برو به امروز
		</button>
	)
}
