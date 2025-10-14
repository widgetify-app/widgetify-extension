import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '@/context/auth.context'
import { AuthForm } from './auth-form/auth-form'
import { UserProfile } from './user-profile'

export const AccountTab = () => {
	const { isAuthenticated } = useAuth()

	return (
		<div className="h-full">
			<AnimatePresence mode="wait">
				{isAuthenticated ? (
					<motion.div
						key="profile"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.3 }}
						className="h-full"
					>
						<UserProfile />
					</motion.div>
				) : (
					<motion.div
						key="auth"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.3 }}
						className="h-full"
					>
						<AuthForm />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
