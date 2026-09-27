export const marketKeys = {
	items: (params: unknown) => ['getMarketItems', params] as const,
	inventory: (params: unknown) => ['getUserInventory', params] as const,
	coinPackages: (params: unknown) => ['coinPackages', params] as const,
	vipPlans: ['vipPlans'] as const,
}
