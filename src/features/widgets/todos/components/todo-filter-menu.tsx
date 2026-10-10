import { t } from '@/common/i18n'
import { useCallback, useRef, useState } from 'react'
import { Chip, PopoverMenu, PopoverMenuDivider } from '@/components/ui'
import { WidgetHeaderButton } from '@/features/widgets/components/widget-header'
import { Icon } from '@/icons'
import { DATE_FILTER_OPTIONS, SORT_OPTIONS, type TodoFilterOption } from '../constants'
import { activeTodoFilters, type TodoFilterKind } from '../utils/active-filters'

interface TodoFilterMenuProps {
	dateFilter: string
	sort: string
	tagFilter: string
	tagOptions: TodoFilterOption[]
	onDateFilterChange: (value: string) => void
	onSortChange: (value: string) => void
	onTagFilterChange: (value: string) => void
}

export function TodoFilterMenu({
	dateFilter,
	sort,
	tagFilter,
	tagOptions,
	onDateFilterChange,
	onSortChange,
	onTagFilterChange,
}: TodoFilterMenuProps) {
	const [isOpen, setIsOpen] = useState(false)
	const triggerRef = useRef<HTMLButtonElement>(null)
	const close = useCallback(() => setIsOpen(false), [])

	const isFiltered = activeTodoFilters(dateFilter, tagFilter, sort).length > 0

	const sections = [
		{
			label: t('widgets.todos.filter.time'),
			options: DATE_FILTER_OPTIONS,
			value: dateFilter,
			onChange: onDateFilterChange,
		},
		{
			label: t('widgets.todos.filter.tag'),
			options: tagOptions,
			value: tagFilter || '-all-',
			onChange: onTagFilterChange,
		},
		{
			label: t('widgets.todos.filter.sort'),
			options: SORT_OPTIONS,
			value: sort,
			onChange: onSortChange,
		},
	].filter((section) => section.options.length > 0)

	return (
		<>
			<WidgetHeaderButton
				ref={triggerRef}
				label={t('widgets.todos.filter.label')}
				icon="filter"
				isActive={isFiltered || isOpen}
				onClick={() => setIsOpen(!isOpen)}
			/>
			<PopoverMenu
				isOpen={isOpen}
				onClose={close}
				triggerRef={triggerRef}
				placement="bottom-start"
				width={214}
			>
				{sections.map((section, index) => (
					<section key={section.label} aria-label={section.label}>
						{index > 0 && <PopoverMenuDivider />}
						<div className="flex flex-col gap-1.5 px-2 py-1.5">
							<span className="font-semibold text-2xs text-fg-faint">
								{section.label}
							</span>
							<div className="flex flex-wrap gap-1">
								{section.options.map((option) => (
									<Chip
										key={option.value}
										size="sm"
										selected={section.value === option.value}
										onClick={() => section.onChange(option.value)}
									>
										{option.label}
									</Chip>
								))}
							</div>
						</div>
					</section>
				))}
			</PopoverMenu>
		</>
	)
}

type TodoFilterChipsProps = Omit<TodoFilterMenuProps, 'tagOptions'>

export function TodoFilterChips({
	dateFilter,
	sort,
	tagFilter,
	onDateFilterChange,
	onSortChange,
	onTagFilterChange,
}: TodoFilterChipsProps) {
	const filters = activeTodoFilters(dateFilter, tagFilter, sort)
	if (filters.length === 0) return null

	const clear: Record<TodoFilterKind, () => void> = {
		date: () => onDateFilterChange('all'),
		tag: () => onTagFilterChange('-all-'),
		sort: () => onSortChange('def'),
	}

	return (
		<div className="flex items-center min-w-0 gap-1 overflow-x-auto scrollbar-none">
			{filters.map((filter) => (
				<TodoFilterChip
					key={filter.kind}
					label={filter.label}
					onClear={clear[filter.kind]}
				/>
			))}
		</div>
	)
}

interface TodoFilterChipProps {
	label: string
	onClear: () => void
}

function TodoFilterChip({ label, onClear }: TodoFilterChipProps) {
	return (
		<button
			type="button"
			onClick={onClear}
			aria-label={t('widgets.todos.filter.clearAria', { p0: label })}
			className="inline-flex items-center gap-1 px-2 font-semibold rounded-full cursor-pointer h-5.5 shrink-0 bg-brand-fill text-brand text-2xs transition-ui hover:bg-brand-fill-2 focus-visible:focus-ring"
		>
			{label}
			<Icon name="close" size={12} aria-hidden="true" />
		</button>
	)
}
