import { useState } from 'react'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/icons'
import { ConfirmationModal } from '@/components/ui'
import Analytics from '@/analytics'
import { NavIconButton } from './nav-icon-button'
import { t } from '@/common/i18n'

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
			<NavIconButton
				icon={blurMode ? 'outlineEye' : 'outlineEyeSlash'}
				label={t('navbar.blur.title')}
				pressed={blurMode}
				onClick={handleBlurModeToggle}
			/>

			<ConfirmationModal
				isOpen={showConfirm}
				onClose={() => setShowConfirm(false)}
				onConfirm={handleConfirm}
				variant="brand"
				title={t('navbar.blur.confirmTitle')}
				icon={<Icon name="userSecret" />}
				message={<div>{t('navbar.blur.confirmBody')}</div>}
				confirmText={t('navbar.blur.confirm')}
				cancelText={t('navbar.blur.cancel')}
			/>
		</>
	)
}
