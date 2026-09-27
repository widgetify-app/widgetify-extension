const COUNTY_PREFIX = /\s*شهرستان\s*/g

export function cleanCityName(name?: string | null): string {
	if (!name) return ''
	return name.replace(COUNTY_PREFIX, ' ').trim()
}
