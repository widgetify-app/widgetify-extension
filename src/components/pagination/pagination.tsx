import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Button } from '@/components/button/button'

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
		<div className={`flex items-center justify-center mt-2 space-x-2 ${className}`}>
			<Button
				onClick={onPrevPage}
				disabled={currentPage === 1 || isLoading}
				size="xs"
				className="btn-soft"
				isPrimary={currentPage !== 1}
			>
				<FiChevronRight
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
				className="btn-soft"
				isPrimary={true}
				size="xs"
			>
				<FiChevronLeft size={18} className="text-primary" />
			</Button>
		</div>
	)
}
