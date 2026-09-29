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
	isNew: boolean
	origin: string
	requireAuth: boolean
	createdAt: string
	badge: string | null
	badgeColor: string | null
	badgeAnimate: boolean
	allowPermission: string[]
	timeout?: number
	sandboxPermission: string[]
	scopes: MiniAppScopeEnum[]
}

export interface SingleMiniApp extends MiniApp {
	isLaunchedByUser: boolean
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
