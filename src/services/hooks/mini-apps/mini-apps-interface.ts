export enum MiniAppScopeEnum {
	PROFILE = 'PROFILE',
	ACCOUNT = 'ACCOUNT',
}
export interface MiniApp {
	appId: string
	name: string
	description: string
	icon: string
	backgroundColor: string
	order: number
	launchUrl: string
	origin: string
	requireAuth: boolean
	createdAt: string
	badge: string | null
	badgeColor: string | null
	badgeAnimate: boolean
	scopes: MiniAppScopeEnum[]
}

export interface MiniAppsListResponse {
	data: {
		miniApps: MiniApp[]
		totalPages: number
		totals: number
	}
}

export interface MiniAppLaunchResponse {
	data: {
		launchUrl: string
		origin: string
		data: string
		signature: string
	}
}
