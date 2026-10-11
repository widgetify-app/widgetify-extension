import { useEffect, useRef } from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Badge, Button, Chip, TextInput, VipBadge } from '@/components/ui'
import { WidgetIcon } from '@/features/widgets/components/widget-icon'
import type {
	WidgetCategory,
	WidgetDefinition,
} from '@/features/widgets/utils/layout-engine/types'
import { Icon } from '@/icons'
import { widgetTitle } from '../../utils/partner-catalog/partner-definitions'
import type { CategoryItem } from '../types'
import type { CatalogView } from '../utils/catalog-filter'

interface AddWidgetGridProps {
	activeCategory: WidgetCategory
	onSelectCategory: (category: WidgetCategory) => void
	categories: CategoryItem[]
	categoryCounts: Record<WidgetCategory, number>
	query: string
	onQueryChange: (query: string) => void
	view: CatalogView<WidgetDefinition>
	selectedId: string
	onSelectWidget: (id: string) => void
	runtimeLayout: { id: string }[]
	isVip: boolean
	isWidgetVipOnly: (id: string) => boolean
	isWidgetNew: (id: string) => boolean
}

interface CardProps {
	definition: WidgetDefinition
	isSelected: boolean
	activeCount: number
	isNew: boolean
	showVip: boolean
	onSelect: () => void
}

function WidgetCard({
	definition,
	isSelected,
	activeCount,
	isNew,
	showVip,
	onSelect,
}: CardProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			aria-pressed={isSelected}
			data-widget-id={definition.id}
			className={cn(
				'flex items-center min-w-0 gap-2 p-2 rounded-2xl border text-start cursor-pointer transition-ui duration-150 focus-visible:focus-ring',
				isSelected
					? 'bg-brand-fill border-brand shadow-sm'
					: 'bg-surface-2 hover:bg-surface-3 border-surface-3'
			)}
		>
			<span
				className={cn(
					'flex items-center justify-center rounded-xl w-9 h-9 shrink-0 transition-ui',
					isSelected ? 'bg-brand-fill text-brand' : 'bg-fill text-fg-muted'
				)}
			>
				<WidgetIcon definition={definition} size={20} />
			</span>

			<span
				className={cn(
					'flex-1 min-w-0 text-xs truncate',
					isSelected ? 'font-bold text-brand' : 'font-medium text-fg'
				)}
			>
				{widgetTitle(definition, t)}
			</span>

			{(isNew || showVip || activeCount > 0) && (
				<span className="flex items-center gap-1 shrink-0">
					{isNew && <Badge>{t('widgets.catalog.badge.new')}</Badge>}
					{showVip && <VipBadge size="xs" text={t('ui.vip.pro')} />}
					{activeCount > 0 && (
						<span className="text-3xs px-1.5 py-0.5 rounded-lg bg-brand-fill text-brand font-medium">
							{definition.canDuplicate && activeCount > 1
								? activeCount
								: t('widgets.catalog.active')}
						</span>
					)}
				</span>
			)}
		</button>
	)
}

export function AddWidgetGrid({
	activeCategory,
	onSelectCategory,
	categories,
	categoryCounts,
	query,
	onQueryChange,
	view,
	selectedId,
	onSelectWidget,
	runtimeLayout,
	isVip,
	isWidgetVipOnly,
	isWidgetNew,
}: AddWidgetGridProps) {
	const listRef = useRef<HTMLDivElement>(null)
	const isSearching = query.trim().length > 0
	const isEmpty = view.fresh.length === 0 && view.rest.length === 0

	useEffect(() => {
		const cards = listRef.current?.querySelectorAll<HTMLElement>('[data-widget-id]')
		const card = Array.from(cards ?? []).find(
			(element) => element.dataset.widgetId === selectedId
		)

		card?.scrollIntoView({ block: 'nearest' })
	}, [selectedId])

	const renderCards = (list: WidgetDefinition[]) => (
		<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
			{list.map((definition) => (
				<WidgetCard
					key={definition.id}
					definition={definition}
					isSelected={definition.id === selectedId}
					activeCount={
						runtimeLayout.filter((item) => item.id === definition.id).length
					}
					isNew={isWidgetNew(definition.id)}
					showVip={!isVip && isWidgetVipOnly(definition.id)}
					onSelect={() => onSelectWidget(definition.id)}
				/>
			))}
		</div>
	)

	const restTitle = isSearching
		? t('widgets.catalog.section.results')
		: view.fresh.length > 0
			? t('widgets.catalog.section.all')
			: null

	return (
		<div className="flex flex-col w-full gap-2 pb-3 pl-0 border-b md:min-h-0 md:w-6/12 md:border-b-0 md:border-l border-line md:pl-3 md:pb-0">
			<div className="relative shrink-0">
				<span className="absolute inset-y-0 flex items-center pointer-events-none text-fg-faint start-3">
					<Icon name="search" size={14} />
				</span>

				<TextInput
					value={query}
					onChange={onQueryChange}
					placeholder={t('widgets.catalog.search.placeholder')}
					aria-label={t('widgets.catalog.search.placeholder')}
					size="sm"
					className="ps-9 pe-8"
				/>

				{isSearching && (
					<Button
						type="button"
						size="xs"
						variant="ghost"
						rounded="full"
						onClick={() => onQueryChange('')}
						aria-label={t('widgets.catalog.search.clear')}
						className="absolute px-1! -translate-y-1/2 top-1/2 end-1.5"
					>
						<Icon name="close" size={12} />
					</Button>
				)}
			</div>

			<nav
				aria-label={t('widgets.catalog.filterAria')}
				className={cn(
					'flex flex-wrap gap-1.5 pb-2 border-b shrink-0 border-line transition-ui',
					isSearching && 'opacity-50'
				)}
			>
				{categories.map((category) => (
					<Chip
						key={category.id}
						onClick={() => onSelectCategory(category.id)}
						size="sm"
						selected={!isSearching && activeCategory === category.id}
						className="gap-1"
					>
						{t(category.labelKey)}
						<span className="font-normal text-fg-faint">
							{categoryCounts[category.id]}
						</span>
					</Chip>
				))}
			</nav>

			<div
				ref={listRef}
				className="flex flex-col gap-3 pr-0.5 scrollbar-none md:flex-1 md:overflow-y-auto"
			>
				{isEmpty ? (
					<div className="flex flex-col items-center justify-center h-32 gap-2 text-xs text-fg-muted">
						<span>{t('widgets.catalog.emptySearch')}</span>
						<Button
							type="button"
							size="xs"
							variant="outline"
							rounded="xl"
							onClick={() => {
								onQueryChange('')
								onSelectCategory('all')
							}}
						>
							{t('widgets.catalog.showAll')}
						</Button>
					</div>
				) : (
					<>
						{view.fresh.length > 0 && (
							<section className="flex flex-col gap-2">
								<h4 className="text-2xs font-bold text-brand">
									{t('widgets.catalog.section.new')}
								</h4>
								{renderCards(view.fresh)}
							</section>
						)}

						{view.rest.length > 0 && (
							<section className="flex flex-col gap-2">
								{restTitle && (
									<h4 className="text-2xs font-bold text-fg-muted">
										{restTitle}
									</h4>
								)}
								{renderCards(view.rest)}
							</section>
						)}
					</>
				)}
			</div>
		</div>
	)
}
