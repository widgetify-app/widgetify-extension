const inventoryRoot = ['getUserInventory'] as const

export const marketKeys = {
	items: (params: unknown) => ['getMarketItems', params] as const,
	inventoryAll: inventoryRoot,
	inventory: (params: unknown) => [...inventoryRoot, params] as const,
	coinPackages: (params: unknown) => ['coinPackages', params] as const,
	vipPlans: ['vipPlans'] as const,
}
