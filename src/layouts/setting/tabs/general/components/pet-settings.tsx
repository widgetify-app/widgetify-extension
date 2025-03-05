import { SectionPanel } from '../../../../../components/section-panel'
import CustomCheckbox from '../../../../../components/checkbox'

interface PetSettingsProps {
	enablePets: boolean
	setEnablePets: (enabled: boolean) => void
	petName: string
	setPetName: (name: string) => void
}

export function PetSettings({
	enablePets,
	setEnablePets,
	petName,
	setPetName,
}: PetSettingsProps) {
	return (
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
	)
}
