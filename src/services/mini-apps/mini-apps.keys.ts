export const miniAppsKeys = {
	one: (appId: string) => ['mini-app', appId] as const,
	list: (limit: number) => ['mini-apps', limit] as const,
}
