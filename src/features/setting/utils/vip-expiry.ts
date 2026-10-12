import { t } from '@/common/i18n'
import moment from 'jalali-moment'

export function formatVipRemaining(vipExpiresAt?: string | null): string {
	if (!vipExpiresAt) return ''
	const target = moment(vipExpiresAt)
	const now = moment()
	const diffDays = target.diff(now, 'days')
	const diffHours = target.diff(now, 'hours')

	if (target.isBefore(now)) {
		return t('setting.vipExpiry.expired')
	}

	const fmt = new Intl.NumberFormat('fa-IR').format
	if (diffDays > 0) {
		return t('setting.vipExpiry.daysLeft', { p0: fmt(diffDays) })
	}
	if (diffHours > 0) {
		return t('setting.vipExpiry.hoursLeft', { p0: fmt(diffHours) })
	}
	return t('setting.vipExpiry.underOneHour')
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
