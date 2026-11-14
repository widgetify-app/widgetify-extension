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

function clockParts(date: Date, timeZone?: string) {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone,
		hourCycle: 'h23',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	}).formatToParts(date)
	const read = (type: string) => parts.find((part) => part.type === type)?.value ?? ''

	return {
		day: `${read('year')}-${read('month')}-${read('day')}`,
		minute: Number(read('hour')) * 60 + Number(read('minute')),
	}
}

export function minuteOfDay(date: Date, timeZone?: string): number {
	return clockParts(date, timeZone).minute
}

function toMinutes(span: TimelineSpan, timeZone?: string) {
	const start = Math.min(Math.max(0, minuteOfDay(span.start, timeZone)), MINUTES_IN_DAY)
	const sameDayEnd =
		clockParts(span.end, timeZone).day === clockParts(span.start, timeZone).day
			? minuteOfDay(span.end, timeZone)
			: MINUTES_IN_DAY
	return { start, end: Math.max(start, Math.min(sameDayEnd, MINUTES_IN_DAY)) }
}

export function layoutTimeline(spans: TimelineSpan[], timeZone?: string): TimelineSlot[] {
	const minutes = spans.map((span) => toMinutes(span, timeZone))
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
