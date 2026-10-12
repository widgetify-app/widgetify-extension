import { getMainClient } from '@/services/api'

export const partnerConsentsKey = ['partnerWidgetConsents'] as const

export async function fetchPartnerConsentKeys(): Promise<string[]> {
	const client = getMainClient()
	const { data } = await client.get<{ widgetKeys: string[] }>(
		'/user-widgets/partner-consent'
	)

	return Array.isArray(data.widgetKeys) ? data.widgetKeys : []
}
