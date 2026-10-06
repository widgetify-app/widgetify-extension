export function getTimeZoneLabel(timezone: string): string {
	if (timezone.length === 3) {
		return timezone
	}

	const city = timezone.split('/')[1]?.trim()
	if (city) {
		return city.replace(/_/g, ' ').toUpperCase()
	}

	return timezone
}
