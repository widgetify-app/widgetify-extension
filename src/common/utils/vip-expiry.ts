import moment from 'jalali-moment'

export function getVipRemainingDays(vipExpiresAt?: string | null): number {
	if (!vipExpiresAt) return 0
	const target = moment(vipExpiresAt)
	const now = moment()
	return Math.max(0, target.diff(now, 'days'))
}

export function formatVipRemaining(vipExpiresAt?: string | null): string {
	if (!vipExpiresAt) return ''
	const target = moment(vipExpiresAt)
	const now = moment()
	const diffDays = target.diff(now, 'days')
	const diffHours = target.diff(now, 'hours')

	if (target.isBefore(now)) {
		return 'منقضی‌شده'
	}

	const fmt = new Intl.NumberFormat('fa-IR').format
	if (diffDays > 0) {
		return `${fmt(diffDays)} روز`
	}
	if (diffHours > 0) {
		return `${fmt(diffHours)} ساعت`
	}
	return 'کمتر از ۱ ساعت'
}

export function formatVipExpiryDate(vipExpiresAt?: string | null): string {
	if (!vipExpiresAt) return ''
	try {
		const target = moment(vipExpiresAt)
		if (!target.isValid()) return ''
		return target.locale('fa').format('jD jMMMM jYYYY')
	} catch {
		return ''
	}
}
