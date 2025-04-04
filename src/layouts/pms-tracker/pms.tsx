import { getFromStorage, setToStorage } from '@/common/storage'
import { useTheme } from '@/context/theme.context'
import { useEffect, useState } from 'react'
import { AddSymptom } from './components/add-symptom'
import { CycleSettingsModal } from './components/cycle-settings-modal'
import { SymptomList } from './components/symptom-list'
import type { PMSCycleData } from './types'
import {
	daysUntilNextPeriod,
	formatDate,
	getSeverityColor,
	getSeverityLabel,
} from './utils'

export const PMSTrackerLayout = () => {
	const { themeUtils } = useTheme()
	const [cycleData, setCycleData] = useState<PMSCycleData>({
		currentDay: 0,
		totalDays: 28,
		startDate: '',
		nextPeriodDate: '',
		symptoms: [],
		lastUpdated: new Date().toISOString(),
	})
	const [isLoading, setIsLoading] = useState(true)
	const [isAddingSymptom, setIsAddingSymptom] = useState(false)
	const [isEditingCycle, setIsEditingCycle] = useState(false)
	const [cycleDaysInput, setCycleDaysInput] = useState('28')

	// Translated symptoms for Persian users
	const commonSymptoms = [
		'نوسانات خلق و خو',
		'گرفتگی و درد',
		'نفخ شکم',
		'خستگی',
		'سردرد',
		'هوس غذایی',
	]

	const addSymptom = (symptom: {
		name: string
		severity: 'mild' | 'moderate' | 'severe'
	}) => {
		const updatedData = {
			...cycleData,
			symptoms: [
				...cycleData.symptoms,
				{
					id: Date.now().toString(),
					name: symptom.name,
					severity: symptom.severity,
					date: new Date().toISOString(),
				},
			],
			lastUpdated: new Date().toISOString(),
		}

		setCycleData(updatedData)
		setToStorage('pmsTrackerData', updatedData)
		setIsAddingSymptom(false)
	}

	const removeSymptom = (id: string) => {
		const updatedData = {
			...cycleData,
			symptoms: cycleData.symptoms.filter((s) => s.id !== id),
			lastUpdated: new Date().toISOString(),
		}

		setCycleData(updatedData)
		setToStorage('pmsTrackerData', updatedData)
	}

	const updateCycleSettings = () => {
		const totalDays = Number.parseInt(cycleDaysInput, 10) || 28

		// Reset cycle with new settings
		const today = new Date()
		const nextPeriod = new Date(today)
		nextPeriod.setDate(today.getDate() + totalDays)

		const updatedData = {
			...cycleData,
			currentDay: 1,
			totalDays,
			startDate: today.toISOString(),
			nextPeriodDate: nextPeriod.toISOString(),
			lastUpdated: today.toISOString(),
		}

		setCycleData(updatedData)
		setToStorage('pmsTrackerData', updatedData)
		setIsEditingCycle(false)
	}

	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true)
			try {
				const storedData = await getFromStorage('pmsTrackerData')
				if (storedData) {
					setCycleData(storedData)
					setCycleDaysInput(storedData.totalDays.toString())
				} else {
					// Initialize with default data if nothing exists
					const today = new Date()
					const nextPeriod = new Date(today)
					nextPeriod.setDate(today.getDate() + 28)

					const defaultData = {
						currentDay: 1,
						totalDays: 28,
						startDate: today.toISOString(),
						nextPeriodDate: nextPeriod.toISOString(),
						symptoms: [],
						lastUpdated: today.toISOString(),
					}

					setCycleData(defaultData)
					setToStorage('pmsTrackerData', defaultData)
				}
			} catch (error) {
				console.error('Failed to load PMS data', error)
			} finally {
				setIsLoading(false)
			}
		}

		loadData()
	}, [])

	return (
		<div className="relative">
			<div
				className={`flex h-80 flex-col gap-1 px-2 py-2 ${themeUtils.getCardBackground()} rounded-2xl`}
				style={{
					scrollbarWidth: 'none',
				}}
			>
				<div
					className={`top-0 z-20 flex items-center justify-between w-full pb-2 mb-2 border-b ${themeUtils.getBorderColor()}`}
				>
					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5 text-pink-500"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
							</svg>
							<p className="text-lg font-bold">ردیاب سندرم پیش از قاعدگی</p>
						</div>
						<div className="flex items-center mt-1 text-xs opacity-70">
							<span>
								روز چرخه: {cycleData.currentDay}/{cycleData.totalDays}
							</span>
							<span className="mx-2">•</span>
							<span>
								{daysUntilNextPeriod(cycleData.nextPeriodDate)} روز تا دوره بعدی
							</span>
							<button
								className="mr-2 transition-colors hover:text-pink-500"
								onClick={() => setIsEditingCycle(true)}
								title="تنظیمات چرخه"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3.5 w-3.5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>

				{isLoading ? (
					<div className="flex flex-col items-center justify-center h-full p-4">
						<div className="w-6 h-6 border-2 border-t-2 border-pink-500 rounded-full animate-spin border-t-transparent"></div>
						<p className="mt-2 text-sm opacity-70">در حال بارگذاری اطلاعات...</p>
					</div>
				) : (
					<div className="flex flex-col h-full pb-12 overflow-y-auto">
						<button
							className="flex items-center justify-center gap-1 p-2 mb-3 transition-colors border border-gray-300 border-dashed rounded-lg dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500"
							onClick={() => setIsAddingSymptom(true)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-4 h-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="text-sm">افزودن علامت</span>
						</button>

						<SymptomList
							symptoms={cycleData.symptoms}
							onRemove={removeSymptom}
							formatDate={formatDate}
							getSeverityLabel={getSeverityLabel}
							getSeverityColor={getSeverityColor}
						/>
					</div>
				)}
			</div>

			{/* Modal for adding symptoms */}
			<AddSymptom
				isOpen={isAddingSymptom}
				onAdd={addSymptom}
				onCancel={() => setIsAddingSymptom(false)}
				commonSymptoms={commonSymptoms}
			/>

			{/* Modal for cycle settings */}
			<CycleSettingsModal
				isOpen={isEditingCycle}
				onClose={() => setIsEditingCycle(false)}
				cycleDaysInput={cycleDaysInput}
				onChange={setCycleDaysInput}
				onSave={updateCycleSettings}
			/>
		</div>
	)
}
