import CustomCheckbox from '@/components/checkbox'
import { SectionPanel } from '@/components/section-panel'
import { TextInput } from '@/components/text-input'
import {
	getBorderColor,
	getDescriptionTextStyle,
	getHeadingTextStyle,
	useTheme,
} from '@/context/theme.context'

import type { PetType } from '@/context/general-setting.context';
interface PetSettingsProps {
	enablePets: boolean;
	setEnablePets: (enabled: boolean) => void;
	selectedPets: PetType[];
	setSelectedPets: (pets: PetType[]) => void;
	petNames: Record<PetType, string>;
	setPetName: (pet: PetType, name: string) => void;
}

export function PetSettings({
	enablePets,
	setEnablePets,
	selectedPets,
	setSelectedPets,
	petNames,
	setPetName,
}: PetSettingsProps) {
	const { theme } = useTheme()

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
					/>
					<div onClick={() => setEnablePets(!enablePets)} className="cursor-pointer">
						<p className={`font-medium ${getHeadingTextStyle(theme)}`}>
							نمایش حیوان خانگی
						</p>
						<p className={`text-sm font-light ${getDescriptionTextStyle(theme)}`}>
							نمایش حیوان خانگی تعاملی روی صفحه اصلی
						</p>
					</div>
				</div>

				{enablePets && (
					<div className={`p-4 mt-4 rounded-lg border ${getBorderColor(theme)}`}>
						<p className={`mb-3 font-medium ${getHeadingTextStyle(theme)}`}>
							انتخاب حیوان خانگی
						</p>
						<div className="flex gap-4 mb-4">
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={selectedPets.includes('dog')}
									onChange={() => {
										const newPets = selectedPets.includes('dog')
											? selectedPets.filter((p) => p !== 'dog')
											: [...selectedPets, 'dog'];
										setSelectedPets(newPets);
									}}
								/>
								<span>سگ</span>
							</label>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={selectedPets.includes('cat')}
									onChange={() => {
										const newPets = selectedPets.includes('cat')
											? selectedPets.filter((p) => p !== 'cat')
											: [...selectedPets, 'cat'];
										setSelectedPets(newPets);
									}}
								/>
								<span>گربه</span>
							</label>
						</div>
						<p className={`mb-2 font-medium ${getHeadingTextStyle(theme)}`}>نام حیوانات</p>
						<div className="flex gap-4">
							<div>
								<p className="text-xs mb-1">سگ</p>
								<TextInput
									type="text"
									value={petNames.dog}
									onChange={(value) => setPetName('dog', value)}
									placeholder="آکیتا"
								/>
							</div>
							<div>
								<p className="text-xs mb-1">گربه</p>
								<TextInput
									type="text"
									value={petNames.cat}
									onChange={(value) => setPetName('cat', value)}
									placeholder="گربه"
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</SectionPanel>
	);
}
