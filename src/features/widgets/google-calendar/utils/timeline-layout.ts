const MINUTES_IN_DAY = 24 * 60

interface TimelineSpan {
	start: Date
	end: Date
}

interface TimelineSlot {
	startMinute: number
	endMinute: number
	lane: number
	lanes: number
}

export function minuteOfDay(date: Date): number {
	return date.getHours() * 60 + date.getMinutes()
}

function toMinutes(span: TimelineSpan) {
	const start = Math.min(Math.max(0, minuteOfDay(span.start)), MINUTES_IN_DAY)
	const sameDayEnd =
		span.end.toDateString() === span.start.toDateString()
			? minuteOfDay(span.end)
			: MINUTES_IN_DAY
	return { start, end: Math.max(start, Math.min(sameDayEnd, MINUTES_IN_DAY)) }
}

export function layoutTimeline(spans: TimelineSpan[]): TimelineSlot[] {
	const minutes = spans.map(toMinutes)
	const order = minutes
		.map((_, index) => index)
		.sort((a, b) => minutes[a].start - minutes[b].start)

	const slots: TimelineSlot[] = minutes.map(({ start, end }) => ({
		startMinute: start,
		endMinute: end,
		lane: 0,
		lanes: 1,
	}))

	let cluster: number[] = []
	let laneEnds: number[] = []
	let clusterEnd = -1

	const closeCluster = () => {
		for (const index of cluster) slots[index].lanes = laneEnds.length
		cluster = []
		laneEnds = []
	}

	for (const index of order) {
		const { start, end } = minutes[index]
		if (start >= clusterEnd) closeCluster()

		let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start)
		if (lane < 0) {
			lane = laneEnds.length
			laneEnds.push(end)
		} else {
			laneEnds[lane] = end
		}

		slots[index].lane = lane
		cluster.push(index)
		clusterEnd = Math.max(clusterEnd, end)
	}
	closeCluster()

	return slots
}
