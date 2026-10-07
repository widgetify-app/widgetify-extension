const inventoryRoot = ['getUserInventory'] as const
const itemsRoot = ['getMarketItems'] as const

export const marketKeys = {
	itemsAll: itemsRoot,
	items: (params: unknown) => [...itemsRoot, params] as const,
	inventoryAll: inventoryRoot,
	inventory: (params: unknown) => [...inventoryRoot, params] as const,
	coinPackages: (params: unknown) => ['coinPackages', params] as const,
	vipPlans: ['vipPlans'] as const,
}
