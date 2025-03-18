import CustomCheckbox from '@/components/checkbox'
import { SectionPanel } from '@/components/section-panel'
import { useTheme } from '@/context/theme.context'

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
	const { theme, themeUtils } = useTheme()

	const getPetSettingsContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/80 border-gray-300/30'
			case 'dark':
				return 'bg-gray-800/80 border-gray-700/40'
			default: // glass
				return 'bg-white/5 border-white/10'
		}
	}

	const getHintTextStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-500'
			default:
				return 'text-gray-400'
		}
	}

	return (
		<SectionPanel title="قابلیت‌های ظاهری" delay={0.2}>
			<div className="flex flex-col gap-4">
				<div className="flex items-start gap-3">
					<CustomCheckbox
						checked={enablePets}
						onChange={() => setEnablePets(!enablePets)}
						theme={theme}
					/>
					<div onClick={() => setEnablePets(!enablePets)} className="cursor-pointer">
						<p className={`font-medium ${themeUtils.getHeadingTextStyle()}`}>
							نمایش حیوان خانگی
						</p>
						<p className={`text-sm font-light ${themeUtils.getDescriptionTextStyle()}`}>
							نمایش حیوان خانگی تعاملی روی صفحه اصلی
						</p>
					</div>
				</div>

				{enablePets && (
					<div className={`p-4 mt-4 border rounded-lg ${getPetSettingsContainerStyle()}`}>
						<p className={`mb-3 font-medium ${themeUtils.getHeadingTextStyle()}`}>
							نام حیوان خانگی
						</p>
						<input
							type="text"
							value={petName}
							onChange={(e) => setPetName(e.target.value)}
							placeholder="آکیتا"
							className={`w-full px-4 py-2 border rounded-lg ${themeUtils.getInputStyles()}`}
						/>
						<p className={`mt-2 text-xs ${getHintTextStyle()}`}>
							در صورت خالی بودن، نام پیش‌فرض "آکیتا" استفاده می‌شود.
						</p>
					</div>
				)}
			</div>
		</SectionPanel>
	)
}
