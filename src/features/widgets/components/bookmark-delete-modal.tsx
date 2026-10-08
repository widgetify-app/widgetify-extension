import { ConfirmationModal } from '@/components/ui'
import { t } from '@/common/i18n'

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
			title={t('widgets.bookmarkDelete.title')}
			message={t('widgets.bookmarkDelete.message')}
			confirmText={t('widgets.bookmarkDelete.confirm')}
			cancelText={t('widgets.bookmarkDelete.cancel')}
			variant="danger"
		/>
	)
}
