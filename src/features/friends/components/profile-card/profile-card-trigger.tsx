import { type ReactNode, useCallback, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { PopoverMenu } from '@/components/ui'
import { callEvent } from '@/common/utils/call-event'
import { ProfileCard } from './profile-card'

const CARD_WIDTH = 300

const CARD_BOTTOM_GAP = 12

const CARD_HEIGHT = 300

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
				className={cn(
					'cursor-pointer text-start rounded-xl focus-visible:focus-ring',
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
				reserveHeight={CARD_HEIGHT}
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
