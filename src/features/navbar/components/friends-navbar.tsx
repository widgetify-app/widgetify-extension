import { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth.context'
import { BottomSheet } from '@/components/ui'
import { FriendsDirectView } from '@/features/friends/friends'
import { listenEvent } from '@/common/utils/call-event'
import Analytics from '@/analytics'
import { NavIconButton } from './nav-icon-button'

export function FriendsListNavbar() {
	const { user, isAuthenticated } = useAuth()

	const [isOpen, setIsOpen] = useState(false)

	const clickToOpenSheet = () => {
		if (!isOpen) {
			Analytics.event('friends_navbar_opened')
		}

		setIsOpen(!isOpen)
	}

	useEffect(() => {
		const event = listenEvent('close_friends_bottomSheet', () => setIsOpen(false))
		return () => {
			event()
		}
	}, [])

	if (!isAuthenticated) {
		return null
	}

	const hasPendingRequests = (user?.friendshipStats?.pending ?? 0) > 0

	return (
		<>
			<NavIconButton
				icon="friends"
				label={hasPendingRequests ? 'دوستان، درخواست دوستی جدید داری' : 'دوستان'}
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
				<div className="pt-2 h-[calc(50vh-2rem)]">
					<FriendsDirectView />
				</div>
			</BottomSheet>
		</>
	)
}
