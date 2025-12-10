import { isNumber } from '@/utils/validators'

type OtpInputProps = {
	otp: Array<string>
	setOtp: (otp: Array<string>) => void
	error: string | null
	setError: (error: string | null) => void
}

const OtpInput: React.FC<OtpInputProps> = ({ otp, setOtp, error, setError }) => {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])

	const handleChange = (index: number, value: string) => {
		if (value && !isNumber(value)) return

		const newOtp = [...otp]
		newOtp[index] = value
		setOtp(newOtp)
		setError('')

		// Move to next input
		if (value && index < 5) inputRefs.current[index + 1]?.focus()
	}

	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		// Move to previous input on backspace
		if (e.key === 'Backspace' && !otp[index] && index > 0)
			inputRefs.current[index - 1]?.focus()
	}

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault()
		const pastedData = e.clipboardData.getData('text').slice(0, 6)

		if (!isNumber(pastedData)) return

		const newOtp = [...otp]
		pastedData.split('').forEach((char, index) => {
			if (index < 6) newOtp[index] = char
		})
		setOtp(newOtp)

		// Focus last filled input or last input
		const lastFilledIndex = Math.min(pastedData.length, 5)
		inputRefs.current[lastFilledIndex]?.focus()
	}

	return (
		<div
			className="flex gap-1.5 md:gap-2 justify-center"
			onPaste={handlePaste}
			dir="ltr"
		>
			{otp.map((digit, index) => (
				<input
					key={index}
					ref={(el) => {
						inputRefs.current[index] = el
					}}
					type="text"
					inputMode="numeric"
					maxLength={1}
					value={digit}
					aria-label={`کد تایید رقم ${index + 1}`}
					onChange={(e) => handleChange(index, e.target.value)}
					onKeyDown={(e) => handleKeyDown(index, e)}
					className={`w-10 h-12 md:w-12 md:h-14 text-center text-xl md:text-2xl font-bold bg-dark-bg border-2 ${
						error ? 'border-red-500 bg-red-50/5' : 'border-dark-border'
					} rounded-lg md:rounded-xl text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50 active:scale-95`}
				/>
			))}
		</div>
	)
}

export default OtpInput
