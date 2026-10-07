import { Motion as motion, Presence } from '@/common/motion'
import { useAuth } from '@/context/auth.context'
import AuthForm from './auth-form/auth-form'
import { UserProfile } from './user-profile/user-profile'

export const AccountTab = () => {
	const { isAuthenticated } = useAuth()

	return (
		<div className="w-full h-full">
			<Presence mode="wait" initial={false}>
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
						className="w-full max-w-sm mx-auto"
					>
						<AuthForm />
					</motion.div>
				)}
			</Presence>
		</div>
	)
}
