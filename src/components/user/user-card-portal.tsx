import { useEffect, useRef, useState } from 'react'
import { Motion, Presence } from '@/common/motion'
import { Portal } from '@/components/ui'
import { UserCard } from './user-card'

export interface UserCardUser {
	name: string
	avatar: string
	username: string | null
	userId?: string
	extras?: {
		activity?: string
		selectedWallpaper?: string
	}
	isSelf?: boolean
	friendshipStatus: 'PENDING' | 'ACCEPTED' | null
}

interface UserCardPortalProps {
	user: UserCardUser
	isOpen: boolean
	onClose: () => void
	triggerRef: React.RefObject<HTMLElement>
}

export function UserCardPortal({
	user,
	isOpen,
	onClose,
	triggerRef,
}: UserCardPortalProps) {
	const cardRef = useRef<HTMLDivElement>(null)
	const [position, setPosition] = useState({ top: 0, left: 0 })

	useEffect(() => {
		if (isOpen && triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect()
			setPosition({
				top: rect.bottom + window.scrollY,
				left: rect.left + rect.width / 2 + window.scrollX,
			})
		}
	}, [isOpen, triggerRef])

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				cardRef.current &&
				triggerRef.current &&
				!cardRef.current.contains(event.target as Node) &&
				!triggerRef.current.contains(event.target as Node)
			) {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen, onClose, triggerRef])

	return (
		<Portal>
			<Presence>
				{isOpen && (
					<Motion.div
						key="user-card"
						ref={cardRef}
						className="fixed z-popover shadow-lg min-w-64 max-w-64"
						initial={{ opacity: 0, scale: 0.95, x: '-50%' }}
						animate={{ opacity: 1, scale: 1, x: '-50%' }}
						exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
						transition={{ duration: 0.15, ease: 'easeOut' }}
						style={{
							top: `${position.top}px`,
							left: `${position.left}px`,
						}}
						dir="ltr"
					>
						<UserCard user={user} />
					</Motion.div>
				)}
			</Presence>
		</Portal>
	)
}
