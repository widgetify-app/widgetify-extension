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

export interface AuthResponse {
	statusCode: number
	message: string | null
	data: string // token
	isNewUser?: boolean
}
interface GoogleAuthCredentials {
	token: string
	referralCode?: string
}

interface OtpPayload {
	email?: string
	phone?: string
}

interface OtpVerifyPayload {
	email?: string
	phone?: string
	code: string
}

interface WizardPayload {
	occupationId: string

	interestsIds: string[]

	referralSource: ReferralSource

	referralCode?: string
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

async function updateUserProfile(formData: FormData): Promise<any> {
	const api = await getMainClient()
	const response = await api.patch('/users/@me', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})
	return response.data
}

async function updateUsername(username: string): Promise<any> {
	const api = await getMainClient()
	const response = await api.put('/users/@me/username', {
		username,
	})
	return response.data
}

async function googleSignIn(credentials: GoogleAuthCredentials): Promise<AuthResponse> {
	const client = await getMainClient()
	const response = await client.post<AuthResponse>('/auth/oauth/google', credentials)

	if (response.headers?.refresh_token) {
		await setToStorage('refresh_token', response.headers.refresh_token)
	}

	return response.data
}

async function requestOtp(payload: OtpPayload): Promise<any> {
	const client = await getMainClient()

	const response = await client.post('/auth/otp', payload)

	return response.data
}

async function verifyOtp(payload: OtpVerifyPayload): Promise<AuthResponse> {
	const client = await getMainClient()
	const response = await client.post('/auth/otp/verify', payload)

	if (response.headers?.refresh_token) {
		await setToStorage('refresh_token', response.headers.refresh_token)
	}

	return response.data
}

async function setupWizard(data: WizardPayload): Promise<any> {
	const client = await getMainClient()
	const response = await client.post('/users/@me/complete-wizard', data)
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

export function useGoogleSignIn() {
	return useMutation({
		mutationFn: (credentials: GoogleAuthCredentials) => googleSignIn(credentials),
	})
}

export function useRequestOtp() {
	return useMutation({
		mutationFn: (payload: OtpPayload) => requestOtp(payload),
	})
}

export function useVerifyOtp() {
	return useMutation({
		mutationFn: (payload: OtpVerifyPayload) => verifyOtp(payload),
	})
}

export function useSetupWizard() {
	return useMutation({
		mutationFn: (data: WizardPayload) => setupWizard(data),
	})
}
