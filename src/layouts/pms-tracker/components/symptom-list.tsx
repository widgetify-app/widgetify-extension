import { motion } from 'framer-motion'
import type { PMSSymptom } from '../types'

interface SymptomListProps {
	symptoms: PMSSymptom[]
	onRemove: (id: string) => void
	formatDate: (dateString: string) => string
	getSeverityLabel: (severity: string) => string
	getSeverityColor: (severity: string) => string
}

export const SymptomList = ({
	symptoms,
	onRemove,
	formatDate,
	getSeverityLabel,
	getSeverityColor,
}: SymptomListProps) => {
	if (symptoms.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-12 h-12 mb-3 text-pink-500 opacity-30"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
				</svg>
				<p className="text-sm opacity-50">هنوز هیچ علامتی ثبت نشده است</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-2">
			{symptoms.map((symptom, index) => (
				<motion.div
					key={symptom.id}
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: index * 0.1 }}
				>
					<div className="p-2 border rounded-lg border-gray-300/20 dark:border-gray-700">
						<div className="flex items-start justify-between">
							<h3 className="text-sm font-medium">{symptom.name}</h3>
							<span
								className={`px-2 py-1 mr-1 text-xs rounded-full whitespace-nowrap ${getSeverityColor(symptom.severity)}`}
							>
								{getSeverityLabel(symptom.severity)}
							</span>
						</div>
						<div className="flex items-center justify-between mt-2 text-xs opacity-60">
							<button
								className="text-red-500 transition-colors hover:text-red-700"
								onClick={() => onRemove(symptom.id)}
							>
								حذف
							</button>
							<span dir="ltr">{formatDate(symptom.date)}</span>
						</div>
					</div>
				</motion.div>
			))}
		</div>
	)
}
