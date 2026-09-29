import type { FetchedContent } from '@/services/content/get-content.hook'

export type CatalogItem = Pick<FetchedContent, 'links'>['links'][0]

export interface CategoryItem extends FetchedContent {}
