import { useEffect } from 'react'
import { Modal } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import AuthForm from './auth-form/auth-form'
interface FriendSettingModalProps {
	isOpen: boolean
	onClose: () => void
	selectedTab?: string | null
}
export const UserAccountModal = ({ isOpen, onClose }: FriendSettingModalProps) => {
	const { isAuthenticated } = useAuth()

	useEffect(() => {
		if (isAuthenticated && isOpen) {
			onClose()
		}
	}, [isAuthenticated, isOpen, onClose])

	if (!isAuthenticated)
		return (
			<Modal isOpen={isOpen} onClose={onClose} size="sm" direction="rtl" title=" ">
				<AuthForm />
			</Modal>
		)

	return null
}
