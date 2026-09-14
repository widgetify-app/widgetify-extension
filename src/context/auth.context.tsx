import { useQueryClient } from '@tanstack/react-query'
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import { clearStorage, getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import {
	type UserProfile,
	useGetUserProfile,
} from '@/services/hooks/user/user-service.hook'

interface AuthContextType {
	isAuthenticated: boolean
	token: string | null
	user: UserProfile | null
	isVip: boolean
	isLoadingUser: boolean
	profilePercentage: number
	isSuccessFetchingUser: boolean
	login: (token: string) => void
	logout: () => void
	refetchUser: () => Promise<UserProfile | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(null)
	const [cachedUser, setCachedUser] = useState<UserProfile | null>(null)
	const queryClient = useQueryClient()
	const [initialLoading, setInitialLoading] = useState(true)

	const {
		data: userProfile,
		refetch: userRefetch,
		isLoading,
		isSuccess,
	} = useGetUserProfile({
		enabled: !!token,
	})

	const activeUser = userProfile || cachedUser

	const logout = async () => {
		await clearStorage()
		setToken(null)
		setCachedUser(null)
		queryClient.invalidateQueries({ queryKey: ['userProfile'] })
	}

	useEffect(() => {
		async function loadAuth() {
			const [savedToken, savedProfile] = await Promise.all([
				getFromStorage('auth_token'),
				getFromStorage('profile'),
			])
			if (savedToken) {
				setToken(savedToken)
			}
			if (savedProfile) {
				setCachedUser(savedProfile)
			}
			setInitialLoading(false)
		}

		loadAuth()

		const logoutEvent = listenEvent('auth_logout', async () => {
			logout()
		})

		return () => {
			logoutEvent()
		}
	}, [])

	const login = (newToken: string) => {
		setToStorage('auth_token', newToken)
		setToken(newToken)
		queryClient.invalidateQueries({ queryKey: ['userProfile'] })
	}

	const refetchUser = async (): Promise<UserProfile | null> => {
		if (!token) return null
		try {
			const result = await userRefetch()
			return result.data || null
		} catch (error) {
			console.error('Failed to refetch user:', error)
			return null
		}
	}

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: !!token,
				token,
				user: activeUser || null,
				isVip: Boolean(activeUser?.isVip ?? false),
				isLoadingUser: initialLoading || (!!token && isLoading && !cachedUser),
				login,
				logout,
				profilePercentage:
					calculateProgressPercentage(activeUser?.progressbar || []) || 0,
				refetchUser,
				isSuccessFetchingUser: isSuccess,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}

function calculateProgressPercentage(progressArray: UserProfile['progressbar']) {
	if (!progressArray || progressArray.length === 0) {
		return 0
	}

	const doneItems = progressArray.filter((item) => item.isDone === true).length

	const percentage = Math.round((doneItems / progressArray.length) * 100)
	if (percentage === 100) return 0
	return percentage
}
