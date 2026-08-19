export function cleanCityName(name?: string | null): string {
	if (!name) return ''
	const regex = /\s*شهرستان\s*/g
	return name.replace(regex, ' ').trim()
}
