import { useGeneralSetting } from '@/context/general-setting.context'
import Tooltip from '../toolTip'
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2'

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
				className="relative p-2 transition-all cursor-pointer nav-btn text-white/40 hover:text-white active:scale-90"
			>
				{blurMode ? <HiOutlineEye size={15} /> : <HiOutlineEyeSlash size={15} />}
			</div>
		</Tooltip>
	)
}
