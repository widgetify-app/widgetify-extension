interface DaysLeftProps {
	daysLeft: number
}

export function DaysLeft({ daysLeft }: DaysLeftProps) {
	return (
		<p className="flex items-baseline gap-1 leading-none text-content">
			<span className="text-[12cqh] font-black tabular-nums">
				{daysLeft.toLocaleString('fa-IR')}
			</span>
			<span className="text-[6cqh] font-bold text-muted">روز مانده</span>
		</p>
	)
}
