import type React from 'react'
import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/ui'
import { Icon } from '@/icons'
import type { WidgetSize } from '../../layout-engine/types'

interface GoogleCalendarAuthProps {
	isAuthenticated: boolean
	size?: WidgetSize
}

export const GoogleCalendarAuth: React.FC<GoogleCalendarAuthProps> = ({
	isAuthenticated,
	size = { w: 2, h: 3 },
}) => {
	const handleAction = () => {
		if (isAuthenticated) {
			callEvent('openSettings', 'platforms')
		} else {
			callEvent('openProfile')
		}
	}

	const buttonText = isAuthenticated ? 'اتصال به تقویم' : 'ورود به حساب'

	if (size.w === 1 && size.h === 1) {
		return (
			<button
				type="button"
				onClick={handleAction}
				aria-label={`تقویم گوگل، ${buttonText}`}
				className="flex flex-col items-center justify-between w-full h-full p-[8.3cqh] text-center cursor-pointer select-none group focus-visible:focus-ring"
			>
				<span className="flex items-center justify-center w-[29.2cqh] h-[29.2cqh] rounded-xl bg-brand-subtle text-primary group-hover:scale-105 transition-transform">
					<Icon name="googleCalendar" size={16} aria-hidden="true" />
				</span>

				<span className="flex flex-col items-center gap-0.5">
					<span className="text-[10.4cqh] font-bold text-content leading-none">
						تقویم گوگل
					</span>
					<span className="text-[8.3cqh] text-muted leading-tight">
						{isAuthenticated ? 'نیاز به اتصال' : 'ورود به حساب'}
					</span>
				</span>

				<span className="w-full py-[4.2cqh] rounded-lg bg-primary text-primary-content text-[9.4cqh] font-bold transition-ui group-hover:brightness-110 group-active:scale-95 shrink-0">
					{isAuthenticated ? 'اتصال' : 'ورود'}
				</span>
			</button>
		)
	}

	if (size.w === 2 && size.h === 1) {
		return (
			<div className="flex items-center justify-between w-full h-full gap-2 p-3 select-none">
				<div className="flex items-center gap-2.5 min-w-0">
					<span className="flex items-center justify-center w-9 h-9 rounded-2xl bg-brand-subtle text-primary shrink-0">
						<Icon name="googleCalendar" size={18} aria-hidden="true" />
					</span>
					<div className="flex flex-col min-w-0">
						<span className="text-xs font-bold leading-tight text-content">
							تقویم گوگل
						</span>
						<span className="text-[10px] text-muted truncate mt-0.5">
							{isAuthenticated
								? 'برای مشاهده برنامه‌ها، تقویم رو متصل کن'
								: 'برای مشاهده رویدادها، اول وارد حسابت شو'}
						</span>
					</div>
				</div>

				<Button
					size="sm"
					className="text-[10px] font-bold rounded-xl px-3 py-1 shrink-0"
					onClick={handleAction}
				>
					{isAuthenticated ? 'اتصال تقویم' : 'ورود'}
				</Button>
			</div>
		)
	}

	return (
		<div className="flex flex-col items-center justify-center h-full p-4 text-center select-none">
			<span className="flex items-center justify-center w-12 h-12 mb-3 rounded-2xl bg-brand-subtle text-primary">
				<Icon name="googleCalendar" size={26} aria-hidden="true" />
			</span>
			<p className="mb-1 text-xs font-bold text-content">تقویم گوگل</p>
			<p className="text-[11px] text-muted leading-relaxed max-w-50 mb-4">
				{isAuthenticated
					? 'برای مشاهده جلسات و برنامه‌هات، تقویم گوگل رو متصل کن'
					: 'برای دسترسی به تقویم گوگل، اول وارد حسابت شو'}
			</p>
			<Button
				size="sm"
				className="text-xs rounded-xl px-4 py-1.5"
				onClick={handleAction}
			>
				{buttonText}
			</Button>
		</div>
	)
}
