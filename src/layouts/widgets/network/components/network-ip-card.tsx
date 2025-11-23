import Tooltip from '@/components/toolTip'
import { showToast } from '@/common/toast'

interface NetworkIPCardProps {
	ip: string | null
	blurMode: boolean
}

export function NetworkIPCard({ ip, blurMode }: NetworkIPCardProps) {
	function copyToClipboard() {
		if (ip && navigator?.clipboard) {
			navigator.clipboard?.writeText(ip).then(() => {
				showToast('آدرس IP کپی شد!', 'success')
			})
		}
	}
	return (
		<div className="py-2 text-center">
			<div className="mb-1 text-xs text-muted">آدرس IP</div>
			<Tooltip content={ip ? 'کپی به کلیپ بورد' : 'در حال بارگذاری...'}>
				<div
					className={`text-lg font-mono font-bold text-content bg-base-200/50 px-3 py-1.5 rounded-xl backdrop-blur-sm ${blurMode ? 'blur-mode' : 'disabled-blur-mode'} cursor-pointer`}
					onClick={copyToClipboard}
				>
					{ip || 'در حال بارگذاری...'}
				</div>
			</Tooltip>
		</div>
	)
}
