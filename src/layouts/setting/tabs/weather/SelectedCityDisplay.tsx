import type { SelectedCity } from '@/context/weather.context'
import { BiCurrentLocation } from 'react-icons/bi'

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
							<h3 className={'font-bold 2 text-primary/80 text-lg'}>
								{city.name}
							</h3>

							<div
								className={
									'text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700'
								}
							>
								{city.state}
							</div>
						</div>

						<div className="flex items-center gap-4 mt-2 mb-3">
							<div className="flex items-center gap-1 text-xs">
								<BiCurrentLocation
									className="mr-1 text-primary/80"
									size={14}
								/>
								<span className="text-content">عرض: {city.lat}</span>
							</div>

							<div className="flex items-center gap-1 text-xs">
								<BiCurrentLocation className="text-content" size={14} />
								<span className="text-content">طول: {city.lon}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
