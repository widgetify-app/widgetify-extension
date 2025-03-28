import { getFromStorage, removeFromStorage, setToStorage } from '@/common/storage'
import { useQueryClient } from '@tanstack/react-query'
import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
	isAuthenticated: boolean
	token: string | null
	login: (token: string) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(null)
	const queryClient = useQueryClient()

	useEffect(() => {
		async function loadToken() {
			const savedToken = await getFromStorage('auth_token')
			if (savedToken) {
				setToken(savedToken)
			}
		}

		loadToken()
	}, [])

	const login = (newToken: string) => {
		setToStorage('auth_token', newToken)
		setToken(newToken)
	}

	const logout = () => {
		removeFromStorage('auth_token')
		setToken(null)
		queryClient.invalidateQueries({ queryKey: ['userProfile'] })
	}

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: !!token,
				token,
				login,
				logout,
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
