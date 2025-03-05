import { SectionPanel } from '../../../../../components/section-panel'

interface ContentAlignmentSettingsProps {
	contentAlignment: 'center' | 'top'
	setContentAlignment: (alignment: 'center' | 'top') => void
}

export function ContentAlignmentSettings({
	contentAlignment,
	setContentAlignment,
}: ContentAlignmentSettingsProps) {
	return (
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
	)
}
