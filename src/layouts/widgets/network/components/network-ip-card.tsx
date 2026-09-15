import { cn } from '@/common/utils/cn'
import { Tooltip } from '@/components/ui'
import { copyIpToClipboard } from '../utils/copy-ip'

interface NetworkIPCardProps {
	ip: string | null
	blurMode: boolean
}

export function NetworkIPCard({ ip, blurMode }: NetworkIPCardProps) {
	return (
		<div className="py-2 text-center">
			<div className="mb-1 text-xs text-muted">آدرس IP</div>
			<Tooltip content={ip ? 'کپی به کلیپ بورد' : 'آدرس IP در دسترس نیست'}>
				<button
					type="button"
					disabled={!ip}
					aria-label={ip ? `کپی آدرس ${ip}` : 'آدرس IP در دسترس نیست'}
					onClick={() => copyIpToClipboard(ip)}
					className={cn(
						'text-lg font-bold text-content bg-base-content/5 px-3 py-1.5 rounded-xl',
						'transition-ui focus-visible:focus-ring',
						ip
							? 'cursor-pointer hover:bg-base-content/10'
							: 'cursor-default opacity-70',
						blurMode ? 'blur-mode' : 'disabled-blur-mode'
					)}
					dir="ltr"
				>
					{ip || '—'}
				</button>
			</Tooltip>
		</div>
	)
}
