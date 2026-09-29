import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { buttonVariants } from '@/components/ui'
import { Icon } from '@/icons'
import { useAuth } from '@/context/auth.context'

interface VipBannerCardProps {
	className?: string
	title?: string
	description?: string
	onClick?: () => void
	isVip?: boolean
}

export function VipBannerCard({
	className = '',
	title,
	description,
	onClick,
	isVip: propIsVip,
}: VipBannerCardProps) {
	const { isVip: authIsVip } = useAuth()
	const isVip = propIsVip ?? authIsVip

	const handleClick = () => {
		if (onClick) {
			onClick()
		} else {
			callEvent('openSettings', 'vip')
		}
	}

	if (isVip) {
		return null
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			className={`w-full flex items-center justify-between text-right p-3.5 sm:p-4 rounded-2xl border border-vip-fill-2 bg-surface-2 hover:bg-surface-2 hover:border-vip transition-ui duration-200 cursor-pointer shadow-sm group ${className}`}
		>
			<div className="flex items-center min-w-0 gap-3">
				<div className="flex items-center justify-center text-vip transition-transform duration-200 w-11 h-11 rounded-2xl shrink-0 group-hover:scale-105">
					<Icon name="diamond" size={20} />
				</div>

				<div className="flex flex-col min-w-0 text-right">
					<div className="flex items-center gap-2">
						<h3 className="text-sm font-black truncate sm:text-base text-fg">
							{title || 'فراتر از یک تب ساده؛ با نسخه پرو'}
						</h3>
					</div>
					<p className="text-2xs text-fg-muted truncate mt-0.5 max-w-xs sm:max-w-md">
						{description ||
							'والپیپرهای ویدیویی، ابعاد و مدل‌های اختصاصی ویجت‌ها و امکانات ویژه گالری'}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-2 mr-2 shrink-0">
				<span
					className={cn(
						buttonVariants({
							size: 'xs',
							variant: 'outline',
							color: 'vip',
							rounded: 'xl',
						}),
						'px-3 py-1.5 font-bold gap-1'
					)}
				>
					<span>ارتقا به پرو</span>
					<Icon name="chevronLeft" size={12} />
				</span>
			</div>
		</button>
	)
}
