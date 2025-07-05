import { Button } from '@/components/button/button'
import { useState } from 'react'
import { VscChevronDown, VscFilter, VscSortPrecedence } from 'react-icons/vsc'

export type SortOption = 'source' | 'title' | 'random'
export type FilterBySource = string | 'all'

export interface FilterSortState {
	sortBy: SortOption
	filterBySource: FilterBySource
}

interface NewsFilterSortProps {
	availableSources: string[]
	currentState: FilterSortState
	onStateChange: (newState: FilterSortState) => void
}

export const NewsFilterSort = ({
	availableSources,
	currentState,
	onStateChange,
}: NewsFilterSortProps) => {
	const [showFilters, setShowFilters] = useState(false)

	const sortOptions = [
		{ value: 'random' as SortOption, label: 'تصادفی' },
		{ value: 'source' as SortOption, label: 'منبع' },
		{ value: 'title' as SortOption, label: 'عنوان' },
	]

	const handleSortChange = (sortBy: SortOption) => {
		onStateChange({ ...currentState, sortBy })
	}

	const handleSourceFilter = (source: FilterBySource) => {
		onStateChange({ ...currentState, filterBySource: source })
	}

	return (
		<div className="mb-1 space-y-1">
			<div className="flex items-center justify-end gap-2">
				<Button
					size="xs"
					onClick={() => setShowFilters(!showFilters)}
					isPrimary={showFilters}
					className='rounded-xl text-content bg-content border-base-300/40 shadow-none'
				>
					<VscFilter size={12} />
					<VscChevronDown
						size={12}
						className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
					/>
				</Button>
			</div>
			{showFilters && (
				<div className="p-3 space-y-3 transition-all duration-200 border border-base-300/50 rounded-xl bg-base-200/80">
					<div>
						<label className="block mb-2 text-xs font-medium text-base-content">
							<VscSortPrecedence className="inline w-3 h-3 ml-1" />
							مرتب‌سازی بر اساس:
						</label>
						<div className="grid grid-cols-2 gap-2">
							{sortOptions.map((option) => (
								<Button
									key={option.value}
									onClick={() => handleSortChange(option.value)}
									size="xs"
									isPrimary={currentState.sortBy === option.value}
									className={`shadow-none rounded-xl ${currentState.sortBy === option.value ? "bg-primary text-white border-primary" : "bg-base-300 border-base-300 text-muted"}`}
								>
									{option.label}
								</Button>
							))}
						</div>
					</div>
					{availableSources.length > 0 && (
						<div>
							<label className="block mb-2 text-xs font-medium text-base-content">
								<VscFilter className="inline w-3 h-3 ml-1" />
								فیلتر بر اساس منبع:
							</label>
							<div className="flex flex-wrap gap-1">
								<button
									onClick={() => handleSourceFilter('all')}
									className={`px-2 py-1 text-xs rounded-md transition-colors cursor-pointer ${
										currentState.filterBySource === 'all'
											? 'bg-primary text-white/80'
											: 'bg-content border border-content text-base-content hover:!bg-base-300'
									}`}
								>
									همه
								</button>
								{availableSources.map((source) => (
									<button
										key={source}
										onClick={() => handleSourceFilter(source)}
										className={`px-2 py-1 text-xs rounded-md transition-colors cursor-pointer ${
											currentState.filterBySource === source
												? 'bg-primary text-white/80'
												: 'bg-content border border-content text-base-content hover:!bg-base-300'
										}`}
									>
										{source}
									</button>
								))}
							</div>
						</div>
					)}
					{currentState.filterBySource !== 'all' && (
						<div className="pt-2 border-t border-base-300">
							<Button
								size="xs"
								onClick={() =>
									onStateChange({
										...currentState,
										filterBySource: 'all',
									})
								}
								className="px-2 py-1 text-xs underline btn-ghost text-error hover:text-error/80"
							>
								پاک کردن فیلترها
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
