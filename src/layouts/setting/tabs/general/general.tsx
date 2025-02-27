import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { StoreKey } from '../../../../common/constant/store.key'
import { getFromStorage, setToStorage } from '../../../../common/storage'
import { CustomCheckbox } from '../../../../components/checkbox'

interface UserProfile {
	name: string
	gender: 'male' | 'female' | 'not_specified'
	analyticsEnabled: boolean
}

export function GeneralSettingTab() {
	const [userProfile, setUserProfile] = useState<UserProfile>({
		name: '',
		gender: 'not_specified',
		analyticsEnabled: false,
	})

	useEffect(() => {
		async function getUserProfile() {
			const profile = await getFromStorage<UserProfile>(StoreKey.UserProfile)
			if (profile) {
				setUserProfile({
					...profile,
				})
			}
		}

		getUserProfile()
	}, [])

	useEffect(() => {
		const profileToSave = {
			...userProfile,
		}
		setToStorage(StoreKey.UserProfile, profileToSave)

		if ('analyticsEnabled' in userProfile) {
			const event = new CustomEvent('analyticsStatusChanged', {
				detail: { enabled: userProfile.analyticsEnabled },
			})
			window.dispatchEvent(event)
		}
	}, [userProfile])

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserProfile({ ...userProfile, name: e.target.value })
	}

	const handleGenderChange = (gender: 'male' | 'female' | 'not_specified') => {
		setUserProfile({ ...userProfile, gender })
	}

	const handleAnalyticsChange = (checked: boolean) => {
		setUserProfile({ ...userProfile, analyticsEnabled: checked })
	}

	return (
		<motion.div
			className="w-full max-w-xl mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<h1 className="mb-6 text-2xl font-semibold text-gray-200 font-[Vazir]">
				تنظیمات عمومی
			</h1>

			{/* User Name Section */}
			<div className="mb-6">
				<h2 className="mb-4 text-xl font-semibold text-gray-200 font-[Vazir]">
					اطلاعات شخصی
				</h2>
				<div className="flex flex-col gap-4">
					<div className="p-4 rounded-xl bg-white/5">
						<label className="block mb-2 font-medium font-[Vazir] text-gray-200">
							نام شما
						</label>
						{/* <input
							type="text"
							value={userProfile.name}
							onChange={handleNameChange}
							className="w-full p-2 bg-white/10 rounded-lg text-gray-200 font-[Vazir] border-none focus:ring-2 focus:ring-blue-500"
							placeholder="نام خود را وارد کنید"
						/> */}
					</div>
				</div>
			</div>

			{/* Gender Selection */}
			<div className="mb-6">
				<div className="p-4 rounded-xl bg-white/5">
					<label className="block mb-2 font-medium font-[Vazir] text-gray-200">
						جنسیت
					</label>
					<div className="flex gap-4" dir="rtl">
						<button
							className={`px-4 py-2 rounded-lg font-[Vazir] ${userProfile.gender === 'male' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300'}`}
							onClick={() => handleGenderChange('male')}
						>
							مرد
						</button>
						<button
							className={`px-4 py-2 rounded-lg font-[Vazir] ${userProfile.gender === 'female' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300'}`}
							onClick={() => handleGenderChange('female')}
						>
							زن
						</button>
						<button
							className={`px-4 py-2 rounded-lg font-[Vazir] ${userProfile.gender === 'not_specified' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300'}`}
							onClick={() => handleGenderChange('not_specified')}
						>
							مشخص نشده
						</button>
					</div>
				</div>
			</div>

			{/* Google Analytics Toggle */}
			<div className="mb-6">
				<h2 className="mb-4 text-xl font-semibold text-gray-200 font-[Vazir]">
					حریم خصوصی
				</h2>
				<div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
					<CustomCheckbox
						checked={userProfile.analyticsEnabled}
						onChange={handleAnalyticsChange}
					/>
					<div
						onClick={() => handleAnalyticsChange(!userProfile.analyticsEnabled)}
						className="cursor-pointer"
					>
						<p className="font-medium font-[Vazir] text-gray-200">گوگل آنالیتیکس</p>
						<p className="text-sm font-[Vazir] text-gray-400">
							با فعال کردن این گزینه، آمار استفاده از برنامه برای بهبود عملکرد جمع‌آوری
							می‌شود. هیچ اطلاعات شخصی ارسال نخواهد شد
						</p>
					</div>
				</div>
			</div>
		</motion.div>
	)
}
