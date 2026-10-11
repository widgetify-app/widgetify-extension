import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react'
import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { contactStepOfError } from '@/common/utils/contact-step'
import { useAuth } from '@/context/auth.context'
import { useAccountContact } from '@/features/setting/account/account-contact.context'
import { usePartnerConsent } from '@/services/widgets/partner-consent.hook'
import { PartnerConsentModal } from './components/partner-consent-modal'
import type { PartnerCatalogItem } from './types'
import { contactStepOf } from './utils/partner-catalog/partner-access'
import { partnerCatalogStore } from './utils/partner-catalog/partner-catalog-store'

interface PartnerAccessContextType {
	ensureAccess: (widgetKey: string) => Promise<boolean>
}

interface ConsentRequest {
	item: PartnerCatalogItem
	resolve: (accepted: boolean) => void
}

const PartnerAccessContext = createContext<PartnerAccessContextType | null>(null)

export function PartnerAccessProvider({ children }: { children: ReactNode }) {
	const { isAuthenticated, user } = useAuth()
	const { requestContact } = useAccountContact()
	const { mutateAsync: sendConsent } = usePartnerConsent()
	const [request, setRequest] = useState<ConsentRequest | null>(null)

	const session = useRef({ isAuthenticated, user })

	session.current = { isAuthenticated, user }

	const askConsent = useCallback(
		(item: PartnerCatalogItem) =>
			new Promise<boolean>((resolve) => {
				setRequest({ item, resolve })
			}),
		[]
	)

	const ensureAccess = useCallback(
		async (widgetKey: string): Promise<boolean> => {
			const item = partnerCatalogStore
				.get()
				.items.find((entry) => entry.widgetKey === widgetKey)

			if (!item) return false

			if (!session.current.isAuthenticated) {
				callEvent('openProfile')
				return false
			}

			let account = session.current.user

			for (let attempt = 0; attempt < 2; attempt++) {
				const step = contactStepOf(item.scopes, item.contactRequirement, account)

				if (!step) break

				account = await requestContact(step)

				if (!account) return false
			}

			if (contactStepOf(item.scopes, item.contactRequirement, account)) return false

			if (item.scopes.length === 0) return true

			if (!(await askConsent(item))) return false

			for (let attempt = 0; attempt < 2; attempt++) {
				try {
					await sendConsent({ widgetKey })

					return true
				} catch (error) {
					const step = contactStepOfError(error)

					if (!step || attempt === 1 || !(await requestContact(step))) {
						showToast(t('widgets.partner.consentModal.failed'), 'error')

						return false
					}
				}
			}

			return false
		},
		[askConsent, requestContact, sendConsent]
	)

	const value = useMemo(() => ({ ensureAccess }), [ensureAccess])

	const resolve = (accepted: boolean) => {
		request?.resolve(accepted)
		setRequest(null)
	}

	return (
		<PartnerAccessContext.Provider value={value}>
			{children}

			<PartnerConsentModal item={request?.item ?? null} onResolve={resolve} />
		</PartnerAccessContext.Provider>
	)
}

export function usePartnerAccess(): PartnerAccessContextType {
	const context = useContext(PartnerAccessContext)

	if (!context) {
		throw new Error('usePartnerAccess must be used within a PartnerAccessProvider')
	}

	return context
}
