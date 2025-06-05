interface Holiday {
	id: string
	title: string
	date: string
	isToday: boolean
}

interface EventItemProps {
	event: Holiday
}

export function EventItem({ event }: EventItemProps) {
	return (
		<div
			className={`p-2 bg-base-200 rounded-lg hover:bg-base-300 transition-colors ${
				event.isToday ? 'ring-2 ring-primary ring-opacity-50' : ''
			}`}
		>
			<div className="flex items-center gap-3">
				<div className="text-lg">🎉</div>
				<div className="flex-1 min-w-0">
					<h4 className="text-sm font-medium text-base-content">{event.title}</h4>
					<p className="text-xs text-base-content opacity-60">{event.date}</p>
				</div>
				{event.isToday && (
					<div className="px-2 py-1 text-xs rounded-full bg-primary text-primary-content">
						امروز
					</div>
				)}
			</div>
		</div>
	)
}
