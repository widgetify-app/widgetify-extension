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
			message="همه‌ی بوکمارک‌های داخلش هم حذف می‌شن. ویجت بوکمارک حذف بشه؟"
			confirmText="حذف ویجت"
			cancelText="نه"
			variant="danger"
		/>
	)
}
