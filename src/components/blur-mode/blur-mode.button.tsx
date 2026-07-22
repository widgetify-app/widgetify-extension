import { useState } from 'react'
import { useGeneralSetting } from '@/context/general-setting.context'
import Tooltip from '../toolTip'
import { Icon } from '@/src/icons'
import { ConfirmationModal } from '../modal/confirmation-modal'
import Analytics from '@/analytics'

export function BlurModeButton() {
	const { blurMode, updateSetting } = useGeneralSetting()
	const [showConfirm, setShowConfirm] = useState(false)

	const applyBlurMode = (value: boolean) => {
		updateSetting('blurMode', value)
	}

	const handleBlurModeToggle = () => {
		if (!blurMode) {
			setShowConfirm(true)
			Analytics.event('blurModeConfirm')
		} else {
			applyBlurMode(false)
		}
	}

	const handleConfirm = () => {
		applyBlurMode(true)
		setShowConfirm(false)
	}

	return (
		<>
			<Tooltip content={blurMode ? 'غیرفعالسازی' : 'فعالسازی حالت مخفی'}>
				<div
					onClick={handleBlurModeToggle}
					className="relative p-2 transition-all cursor-pointer nav-btn text-base-content/40 hover:text-base-content active:scale-90"
				>
					{blurMode ? (
						<Icon name="outlineEye" size={15} />
					) : (
						<Icon name="outlineEyeSlash" size={15} />
					)}
				</div>
			</Tooltip>

			<ConfirmationModal
				isOpen={showConfirm}
				onClose={() => setShowConfirm(false)}
				onConfirm={handleConfirm}
				variant="primary"
				title="حالت مخفی فعال میشه!"
				icon={<Icon name="userSecret" />}
				message={
					<div>
						با فعال کردن «حالت مخفی»، اطلاعات حساس، وظایف و محتوای ویجت‌ها
						به‌صورت خودکار تار میشن تا اگر کسی از کنار صفحه یا پشت سرت نگاه
						کرد، نتونه چیزی بخونه 🔒
					</div>
				}
				confirmText="بریم تو حالت مخفی"
				cancelText="نه فعلا"
			/>
		</>
	)
}
