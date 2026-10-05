interface TodoSummaryInput {
	total: number
	completed: number
	isPartial: boolean
}

export function todoSummary({ total, completed, isPartial }: TodoSummaryInput): string {
	if (total === 0) return ''
	if (isPartial) return `${total} تسک`
	return `${completed} از ${total} انجام شده`
}
