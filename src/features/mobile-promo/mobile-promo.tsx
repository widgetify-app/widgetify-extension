import { useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useAuth } from '@/context/auth.context'
import { useGetUserProfile } from '@/services/user/user-service.hook'
import { MobilePromoCard } from './components/mobile-promo-card'
import { useModalOpen } from './hooks/use-modal-open'
import { shouldShowMobilePromo } from './utils/show-rule'

export function MobilePromo() {
	const { isAuthenticated } = useAuth()
	const { data: profile } = useGetUserProfile({ enabled: isAuthenticated })
	const [closedAt, setClosedAt] = useState<number | null | undefined>(undefined)
	const [open, setOpen] = useState(true)
	const modalOpen = useModalOpen()
	const announced = useRef(false)

	useEffect(() => {
		getFromStorage('mobilePromoClosedAt').then((saved) => setClosedAt(saved ?? null))
	}, [])

	const show =
		open &&
		closedAt !== undefined &&
		shouldShowMobilePromo({
			signedIn: isAuthenticated,
			profileLoaded: profile !== undefined,
			linked: profile?.mobileV2?.linked === true,
			modalOpen,
			closedAt: closedAt ?? undefined,
			now: Date.now(),
		})

	useEffect(() => {
		if (!show || announced.current) return

		announced.current = true
		Analytics.event('mobile_promo_shown')
	}, [show])

	if (!show) return null

	const close = () => {
		setToStorage('mobilePromoClosedAt', Date.now())
		Analytics.event('mobile_promo_closed')
		setOpen(false)
	}

	return <MobilePromoCard onClose={close} />
}
