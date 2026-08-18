import { twMerge } from 'tailwind-merge'
import { Icon } from '@/src/icons'
import { Button } from '../button/button'

export interface PaginationProps {
	currentPage: number
	totalPages: number
	onNextPage: () => void
	onPrevPage: () => void
	isLoading?: boolean
	className?: string
}

export function Pagination({
	currentPage,
	totalPages,
	onNextPage,
	onPrevPage,
	isLoading = false,
	className = '',
}: PaginationProps) {
	if (totalPages <= 1) {
		return null
	}

	return (
		<div
			className={twMerge(
				'flex items-center justify-center mt-2 space-x-2',
				className
			)}
		>
			<Button
				onClick={onPrevPage}
				disabled={currentPage === 1 || isLoading}
				size="xs"
				className="btn-soft rounded-2xl"
				isPrimary={currentPage !== 1}
			>
				<Icon
					name="chevronRight"
					size={18}
					className={`${currentPage === 1 ? 'text-muted' : 'text-primary'}`}
				/>
			</Button>

			<span className="mx-2 text-sm text-muted">
				صفحه {currentPage} از {totalPages}
			</span>

			<Button
				onClick={onNextPage}
				disabled={currentPage === totalPages || isLoading}
				className="btn-soft rounded-2xl"
				isPrimary={true}
				size="xs"
			>
				<Icon name="chevronLeft" size={18} className="text-primary" />
			</Button>
		</div>
	)
}
