function toMinutes(time: string): number | null {
	const match = /^(\d{1,2}):(\d{2})/.exec(time)
	if (!match) return null
	return Number(match[1]) * 60 + Number(match[2])
}

export function nextPrayerIndex(times: (string | undefined)[], now: Date): number {
	const nowMinute = now.getHours() * 60 + now.getMinutes()
	return times.findIndex((time) => {
		const minute = time ? toMinutes(time) : null
		return minute !== null && minute > nowMinute
	})
}

export function minutesUntil(time: string, now: Date): number {
	const minute = toMinutes(time)
	if (minute === null) return 0
	return Math.max(0, minute - (now.getHours() * 60 + now.getMinutes()))
}

export function formatTimeLeft(minutes: number): string {
	const hours = Math.floor(minutes / 60)
	const rest = minutes % 60
	if (hours === 0) return `${rest} دقیقه دیگه`
	return `${hours}:${String(rest).padStart(2, '0')} دیگه`
}
