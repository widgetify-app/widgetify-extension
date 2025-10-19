import { FaGithub, FaGoogle } from 'react-icons/fa'
import type { Platform } from './platform-config'

export const PLATFORM_CONFIGS: Omit<Platform, 'connected' | 'isLoading'>[] = [
	{
		id: 'google',
		name: 'گوگل',
		description: 'اتصال به خدمات گوگل برای دسترسی به تقویم و جلسات گوگل میت',
		bgColor: 'bg-red-500',
		isActive: true,
		icon: <FaGoogle size={20} className="text-white" />,
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
