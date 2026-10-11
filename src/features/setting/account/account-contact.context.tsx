import { createContext, type ReactNode, useCallback, useContext, useState } from 'react'
import { useAuth } from '@/context/auth.context'
import type { UserProfile } from '@/services/user/user-service.hook'
import { AddEmailModal } from './components/modals/add-email-modal'
import { AddPhoneModal } from './components/modals/add-phone-modal'

type ContactKind = 'phone' | 'email'

interface AccountContactContextType {
	requestContact: (kind: ContactKind) => Promise<UserProfile | null>
}

interface PendingRequest {
	kind: ContactKind
	resolve: (user: UserProfile | null) => void
}

const AccountContactContext = createContext<AccountContactContextType | null>(null)

export function AccountContactProvider({ children }: { children: ReactNode }) {
	const { refetchUser } = useAuth()
	const [pending, setPending] = useState<PendingRequest | null>(null)

	const requestContact = useCallback(
		(kind: ContactKind) =>
			new Promise<UserProfile | null>((resolve) => {
				setPending({ kind, resolve })
			}),
		[]
	)

	const finish = async (type: 'success' | 'cancel') => {
		const user = type === 'success' ? await refetchUser() : null

		pending?.resolve(user)
		setPending(null)
	}

	return (
		<AccountContactContext.Provider value={{ requestContact }}>
			{children}

			<AddPhoneModal isOpen={pending?.kind === 'phone'} onClose={finish} />

			<AddEmailModal show={pending?.kind === 'email'} onClose={finish} />
		</AccountContactContext.Provider>
	)
}

export function useAccountContact(): AccountContactContextType {
	const context = useContext(AccountContactContext)

	if (!context) {
		throw new Error('useAccountContact must be used within an AccountContactProvider')
	}

	return context
}
