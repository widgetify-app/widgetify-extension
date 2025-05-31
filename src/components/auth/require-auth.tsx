import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Button } from '../button/button'

interface RequireAuthProps {
	children: ReactNode
	fallback?: ReactNode
	mode?: 'block' | 'preview'
}

export const RequireAuth = ({ children, fallback, mode = 'block' }: RequireAuthProps) => {
	const { isAuthenticated, isLoadingUser } = useAuth()

	const handleAuthClick = () => {
		callEvent('openSettings', 'account')
	}

	if (isLoadingUser) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<div className="w-10 h-10 mx-auto border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
					<p className="mt-2">در حال بارگذاری...</p>
				</div>
			</div>
		)
	}

	if (!isAuthenticated) {
		if (mode === 'preview') {
			return (
				<div className="relative w-full h-full">
					<div className="w-full h-full px-2 py-1 pointer-events-none opacity-60">
						{children}
					</div>
					<div
						className={
							'absolute inset-0 flex flex-col items-center justify-center p-4 bg-base-300/5 backdrop-blur-xs'
						}
					>
						<h3 className="mb-2 text-xl font-semibold">نیاز به احراز هویت</h3>
						<p className={'text-sm mb-4 text-content'}>
							برای دسترسی به این بخش، لطفاً وارد حساب کاربری خود شوید.
						</p>
						<Button onClick={handleAuthClick} size="md" isPrimary={true}>
							ورود به حساب
						</Button>
					</div>
				</div>
			)
		}

		return fallback ? (
			<>{fallback}</>
		) : (
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				className={
					'flex h-full flex-col items-center justify-center p-4 text-center rounded-md text-content'
				}
			>
				<h3 className="mb-2 text-xl font-semibold">نیاز به احراز هویت</h3>
				<p className={'text-sm mb-4 text-content'}>
					برای دسترسی به این بخش، لطفاً وارد حساب کاربری خود شوید.
				</p>
				<Button onClick={handleAuthClick} size="md">
					ورود به حساب
				</Button>
			</motion.div>
		)
	}

	return <>{children}</>
}
