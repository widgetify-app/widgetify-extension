import type React from 'react'
import type { ReactNode } from 'react'
import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/ui'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'
import { WidgetHeader } from '@/features/widgets/components/widget-header'
import { WidgetMenuButton } from '@/features/widgets/components/widget-menu-button'
import { Icon } from '@/icons'
import type { WidgetSize } from '../../utils/layout-engine/types'

interface GoogleCalendarAuthProps {
	isAuthenticated: boolean
	size?: WidgetSize
	tabs?: ReactNode
}

export const GoogleCalendarAuth: React.FC<GoogleCalendarAuthProps> = ({
	isAuthenticated,
	size = { w: 2, h: 3 },
	tabs,
}) => {
	const handleAction = () => {
		if (isAuthenticated) {
			callEvent('openSettings', 'platforms')
		} else {
			callEvent('openProfile')
		}
	}

	if (size.h === 1) {
		return (
			<>
				<div className="flex items-center h-full gap-3">
					<span className="grid size-10 rounded-xl place-items-center shrink-0 bg-fill text-fg-muted">
						<Icon name="googleG" size={16} aria-hidden="true" />
					</span>
					{size.w > 1 && (
						<span className="flex flex-col flex-1 min-w-0 leading-control">
							<span className="text-xs font-bold truncate text-fg-strong">
								تقویم گوگل
							</span>
							<span className="truncate text-3xs text-fg-faint">
								{isAuthenticated ? 'هنوز وصل نشده' : 'اول وارد حسابت شو'}
							</span>
						</span>
					)}
					<Button
						size="xs"
						color="brand"
						rounded="lg"
						className="ms-auto"
						onClick={handleAction}
					>
						{isAuthenticated ? 'اتصال' : 'ورود'}
					</Button>
				</div>
				<WidgetMenuButton placement="floating" />
			</>
		)
	}

	return (
		<>
			<WidgetHeader title={tabs ?? 'تقویم گوگل'} />
			<WidgetEmpty
				art="googleG"
				title={isAuthenticated ? 'هنوز وصل نشده' : 'وارد حسابت نشدی'}
				description={
					isAuthenticated
						? 'تقویم گوگلت رو وصل کن تا جلسه‌ها و برنامه‌های امروزت همین‌جا باشن'
						: 'برای دیدن برنامه‌هات اول وارد حسابت شو'
				}
				action={{
					label: isAuthenticated ? 'اتصال تقویم گوگل' : 'ورود به حساب',
					onClick: handleAction,
				}}
			/>
		</>
	)
}
