import toast from 'react-hot-toast'

interface NetworkIPCardProps {
	ip: string | null
	blurMode: boolean
}

export function NetworkIPCard({ ip, blurMode }: NetworkIPCardProps) {
	function copyToClipboard() {
		if (ip) {
			navigator.clipboard.writeText(ip)
			toast.success('آدرس IP کپی شد', {
				position: 'bottom-center',
			})
		}
	}
	return (
		<div className="py-2 text-center">
			<div className="mb-1 text-xs text-muted">آدرس IP</div>
			<div
				className={`text-lg font-mono font-bold text-content bg-base-200/50 px-3 py-1.5 rounded-xl backdrop-blur-sm ${blurMode ? 'blur-mode' : 'disabled-blur-mode'} cursor-pointer`}
				onClick={copyToClipboard}
			>
				{ip || 'در حال بارگذاری...'}
			</div>
		</div>
	)
}
