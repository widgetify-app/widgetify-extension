import type { FetchedContent } from '@/services/hooks/content/get-content.hook'

export type CatalogItem = Pick<FetchedContent, 'links'>['links'][0]
