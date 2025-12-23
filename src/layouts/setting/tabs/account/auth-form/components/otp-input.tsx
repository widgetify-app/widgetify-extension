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
	const [positions, setPositions] = useState<Map<number, string>>(new Map())
	const isInitialized = useRef(false)

	useEffect(() => {
		if (!isInitialized.current || otp === '') {
			const newPositions = new Map<number, string>()
			for (let i = 0; i < otp.length && i < OTP_LENGTH; i++) {
				newPositions.set(i, otp[i])
			}
			setPositions(newPositions)
			isInitialized.current = true
		}
	}, [])

	useEffect(() => {
		inputRefs.current[0]?.focus()
	}, [])

	const otpArray = Array.from({ length: OTP_LENGTH }, (_, i) => positions.get(i) || '')

	const updateParentOtp = (newPositions: Map<number, string>) => {
		const digits: string[] = []
		for (let i = 0; i < OTP_LENGTH; i++) {
			const digit = newPositions.get(i)
			if (digit) digits.push(digit)
		}
		setOtp(digits.join(''))
	}

	const handleChange = (index: number, value: string) => {
		if (value && !isNumber(value)) return

		const newPositions = new Map(positions)

		if (value) {
			newPositions.set(index, value)
		} else {
			newPositions.delete(index)
		}

		setPositions(newPositions)
		updateParentOtp(newPositions)

		if (value && index < OTP_LENGTH - 1) {
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace') {
			const currentValue = positions.get(index)

			if (!currentValue && index > 0) {
				inputRefs.current[index - 1]?.focus()
			}
		}
	}

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault()
		const pastedData = e.clipboardData.getData('text').trim()

		if (!pastedData || !/^\d+$/.test(pastedData)) return

		const digits = pastedData.slice(0, OTP_LENGTH)
		const newPositions = new Map<number, string>()

		for (let i = 0; i < digits.length; i++) {
			newPositions.set(i, digits[i])
		}

		setPositions(newPositions)
		updateParentOtp(newPositions)

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
					className={`w-10 h-12 md:w-12 md:h-14 text-center text-xl md:text-2xl font-bold border-2 ${
						isError
							? 'border-error/80 bg-error/30 text-error'
							: 'border-content bg-content'
					} rounded-lg md:rounded-xl text-base-content/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50 active:scale-95`}
				/>
			))}
		</div>
	)
}

export default OtpInput
