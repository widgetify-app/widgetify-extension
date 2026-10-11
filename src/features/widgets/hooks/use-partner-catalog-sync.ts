import { useEffect } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useGetWidgetCatalog } from '@/services/widgets/widget-catalog.hook'
import {
	normalizePartnerCatalog,
	partnerItemsOf,
} from '../utils/partner-catalog/normalize-partner-catalog'
import { partnerCatalogStore } from '../utils/partner-catalog/partner-catalog-store'

export async function hydratePartnerCatalog(): Promise<void> {
	if (partnerCatalogStore.get().ready) return

	const stored = await getFromStorage('partnerWidgetCatalog')

	if (Array.isArray(stored)) {
		partnerCatalogStore.set(normalizePartnerCatalog(stored))
	}
}

export function usePartnerCatalogSync(): void {
	const { data, isFetched } = useGetWidgetCatalog(true)

	useEffect(() => {
		if (!data) return

		const raw = partnerItemsOf(data)

		partnerCatalogStore.set(normalizePartnerCatalog(raw))
		setToStorage('partnerWidgetCatalog', raw)
	}, [data])

	useEffect(() => {
		if (isFetched && !data) partnerCatalogStore.markReady()
	}, [isFetched, data])
}
