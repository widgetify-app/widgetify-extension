import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import {
  getButtonStyles,
  getDescriptionTextStyle,
  useTheme,
} from '@/context/theme.context'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RequireAuthProps {
  children: ReactNode
  fallback?: ReactNode
  mode?: 'block' | 'preview'
}

export const RequireAuth = ({
  children,
  fallback,
  mode = 'block',
}: RequireAuthProps) => {
  const { isAuthenticated, isLoadingUser } = useAuth()
  const { theme } = useTheme()

  const getAuthMessageStyles = () => {
    switch (theme) {
      case 'light':
        return 'bg-gray-100 text-gray-700'
      case 'dark':
        return 'bg-gray-800 text-gray-200'
      default:
        return 'bg-white/5 text-gray-200 backdrop-blur-sm'
    }
  }

  const getOverlayStyles = () => {
    switch (theme) {
      case 'light':
        return 'bg-gray-100/70 text-gray-700'
      case 'dark':
        return 'bg-neutral-900/80 text-gray-200'
      default:
        return 'bg-black/30 text-gray-200 backdrop-blur-sm'
    }
  }

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
            className={`absolute inset-0 flex flex-col items-center justify-center p-4 ${getOverlayStyles()}`}
          >
            <h3 className="mb-2 text-xl font-semibold">نیاز به احراز هویت</h3>
            <p className={`text-sm mb-4 ${getDescriptionTextStyle(theme)}`}>
              برای دسترسی به این بخش، لطفاً وارد حساب کاربری خود شوید.
            </p>
            <button
              onClick={handleAuthClick}
              className={`px-4 py-2 cursor-pointer rounded-md transition-colors ${getButtonStyles(theme)}`}
            >
              ورود به حساب
            </button>
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
        className={`flex h-full flex-col items-center justify-center p-4 text-center rounded-md ${getAuthMessageStyles()}`}
      >
        <h3 className="mb-2 text-xl font-semibold">نیاز به احراز هویت</h3>
        <p className={`text-sm mb-4 ${getDescriptionTextStyle(theme)}`}>
          برای دسترسی به این بخش، لطفاً وارد حساب کاربری خود شوید.
        </p>
        <button
          onClick={handleAuthClick}
          className={`px-4 py-2 cursor-pointer rounded-md transition-colors ${getButtonStyles(theme)}`}
        >
          ورود به حساب
        </button>
      </motion.div>
    )
  }

  return <>{children}</>
}
