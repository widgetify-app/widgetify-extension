const APP_ID = /^[\w.-]{1,100}$/

export function focusableAppId(value: unknown): string | null {
	if (typeof value !== 'string') return null

	const id = value.trim()

	return APP_ID.test(id) ? id : null
}
