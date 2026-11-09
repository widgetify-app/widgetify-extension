interface TapData {
	notificationId?: string
	link?: string
}

export function coldTap(search: string): TapData | null {
	const params = new URLSearchParams(search)
	const notificationId = params.get('pushTap')
	const link = params.get('pushLink')

	if (!notificationId && !link) return null

	return {
		...(notificationId ? { notificationId } : {}),
		...(link ? { link } : {}),
	}
}
