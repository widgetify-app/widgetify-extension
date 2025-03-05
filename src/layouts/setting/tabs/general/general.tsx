import { motion } from 'motion/react'
import CustomCheckbox from '../../../../components/checkbox'
import { SectionPanel } from '../../../../components/section-panel'
import {
	type FontFamily,
	useGeneralSetting,
} from '../../../../context/general-setting.context'

export function GeneralSettingTab() {
	const {
		analyticsEnabled,
		setAnalyticsEnabled,
		enablePets,
		setEnablePets,
		petName,
		setPetName,
		contentAlignment,
		setContentAlignment,
		fontFamily,
		setFontFamily,
	} = useGeneralSetting()

	const availableFonts: { value: FontFamily; label: string; sampleText: string }[] = [
		{
			value: 'Vazir',
			label: 'وزیر',
			sampleText: 'نمونه متن با فونت وزیر',
		},
		{
			value: 'digiHamishe',
			label: 'دیجی همیشه',
			sampleText: 'نمونه متن با فونت دیجی همیشه',
		},
		{
			value: 'digiLalezarPlus',
			label: 'دیجی لاله‌زار پلاس',
			sampleText: 'بهار زندگی',
		},
	]

	return (
		<motion.div
			className="w-full max-w-xl mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			{/* Google Analytics Toggle */}
			<div className="space-y-6">
				<SectionPanel title="حریم خصوصی" delay={0.1}>
					<div className="flex items-start gap-3">
						<CustomCheckbox
							checked={analyticsEnabled}
							onChange={() => setAnalyticsEnabled(!analyticsEnabled)}
						/>
						<div
							onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
							className="cursor-pointer"
						>
							<p className="font-medium text-gray-200">گوگل آنالیتیکس</p>
							<p className="text-sm font-light text-gray-400">
								با فعال کردن این گزینه، آمار استفاده از برنامه برای بهبود عملکرد جمع‌آوری
								می‌شود. هیچ اطلاعات شخصی ارسال نخواهد شد
							</p>
						</div>
					</div>
				</SectionPanel>

				{/* Font Selection */}
				<SectionPanel title="فونت برنامه" delay={0.15}>
					<div className="space-y-3">
						<p className="text-sm text-gray-400">
							فونت مورد نظر خود را برای نمایش در تمامی بخش‌های برنامه انتخاب کنید:
						</p>
						<div className="flex flex-wrap gap-2">
							{availableFonts.map((font) => (
								<button
									key={font.value}
									onClick={() => setFontFamily(font.value)}
									className={`flex flex-col items-center w-auto p-3 transition border rounded-lg ${
										fontFamily === font.value
											? 'border-blue-500 bg-blue-500/10'
											: 'border-gray-700 bg-white/5 hover:bg-white/10'
									}`}
									style={{ fontFamily: font.value }}
								>
									<div className="flex items-center justify-center mb-2">
										<div
											className={`w-4 h-4 rounded-full border ${
												fontFamily === font.value
													? 'border-blue-500 bg-blue-500'
													: 'border-gray-600'
											}`}
										>
											{fontFamily === font.value && (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="w-full h-full p-0.5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={3}
														d="M5 13l4 4L19 7"
													/>
												</svg>
											)}
										</div>
										<span className="mr-1.5 text-sm font-medium text-gray-300">
											{font.label}
										</span>
									</div>
									<p
										className="text-sm text-gray-400 max-w-[120px] text-center"
										style={{ fontFamily: font.value }}
									>
										{font.sampleText}
									</p>
								</button>
							))}
						</div>
					</div>
				</SectionPanel>

				{/* Pets Toggle */}
				<SectionPanel title="قابلیت‌های ظاهری" delay={0.2}>
					<div className="flex flex-col gap-4">
						<div className="flex items-start gap-3">
							<CustomCheckbox
								checked={enablePets}
								onChange={() => setEnablePets(!enablePets)}
							/>
							<div onClick={() => setEnablePets(!enablePets)} className="cursor-pointer">
								<p className="font-medium text-gray-200">نمایش حیوان خانگی</p>
								<p className="text-sm font-light text-gray-400">
									نمایش حیوان خانگی تعاملی روی صفحه اصلی
								</p>
							</div>
						</div>

						{enablePets && (
							<div className="p-4 mt-4 border rounded-lg bg-white/5 border-white/10">
								<p className="mb-3 font-medium text-gray-200">نام حیوان خانگی</p>
								<input
									type="text"
									value={petName}
									onChange={(e) => setPetName(e.target.value)}
									placeholder="آکیتا"
									className="w-full px-4 py-2 text-gray-200 border rounded-lg bg-white/10 border-white/20 focus:outline-none focus:border-blue-500"
								/>
								<p className="mt-2 text-xs text-gray-400">
									در صورت خالی بودن، نام پیش‌فرض "آکیتا" استفاده می‌شود.
								</p>
							</div>
						)}
					</div>
				</SectionPanel>

				{/* Content Alignment Options */}
				<SectionPanel title="تنظیمات چیدمان" delay={0.3}>
					<div>
						<p className="mb-3 font-medium text-gray-200">موقعیت عمودی محتوا</p>
						<div className="flex gap-3">
							<button
								onClick={() => setContentAlignment('center')}
								className={`flex-1 p-3 rounded-lg transition border cursor-pointer ${
									contentAlignment === 'center'
										? 'border-blue-500 bg-blue-500/10'
										: 'border-gray-700 bg-white/5 hover:bg-white/10'
								}`}
							>
								<div className="flex flex-col items-center">
									<div className="flex items-center justify-center w-full h-10 mb-2 border border-gray-600 border-dashed rounded">
										<div className="w-2/3 h-2 rounded bg-gray-500/40" />
									</div>
									<span className="text-sm font-medium text-gray-300">وسط</span>
								</div>
							</button>
							<button
								onClick={() => setContentAlignment('top')}
								className={`flex-1 p-3 rounded-lg transition border cursor-pointer ${
									contentAlignment === 'top'
										? 'border-blue-500 bg-blue-500/10'
										: 'border-gray-700 bg-white/5 hover:bg-white/10'
								}`}
							>
								<div className="flex flex-col items-center">
									<div className="flex items-start justify-center w-full h-10 pt-1 mb-2 border border-gray-600 border-dashed rounded">
										<div className="w-2/3 h-2 rounded bg-gray-500/40" />
									</div>
									<span className="text-sm font-medium text-gray-300">بالا</span>
								</div>
							</button>
						</div>
					</div>
				</SectionPanel>
			</div>
		</motion.div>
	)
}
