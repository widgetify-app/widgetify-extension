import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { UserCard } from './user-card'

export interface UserCardUser {
	name: string
	avatar: string
	username: string
	userId?: string
	extras?: {
		activity?: string
		selectedWallpaper?: string
	}
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

	if (!isOpen) return null

	return createPortal(
		<div
			ref={cardRef}
			className="fixed z-50 shadow-lg min-w-64 max-w-64"
			style={{
				top: `${position.top}px`,
				left: `${position.left}px`,
				transform: 'translateX(-50%)',
			}}
			dir="ltr"
		>
			<UserCard user={user} />
		</div>,
		document.body
	)
}
