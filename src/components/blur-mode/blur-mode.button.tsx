import { useGeneralSetting } from '@/context/general-setting.context'
import Tooltip from '../toolTip'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export function BlurModeButton() {
	const { blurMode, updateSetting } = useGeneralSetting()

	const handleBlurModeToggle = () => {
		const newBlurMode = !blurMode
		updateSetting('blurMode', newBlurMode)
	}

	return (
		<Tooltip content={blurMode ? 'فعالسازی حالت مخفی' : 'غیرفعالسازی'}>
			<div
				onClick={handleBlurModeToggle}
				className="relative p-2 transition-all cursor-pointer nav-btn text-white/40 hover:text-white active:scale-90"
			>
				{blurMode ? <FaEye size={15} /> : <FaEyeSlash size={15} />}
			</div>
		</Tooltip>
	)
}
