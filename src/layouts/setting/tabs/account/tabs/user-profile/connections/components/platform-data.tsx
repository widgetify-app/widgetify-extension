import { FaGithub } from 'react-icons/fa'
import type { Platform } from './platform-config'
import GoogleCalendar from '@/assets/google-calendar.png'

export const PLATFORM_CONFIGS: Omit<Platform, 'connected' | 'isLoading'>[] = [
	{
		id: 'google',
		name: 'گوگل کلندر',
		description: 'اتصال به خدمات گوگل برای دسترسی به تقویم و جلسات گوگل میت',
		bgColor: '',
		isActive: true,
		icon: (
			<img
				src={GoogleCalendar}
				alt="Google Calendar"
				className={`w-8 h-8 rounded-sm`}
			/>
		),
		features: [
			'دسترسی مستقیم به تقویم گوگل',
			'نمایش و یادآوری هوشمند رویدادها و جلسات آینده',
		],
		permissions: ['مشاهده تقویم (سرویس گوگل کلندر)'],
		isOptionalPermissions: true,
	},
	{
		id: 'github',
		name: 'گیت‌هاب',
		description: 'اتصال به گیت‌هاب برای مشاهده مخازن، کامیت‌ها و فعالیت‌های پروژه',
		bgColor: 'bg-gray-800',
		isActive: false,
		icon: <FaGithub size={20} className="text-white" />,
		features: [],
		permissions: [],
	},
]
