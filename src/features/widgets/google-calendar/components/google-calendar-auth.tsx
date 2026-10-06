import type React from 'react'
import type { ReactNode } from 'react'
import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/ui'
import { WidgetCompactEmpty } from '@/features/widgets/components/widget-compact-empty'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'
import {
	WidgetCenteredHeader,
	WidgetHeader,
} from '@/features/widgets/components/widget-header'
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

	const status = isAuthenticated ? 'هنوز وصل نشده' : 'وارد حسابت نشدی'
	const actionLabel = isAuthenticated ? 'اتصال' : 'ورود'

	if (size.h === 1 && size.w === 1) {
		return (
			<>
				<WidgetCenteredHeader title="تقویم گوگل" />
				<div className="flex flex-col items-center justify-center flex-1 min-h-0 gap-1.5 text-center">
					<span className="text-2xs text-fg-muted">{status}</span>
					<Button size="xs" color="brand" rounded="lg" onClick={handleAction}>
						{actionLabel}
					</Button>
				</div>
			</>
		)
	}

	if (size.h === 1) {
		return (
			<>
				<WidgetHeader title="تقویم گوگل" />
				<div className="flex-1 min-h-0">
					<WidgetCompactEmpty
						icon="googleG"
						title={status}
						description={
							isAuthenticated
								? 'تقویم گوگلت رو وصل کن'
								: 'اول وارد حسابت شو'
						}
						action={{ label: actionLabel, onClick: handleAction }}
					/>
				</div>
			</>
		)
	}

	return (
		<>
			<WidgetHeader title={tabs ?? 'تقویم گوگل'} />
			<WidgetEmpty
				art="googleG"
				title={status}
				description={
					isAuthenticated
						? 'تقویم گوگلت رو وصل کن تا جلسه‌ها و برنامه‌های امروزت همین‌جا باشن'
						: 'برای دیدن برنامه‌هات اول وارد حسابت شو'
				}
				action={{
					label: isAuthenticated ? 'اتصال تقویم گوگل' : 'ورود',
					onClick: handleAction,
				}}
			/>
		</>
	)
}
