import { useRef, useEffect, useState } from 'react'
import { isNumber } from '@/utils/validators'

type OtpInputProps = {
	otp: string
	setOtp: (otp: string) => void
	isError: boolean
}

const OTP_LENGTH = 6

const OtpInput: React.FC<OtpInputProps> = ({ otp, setOtp, isError }) => {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])
	// Track which positions have values (source of truth)
	const [positions, setPositions] = useState<Map<number, string>>(new Map())
	// Track if component is initialized to avoid syncing from parent
	const isInitialized = useRef(false)

	// Initialize from parent only once on mount or when otp is cleared
	useEffect(() => {
		if (!isInitialized.current || otp === '') {
			const newPositions = new Map<number, string>()
			for (let i = 0; i < otp.length && i < OTP_LENGTH; i++) {
				newPositions.set(i, otp[i])
			}
			setPositions(newPositions)
			isInitialized.current = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Auto-focus first input on mount
	useEffect(() => {
		inputRefs.current[0]?.focus()
	}, [])

	// Convert positions Map to array for rendering
	const otpArray = Array.from({ length: OTP_LENGTH }, (_, i) => positions.get(i) || '')

	// Helper to send clean string to parent (only digits, no spaces)
	const updateParentOtp = (newPositions: Map<number, string>) => {
		// Collect all digits in order from positions that have values
		const digits: string[] = []
		for (let i = 0; i < OTP_LENGTH; i++) {
			const digit = newPositions.get(i)
			if (digit) digits.push(digit)
		}
		setOtp(digits.join(''))
	}

	const handleChange = (index: number, value: string) => {
		// Only allow single digits
		if (value && !isNumber(value)) return

		const newPositions = new Map(positions)

		if (value) {
			newPositions.set(index, value)
		} else {
			newPositions.delete(index)
		}

		setPositions(newPositions)
		updateParentOtp(newPositions)

		// Auto-focus next input when digit entered
		if (value && index < OTP_LENGTH - 1) {
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace') {
			const currentValue = positions.get(index)

			if (!currentValue && index > 0) {
				// If empty, move to previous input
				inputRefs.current[index - 1]?.focus()
			}
		}
	}

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault()
		const pastedData = e.clipboardData.getData('text').trim()

		// Validate: only digits, max 6 chars
		if (!pastedData || !/^\d+$/.test(pastedData)) return

		const digits = pastedData.slice(0, OTP_LENGTH)
		const newPositions = new Map<number, string>()

		// Fill positions from the beginning
		for (let i = 0; i < digits.length; i++) {
			newPositions.set(i, digits[i])
		}

		setPositions(newPositions)
		updateParentOtp(newPositions)

		// Focus last filled input
		const lastIndex = Math.min(digits.length - 1, OTP_LENGTH - 1)
		setTimeout(() => inputRefs.current[lastIndex]?.focus(), 0)
	}

	return (
		<div className="flex gap-1.5 md:gap-2 justify-center" dir="ltr">
			{otpArray.map((digit, index) => (
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
					onPaste={handlePaste}
					className={`w-10 h-12 md:w-12 md:h-14 text-center text-xl md:text-2xl font-bold bg-dark-bg border-2 ${
						isError ? 'border-red-500 bg-red-50/5' : 'border-dark-border'
					} rounded-lg md:rounded-xl text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50 active:scale-95`}
				/>
			))}
		</div>
	)
}

export default OtpInput
