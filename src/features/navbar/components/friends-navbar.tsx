import { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth.context'
import { BottomSheet } from '@/components/ui'
import { FriendsDirectView } from '@/features/friends/friends'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import Analytics from '@/analytics'
import { NavIconButton } from './nav-icon-button'
import { t } from '@/common/i18n'

export function FriendsListNavbar() {
	const { user, isAuthenticated } = useAuth()

	const [isOpen, setIsOpen] = useState(false)
	const [openRequests, setOpenRequests] = useState(false)
	const [openCount, setOpenCount] = useState(0)

	const clickToOpenSheet = () => {
		if (!isOpen) {
			Analytics.event('friends_navbar_opened')
		}

		setIsOpen(!isOpen)
	}

	useEffect(() => {
		const closeEvent = listenEvent('close_friends_bottomSheet', () =>
			setIsOpen(false)
		)
		const openEvent = listenEvent('openFriends', (target) => {
			if (!isAuthenticated) {
				callEvent('open_require_auth_modal')
				return
			}

			setOpenRequests(target?.tab === 'requests')
			setOpenCount((count) => count + 1)
			setIsOpen(true)
		})
		return () => {
			closeEvent()
			openEvent()
		}
	}, [isAuthenticated])

	if (!isAuthenticated) {
		return null
	}

	const hasPendingRequests = (user?.friendshipStats?.pending ?? 0) > 0

	return (
		<>
			<NavIconButton
				icon="friends"
				label={
					hasPendingRequests
						? t('navbar.friends.newRequest')
						: t('navbar.friends.label')
				}
				onClick={clickToOpenSheet}
			>
				{hasPendingRequests && (
					<span
						aria-hidden="true"
						className="absolute z-20 w-2 h-2 rounded-full bg-danger top-1 right-1"
					/>
				)}
			</NavIconButton>

			<BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<div className="h-full">
					<FriendsDirectView key={openCount} openRequests={openRequests} />
				</div>
			</BottomSheet>
		</>
	)
}
