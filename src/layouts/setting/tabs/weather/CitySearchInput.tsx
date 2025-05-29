import { TextInput } from '@/components/text-input'

interface CitySearchInputProps {
	value: string
	onChange: (e: string) => void
	onFocus: () => void
	isLoading: boolean
	ref?: React.RefObject<HTMLInputElement | null>
}

export function CitySearchInput({
	value,
	onChange,
	onFocus,
	isLoading,
	ref,
}: CitySearchInputProps) {
	const getSpinnerStyle = () => {
		return 'border-content border-t-primary/80'
	}

	return (
		<div className="relative">
			<TextInput
				ref={ref}
				value={value}
				onChange={onChange}
				onFocus={onFocus}
				placeholder="نام شهر را جستجو کنید..."
			/>
			{isLoading && (
				<div className="absolute -translate-y-1/2 left-3 top-1/2">
					<div
						className={`w-4 h-4 border-2 rounded-full animate-spin ${getSpinnerStyle()}`}
					></div>
				</div>
			)}
		</div>
	)
}
