import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/ui'
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
		<div
			onClick={handleClick}
			className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-vip-muted bg-content-strong hover:bg-content hover:border-vip-strong transition-all duration-200 cursor-pointer shadow-xs group ${className}`}
		>
			<div className="flex items-center min-w-0 gap-3">
				<div className="flex items-center justify-center text-vip transition-transform duration-200 w-11 h-11 rounded-2xl shrink-0 group-hover:scale-105">
					<Icon name="diamond" size={22} />
				</div>

				<div className="flex flex-col min-w-0 text-right">
					<div className="flex items-center gap-2">
						<h3 className="text-sm font-black truncate sm:text-base text-content">
							{title || 'فراتر از یک تب ساده؛ با نسخه پرو'}
						</h3>
					</div>
					<p className="text-[11px] text-muted truncate mt-0.5 max-w-xs sm:max-w-md">
						{description ||
							'والپیپرهای ویدیویی، ابعاد و مدل‌های اختصاصی ویجت‌ها و امکانات ویژه گالری'}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-2 mr-2 shrink-0">
				<Button
					size="xs"
					variant="outline"
					color="vip"
					rounded="xl"
					className="px-3 py-1.5 font-bold gap-1"
					onClick={(e) => {
						e.stopPropagation()
						handleClick()
					}}
				>
					<span>ارتقا به پرو</span>
					<Icon name="chevronLeft" size={12} />
				</Button>
			</div>
		</div>
	)
}
