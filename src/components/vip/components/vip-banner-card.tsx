import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/ui'
import { Icon } from '@/src/icons'

interface VipBannerCardProps {
	className?: string
	title?: string
	description?: string
	onClick?: () => void
}

export function VipBannerCard({
	className = '',
	title = 'پرو شو و پرواز کن',
	description = 'دسترسی نامحدود به ویجت‌ها، چیدمان‌های اختصاصی، همگام‌سازی ابری و امکانات پریمیوم',
	onClick,
}: VipBannerCardProps) {
	const handleClick = () => {
		if (onClick) {
			onClick()
		} else {
			callEvent('openSettings', 'vip')
		}
	}

	return (
		<div
			onClick={handleClick}
			className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-indigo-500/30 bg-base-200/70 hover:bg-base-200 hover:border-indigo-500/50 transition-all duration-200 cursor-pointer shadow-xs group ${className}`}
		>
			<div className="flex items-center gap-3 min-w-0">
				<div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 shrink-0 transition-transform duration-200 group-hover:scale-105">
					<Icon name="crown" size={22} />
				</div>

				<div className="flex flex-col text-right min-w-0">
					<div className="flex items-center gap-2">
						<h3 className="text-sm sm:text-base font-black text-content truncate">
							{title}
						</h3>
						<span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
							پرو
						</span>
					</div>
					<p className="text-[11px] text-muted truncate mt-0.5 max-w-xs sm:max-w-md">
						{description}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-2 shrink-0 mr-2">
				<Button
					size="xs"
					variant="primary"
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
