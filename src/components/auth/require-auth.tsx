import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import { Button } from '../button/button'

interface RequireAuthProps {
	children: ReactNode
	fallback?: ReactNode
	mode?: 'block' | 'preview'
}

export const RequireAuth = ({ children, fallback, mode = 'block' }: RequireAuthProps) => {
	const { isAuthenticated, isLoadingUser } = useAuth()

	const handleAuthClick = () => {
		callEvent('openProfile')
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
				<div className="relative w-full h-full overflow-hidden">
					<div className="w-full h-full px-2 py-1 pointer-events-none opacity-60">
						{children}
					</div>
					<div
						className={
							'absolute inset-0 p-4 flex flex-col items-center justify-center gap-y-2 bg-base-300/5 backdrop-blur-xs rounded-xl'
						}
					>
						<h3 className="text-lg font-semibold">
							نیاز ورود به حساب کاربری
						</h3>
						<p className={'text-xs text-content text-center'}>
							برای دسترسی به این بخش، لطفاً وارد حساب کاربری خود شوید.
						</p>
						<Button
							onClick={handleAuthClick}
							size="sm"
							isPrimary={true}
							className="btn mt-2 !w-fit px-6 border-none shadow-none text-white rounded-3xl transition-colors duration-300 ease-in-out"
						>
							ورود به حساب
						</Button>
					</div>
				</div>
			)
		}

		return fallback ? (
			fallback
		) : (
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				className={
					'flex h-full flex-col items-center justify-center p-4 text-center rounded-md text-content'
				}
			>
				<h3 className="mb-2 text-xl font-semibold">نیاز ورود به حساب کاربری</h3>
				<p className={'text-xs mb-4 text-content text-center'}>
					برای دسترسی به این بخش، لطفاً وارد حساب کاربری خود شوید.
				</p>
				<Button onClick={handleAuthClick} size="sm">
					ورود به حساب
				</Button>
			</motion.div>
		)
	}

	return <>{children}</>
}
