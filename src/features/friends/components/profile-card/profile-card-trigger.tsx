import { type ReactNode, useCallback, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { PopoverMenu } from '@/components/ui'
import {
	useGetFriendCard,
	usePrefetchFriendCard,
} from '@/services/friends/friend-service.hook'
import { callEvent } from '@/common/utils/call-event'
import { ProfileCard } from './profile-card'

const CARD_WIDTH = 300

const CARD_BOTTOM_GAP = 12

interface ProfileCardTriggerProps {
	username: string
	name: string
	children: ReactNode
	className?: string
}

export function ProfileCardTrigger({
	username,
	name,
	children,
	className,
}: ProfileCardTriggerProps) {
	const triggerRef = useRef<HTMLButtonElement>(null)
	const [isOpen, setIsOpen] = useState(false)
	const close = useCallback(() => setIsOpen(false), [])
	const card = useGetFriendCard(username, isOpen)
	const prefetch = usePrefetchFriendCard()

	const toggle = () => {
		if (!isOpen) Analytics.event('friends_card_opened')
		setIsOpen(!isOpen)
	}

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				aria-haspopup="dialog"
				aria-expanded={isOpen}
				aria-label={t('friends.card.open', { name })}
				onClick={toggle}
				onPointerEnter={() => prefetch(username)}
				onFocus={() => prefetch(username)}
				aria-busy={isOpen && card.isLoading}
				className={cn(
					'cursor-pointer text-start rounded-xl focus-visible:focus-ring aria-busy:cursor-progress',
					className
				)}
			>
				{children}
			</button>

			<PopoverMenu
				isOpen={isOpen}
				onClose={close}
				triggerRef={triggerRef}
				width={CARD_WIDTH}
				ready={!card.isLoading}
				bottomGap={CARD_BOTTOM_GAP}
				className="p-0 overflow-hidden"
			>
				{isOpen && (
					<ProfileCard
						username={username}
						onOpenLook={(target) => {
							setIsOpen(false)
							callEvent('openFriendLook', target)
						}}
					/>
				)}
			</PopoverMenu>
		</>
	)
}
