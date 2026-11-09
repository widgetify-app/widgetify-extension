interface PushData {
	title?: string
	body?: string
	largeIcon?: string
	image?: string
	notificationId?: string
	link?: string
}

export function pushDataOf(payload: unknown): PushData {
	if (!payload || typeof payload !== 'object') return {}

	const { data } = payload as { data?: unknown }

	if (data && typeof data === 'object') return data as PushData

	return payload as PushData
}

export function notificationOf(data: PushData, appIcon: string) {
	return {
		title: data.title || 'Widgetify',
		options: {
			body: data.body || '',
			icon: data.largeIcon || appIcon,
			badge: appIcon,
			image: data.image || undefined,
			tag: data.notificationId || undefined,
			dir: 'rtl' as const,
			lang: 'fa',
			data,
		},
	}
}

export function tapUrl(page: string, data: PushData): string {
	const query = new URLSearchParams()

	if (data.notificationId) query.set('pushTap', data.notificationId)
	if (data.link) query.set('pushLink', data.link)

	const text = query.toString()

	return text ? `${page}?${text}` : page
}
