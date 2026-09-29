interface DaysLeftProps {
	daysLeft: number
}

export function DaysLeft({ daysLeft }: DaysLeftProps) {
	return (
		<p className="flex items-baseline gap-1 leading-none text-fg">
			<span className="text-[12cqh] font-black tabular-nums">
				{daysLeft.toLocaleString('fa-IR')}
			</span>
			<span className="text-[6cqh] font-bold text-fg-muted">روز مانده</span>
		</p>
	)
}
