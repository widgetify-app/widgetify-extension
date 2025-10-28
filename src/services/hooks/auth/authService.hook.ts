import { useMutation } from '@tanstack/react-query'
import { setToStorage } from '@/common/storage'
import { getMainClient } from '@/services/api'

interface LoginCredentials {
	password: string
	email: string
}

export type ReferralSource = 'social' | 'youtube' | 'friends' | 'search_other'

interface SignUpCredentials {
	name: string
	email: string
	password: string
	referralSource?: ReferralSource | null
	referralCode?: string
}

interface AuthResponse {
	statusCode: number
	message: string | null
	data: string // token
}

interface User {
	name: string
	gender?: 'MALE' | 'FEMALE' | 'OTHER'
	birthdate?: string
	avatar?: string
}

async function signIn(credentials: LoginCredentials): Promise<AuthResponse> {
	const client = await getMainClient()
	const response = await client.post<AuthResponse>('/auth/signin', credentials)

	if (response.headers?.refresh_token) {
		await setToStorage('refresh_token', response.headers.refresh_token)
	}

	return response.data
}

async function signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
	const client = await getMainClient()
	const response = await client.post<AuthResponse>('/auth/signup', credentials)

	if (response.headers?.refresh_token) {
		await setToStorage('refresh_token', response.headers.refresh_token)
	}

	return response.data
}

async function updateUserProfile(formData: FormData): Promise<User> {
	const api = await getMainClient()
	const response = await api.patch('/users/@me', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})
	return response.data
}

async function updateUsername(username: string): Promise<User> {
	const api = await getMainClient()
	const response = await api.put('/users/@me/username', {
		username,
	})
	return response.data
}

export function useSignIn() {
	return useMutation({
		mutationFn: (credentials: LoginCredentials) => signIn(credentials),
	})
}

export function useSignUp() {
	return useMutation({
		mutationFn: (credentials: SignUpCredentials) => signUp(credentials),
	})
}

export function useUpdateUserProfile() {
	return useMutation({
		mutationFn: (formData: FormData) => updateUserProfile(formData),
	})
}

export function useUpdateUsername() {
	return useMutation({
		mutationFn: (username: string) => updateUsername(username),
	})
}
