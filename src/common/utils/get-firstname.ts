export function GetUserFirstName(name: string): string {
	if (!name) return ''

	return name.trim().split(/\s+/)[0] ?? ''
}
