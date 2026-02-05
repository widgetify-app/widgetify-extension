import { useGeneralSetting } from '@/context/general-setting.context'
import Tooltip from '../toolTip'
import { Button } from '../button/button'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export function BlurModeButton() {
	const { blurMode, updateSetting } = useGeneralSetting()

	const handleBlurModeToggle = () => {
		const newBlurMode = !blurMode
		updateSetting('blurMode', newBlurMode)
	}

	return (
		<Tooltip content={blurMode ? 'نمایش' : 'حالت مخفی'}>
			<Button
				size="sm"
				onClick={handleBlurModeToggle}
				className={`px-2 py-0! border rounded-xl text-base-content/40 shrink-0 active:scale-95 h-7!`}
			>
				{blurMode ? <FaEye /> : <FaEyeSlash />}
			</Button>
		</Tooltip>
	)
}
