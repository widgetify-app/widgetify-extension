import CustomCheckbox from '@/components/checkbox'
import { SectionPanel } from '@/components/section-panel'
import { TextInput } from '@/components/text-input'
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
					<div className={`p-4 mt-4  rounded-lg border ${themeUtils.getBorderColor()}`}>
						<p className={`mb-3 font-medium ${themeUtils.getHeadingTextStyle()}`}>
							نام حیوان خانگی
						</p>
						<TextInput
							type="text"
							value={petName}
							onChange={(value) => setPetName(value)}
							placeholder="آکیتا"
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
