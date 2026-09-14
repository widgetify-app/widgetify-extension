import { ConfirmationModal } from '@/components/ui'

interface BookmarkDeleteModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
}

export function BookmarkDeleteModal({
	isOpen,
	onClose,
	onConfirm,
}: BookmarkDeleteModalProps) {
	return (
		<ConfirmationModal
			isOpen={isOpen}
			onClose={onClose}
			onConfirm={onConfirm}
			title="حذف ویجت بوکمارک"
			message="با حذف این ویجت، تمام بوکمارک‌های داخل آن نیز حذف خواهند شد. آیا از حذف ویجت بوکمارک اطمینان دارید؟"
			confirmText="حذف ویجت"
			cancelText="انصراف"
			variant="danger"
		/>
	)
}
