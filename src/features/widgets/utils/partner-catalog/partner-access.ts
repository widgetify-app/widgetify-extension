import type { MessageKey } from '@/common/i18n'
import type { ContactRequirement, PartnerScope } from '../../types'
import type { ContactStep } from '@/common/utils/contact-step'

interface ContactUser {
	email?: string | null
	phone?: string | null
	verified?: boolean
}

export function contactStepOf(
	scopes: PartnerScope[],
	requirement: ContactRequirement,
	user: ContactUser | null
): ContactStep | null {
	if (!scopes.includes('ACCOUNT')) return null

	const hasPhone = Boolean(user?.phone)
	const hasEmail = Boolean(user?.email)

	if (requirement === 'PHONE') return hasPhone ? null : 'phone'

	if (requirement === 'EMAIL') {
		return hasEmail && user?.verified === true ? null : 'email'
	}

	return hasPhone || hasEmail ? null : 'phone'
}

export function consentLines(
	scopes: PartnerScope[],
	requirement: ContactRequirement
): MessageKey[] {
	const lines: MessageKey[] = []

	if (scopes.includes('PROFILE')) lines.push('widgets.partner.consent.scope.profile')

	if (scopes.includes('ACCOUNT')) {
		lines.push(
			requirement === 'PHONE'
				? 'widgets.partner.consent.scope.phone'
				: requirement === 'EMAIL'
					? 'widgets.partner.consent.scope.email'
					: 'widgets.partner.consent.scope.account'
		)
	}

	return lines
}
