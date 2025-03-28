import { getFromStorage, removeFromStorage, setToStorage } from '@/common/storage'
import {
	type UserProfile,
	useGetUserProfile,
} from '@/services/getMethodHooks/user/userService.hook'
import { useQueryClient } from '@tanstack/react-query'
import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
	isAuthenticated: boolean
	token: string | null
	user: UserProfile | null
	isLoadingUser: boolean
	login: (token: string) => void
	logout: () => void
	refetchUser: () => Promise<UserProfile | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(null)
	const queryClient = useQueryClient()
	const [initialLoading, setInitialLoading] = useState(true)

	const {
		data: userProfile,
		refetch: userRefetch,
		isLoading,
	} = useGetUserProfile({
		enabled: !!token,
	})

	useEffect(() => {
		async function loadToken() {
			const savedToken = await getFromStorage('auth_token')
			if (savedToken) {
				setToken(savedToken)
			}
			setInitialLoading(false)
		}

		loadToken()
	}, [])

	const login = (newToken: string) => {
		setToStorage('auth_token', newToken)
		setToken(newToken)
		queryClient.invalidateQueries({ queryKey: ['userProfile'] })
	}

	const logout = () => {
		removeFromStorage('auth_token')
		removeFromStorage('profile')
		setToken(null)
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
				user: userProfile || null,
				isLoadingUser: initialLoading || (!!token && isLoading),
				login,
				logout,
				refetchUser,
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
