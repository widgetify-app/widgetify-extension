import { useState } from 'react'
import Modal from '@/components/modal'
import { Button } from '@/components/button/button'
import {
	useGetOccupations,
	useGetInterests,
} from '@/services/hooks/profile/getProfileMeta.hook'
import { LuChevronLeft, LuSparkles } from 'react-icons/lu'
import { FaCheck } from 'react-icons/fa'
import { TextInput } from '@/components/text-input'
import { sleep } from '@/common/utils/timeout'

export enum ReferralSource {
	Social = 'social',
	Youtube = 'youtube',
	Friends = 'friends',
	SearchOther = 'search_other',
}

interface WelcomeWizardProps {
	isOpen: boolean
	onClose: () => void
}

const StepWrapper = ({ children }: { children: React.ReactNode }) => {
	return <div className="flex flex-col md:flex-row min-h-125">{children}</div>
}

const StepImage = ({ src, alt }: { src: string; alt: string }) => {
	return (
		<div className="relative flex items-center justify-center w-full p-2 bg-base-200/50 md:w-1/2">
			<img src={src} alt={alt} className="object-cover w-full rounded max-h-124" />
		</div>
	)
}
export const WelcomeWizard = ({ isOpen, onClose }: WelcomeWizardProps) => {
	const [currentStep, setCurrentStep] = useState(1)
	const [fetching, setFetching] = useState(false)
	const [selectedOccupation, setSelectedOccupation] = useState<string | null>(null)
	const [selectedInterests, setSelectedInterests] = useState<string[]>([])
	const [selectedReferralSource, setSelectedReferralSource] =
		useState<ReferralSource | null>(null)
	const [referralCode, setReferralCode] = useState<string>('')
	const totalSteps = 5

	const { data: occupations, isLoading: occupationsLoading } =
		useGetOccupations(fetching)
	const { data: interests, isLoading: interestsLoading } = useGetInterests(fetching)

	const nextStep = () => {
		if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
		else onClose()
	}

	const prevStep = () => {
		if (currentStep > 1) setCurrentStep(currentStep - 1)
	}

	useEffect(() => {
		const load = async () => {
			await sleep(300)
			setFetching(true)
		}
		load()
	}, [])

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<StepWrapper>
						<div className="flex flex-col items-center justify-center w-full p-8 text-center md:w-1/2 md:p-12">
							<div className="mb-10 space-y-4">
								<h2 className="text-2xl font-black text-content">
									خوش اومدی!
								</h2>
								<p className="text-sm font-medium leading-loose opacity-70">
									خیلی خوشحالیم که اینجایی. بیا با هم پروفایلت رو کامل
									کنیم تا تجربه بهتری داشته باشی.
								</p>
							</div>
							<Button
								size="sm"
								onClick={nextStep}
								className="w-full h-12 text-base font-bold text-white shadow-lg rounded-2xl"
								isPrimary
							>
								بزن بریم
							</Button>
						</div>
						<StepImage src="https://picsum.photos/400/601" alt="Welcome" />
					</StepWrapper>
				)

			case 2:
				return (
					<StepWrapper>
						<div className="flex flex-col justify-between w-full p-4 md:w-1/2 md:p-10">
							<div className="w-full">
								<div className="mb-6 text-right">
									<h2 className="mb-2 text-2xl font-black text-content">
										چه کاره‌ای؟
									</h2>
									<p className="text-sm font-medium opacity-60">
										حرفه‌ات رو انتخاب کن
									</p>
								</div>
								<div className="grid w-full grid-cols-2 gap-3 p-2 overflow-y-auto max-h-75 scrollbar-none">
									{occupationsLoading ? (
										<div className="col-span-2 py-10 text-center animate-pulse">
											در حال بارگذاری...
										</div>
									) : (
										occupations?.map((job) => {
											const isSelected =
												selectedOccupation === job.id
											return (
												<button
													key={job.id}
													onClick={() =>
														setSelectedOccupation(job.id)
													}
													className={`relative flex flex-col items-center justify-center p-4 gap-2 border rounded-2xl transition-all duration-300 cursor-pointer ${
														isSelected
															? 'border-primary bg-primary/5 scale-[1.02]'
															: 'border-base-300/30 bg-base-100 hover:border-primary/30'
													}`}
												>
													<LuSparkles
														className={
															isSelected
																? 'text-primary'
																: 'text-base-300'
														}
														size={20}
													/>
													<span
														className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-content/80'}`}
													>
														{job.title}
													</span>
													{isSelected && (
														<FaCheck
															className="absolute top-2 right-2 text-primary"
															size={16}
														/>
													)}
												</button>
											)
										})
									)}
								</div>
							</div>
							<div className="flex gap-3 mt-6">
								<Button
									size="sm"
									onClick={nextStep}
									disabled={!selectedOccupation}
									className="flex-1 h-12 font-bold text-white rounded-2xl"
									isPrimary
								>
									تایید و ادامه
								</Button>
							</div>
						</div>
						<StepImage src="https://picsum.photos/400/601" alt="Welcome" />
					</StepWrapper>
				)

			case 3:
				return (
					<StepWrapper>
						<div className="flex flex-col justify-between w-full p-8 md:w-1/2 md:p-10">
							<div className="w-full">
								<div className="mb-6 text-right">
									<h2 className="mb-2 text-2xl font-black text-content">
										به چی علاقه داری؟
									</h2>
									<p className="text-sm font-medium opacity-60">
										تا ۳ مورد رو می‌تونی انتخاب کنی
									</p>
								</div>
								<div className="flex flex-wrap gap-2 overflow-y-auto max-h-75 scrollbar-none">
									{interestsLoading ? (
										<div className="w-full py-10 text-center animate-pulse">
											در حال بارگذاری...
										</div>
									) : (
										interests?.map((item) => {
											const isSelected = selectedInterests.includes(
												item.id
											)
											return (
												<button
													key={item.id}
													onClick={() => {
														if (isSelected)
															setSelectedInterests(
																selectedInterests.filter(
																	(id) => id !== item.id
																)
															)
														else if (
															selectedInterests.length < 3
														)
															setSelectedInterests([
																...selectedInterests,
																item.id,
															])
													}}
													className={`px-4 py-2 cursor-pointer rounded-full text-xs font-bold transition-all border-2 ${
														isSelected
															? 'bg-primary border-primary text-white'
															: 'bg-base-100 border-base-300/30 text-muted hover:border-primary/30'
													}`}
												>
													{item.title}
												</button>
											)
										})
									)}
								</div>
							</div>
							<div className="flex gap-3 mt-6">
								<Button
									size="sm"
									onClick={nextStep}
									disabled={selectedInterests.length === 0}
									className="flex-1 h-12 font-bold text-white rounded-2xl"
									isPrimary
								>
									ادامه
								</Button>
							</div>
						</div>
						<StepImage src="https://picsum.photos/400/601" alt="Welcome" />
					</StepWrapper>
				)

			case 4:
				return (
					<StepWrapper>
						<div className="flex flex-col items-center justify-center w-full p-8 text-center md:w-1/2 md:p-12">
							<div className="mb-10 space-y-4">
								<h2 className="text-2xl font-black text-content">
									مرحله ۴: از کجا شنیدی؟
								</h2>
								<p className="text-sm font-medium leading-loose opacity-70 text-balance">
									لطفاً بگو از کجا با ویجتیفای آشنا شدی.
								</p>
							</div>

							<div className="w-full max-w-md space-y-4">
								<div className="space-y-2">
									<label className="flex items-center cursor-pointer">
										<input
											type="radio"
											name="referral"
											value={ReferralSource.Social}
											checked={
												selectedReferralSource ===
												ReferralSource.Social
											}
											onChange={(e) =>
												setSelectedReferralSource(
													e.target.value as ReferralSource
												)
											}
											className="radio radio-primary"
										/>
										<span className="mr-2">شبکه‌های اجتماعی</span>
									</label>
									<label className="flex items-center cursor-pointer">
										<input
											type="radio"
											name="referral"
											value={ReferralSource.Youtube}
											checked={
												selectedReferralSource ===
												ReferralSource.Youtube
											}
											onChange={(e) =>
												setSelectedReferralSource(
													e.target.value as ReferralSource
												)
											}
											className="radio radio-primary"
										/>
										<span className="mr-2">یوتیوب</span>
									</label>
									<label className="flex items-center cursor-pointer">
										<input
											type="radio"
											name="referral"
											value={ReferralSource.Friends}
											checked={
												selectedReferralSource ===
												ReferralSource.Friends
											}
											onChange={(e) =>
												setSelectedReferralSource(
													e.target.value as ReferralSource
												)
											}
											className="radio radio-primary"
										/>
										<span className="mr-2">دوستان</span>
									</label>
									<label className="flex items-center cursor-pointer">
										<input
											type="radio"
											name="referral"
											value={ReferralSource.SearchOther}
											checked={
												selectedReferralSource ===
												ReferralSource.SearchOther
											}
											onChange={(e) =>
												setSelectedReferralSource(
													e.target.value as ReferralSource
												)
											}
											className="radio radio-primary"
										/>
										<span className="mr-2">جستجو یا سایر</span>
									</label>
								</div>

								{selectedReferralSource === ReferralSource.Friends && (
									<div className="mt-4">
										<TextInput
											value={referralCode}
											onChange={setReferralCode}
											placeholder="کد دعوت را وارد کنید"
										/>
									</div>
								)}
							</div>

							<Button
								size="sm"
								onClick={nextStep}
								disabled={!selectedReferralSource}
								className="w-full h-12 mt-8 text-base font-bold text-white shadow-lg shadow-primary/30 rounded-2xl"
								isPrimary={true}
							>
								بعدی
							</Button>
						</div>
						<StepImage src="https://picsum.photos/400/601" alt="Welcome" />
					</StepWrapper>
				)

			case 5:
				return (
					<StepWrapper>
						<div className="flex flex-col items-center justify-center w-full p-8 text-center md:w-1/2 md:p-12">
							<div className="mb-10 space-y-4">
								<h2 className="text-2xl font-black text-content">
									همه چیز آماده‌ست! 🚀
								</h2>
								<p className="text-sm font-medium leading-loose opacity-70">
									تنظیمات پروفایلت با موفقیت انجام شد. حالا می‌تونی از
									تمام امکانات استفاده کنی.
								</p>
							</div>
							<Button
								size="sm"
								onClick={onClose}
								className="w-full h-12 text-base font-bold text-white shadow-lg rounded-2xl"
								isPrimary
							>
								شروع استفاده
							</Button>
						</div>
						<StepImage src="https://picsum.photos/400/601" alt="Welcome" />
					</StepWrapper>
				)
		}
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl" direction="rtl" title=" ">
			<div className="relative overflow-hidden rounded bg-base-100">
				{currentStep > 1 && currentStep < totalSteps && (
					<button
						onClick={prevStep}
						className="absolute z-20 p-2 transition-colors rounded-full top-10 right-96 bg-base-200/50 text-content hover:bg-base-300"
					>
						<LuChevronLeft size={20} />
					</button>
				)}
				{renderStepContent()}
			</div>
		</Modal>
	)
}
