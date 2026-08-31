import type React from 'react'
import { Icon } from '@/src/icons'

interface GoogleCalendarEmptyProps {
	message?: string
}

export const GoogleCalendarEmpty: React.FC<GoogleCalendarEmptyProps> = ({
	message = 'برای این روز برنامه‌ای نداری',
}) => {
	return (
		<div className="flex flex-col items-center justify-center h-full py-8 text-center select-none opacity-40">
			<Icon name="calendar" size={24} strokeWidth={1.5} className="mb-2" />
			<p className="text-[11px] font-medium text-content">{message}</p>
		</div>
	)
}
