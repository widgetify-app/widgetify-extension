export interface NetworkInfo {
	ip: string | null
	country: string | null
	countryIcon: string | null
	city: string | null
	isp: string | null
	ping: number | null
}

export interface NetworkViewProps {
	info: NetworkInfo
	isOnline: boolean
	isAuthenticated: boolean
	isInitialLoading: boolean
	isLoading: boolean
	hasError: boolean
	blurMode: boolean
	onRefresh: () => void
	onRetryOffline: () => void
}
