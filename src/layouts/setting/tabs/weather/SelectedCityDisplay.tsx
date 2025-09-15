import type { SelectedCity } from '@/context/general-setting.context'

interface SelectedCityDisplayProps {
	city: SelectedCity | null
}

export function SelectedCityDisplay({ city }: SelectedCityDisplayProps) {
	if (!city) return null
	return (
		<div className={'w-full rounded-xl overflow-hidden border border-content'}>
			<div className="p-4">
				<div className="flex items-start">
					<div className="flex-1">
						<div className="flex items-center justify-between">
							<div
								className={
									'text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold'
								}
							>
								{city.state}
							</div>
						</div>

						<div className="flex items-center gap-4 mt-2 mb-3">
							<span className="font-semibold">{city.name}</span> با موفقیت
							انتخاب شد و به صورت خودکار در ویجت‌های مربوطه اعمال می‌شود.
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
