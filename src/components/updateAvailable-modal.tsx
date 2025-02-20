import { FaExclamation } from 'react-icons/fa6'
import Modal from './modal'

interface UpdateAvailableModalProps {
	show: boolean
	onClose: () => void
	onInstall: () => void
}

export function UpdateAvailableModal({
	show,
	onClose,
	onInstall,
}: UpdateAvailableModalProps) {
	return (
		<Modal isOpen={show} onClose={onClose} size="sm">
			<div className="flex flex-col items-center justify-center space-y-4" dir="rtl">
				<p className="text-gray-700 dark:text-gray-300">
					<FaExclamation className="inline-block w-6 h-6 text-red-500" />
					نسخه جدیدی از برنامه موجود است. آیا می‌خواهید بروزرسانی کنید؟
				</p>
				<div className="flex space-x-4">
					<button
						onClick={onInstall}
						className="w-32 px-4 py-2 font-semibold text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
					>
						بروزرسانی
					</button>
					<button
						onClick={onClose}
						className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded cursor-pointer hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
					>
						بستن
					</button>
				</div>
			</div>
		</Modal>
	)
}
