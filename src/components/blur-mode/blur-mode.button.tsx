import { useGeneralSetting } from '@/context/general-setting.context'
import Tooltip from '../toolTip'
import { Icon } from '@/src/icons'

export function BlurModeButton() {
	const { blurMode, updateSetting } = useGeneralSetting()

	const handleBlurModeToggle = () => {
		const newBlurMode = !blurMode
		updateSetting('blurMode', newBlurMode)
	}

	return (
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
	)
}
