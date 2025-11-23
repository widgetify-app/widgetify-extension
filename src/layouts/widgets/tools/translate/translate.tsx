import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { GoArrowSwitch } from 'react-icons/go'
import { MdOutlinePrivacyTip } from 'react-icons/md'
import { TbLanguage } from 'react-icons/tb'
import Analytics from '@/analytics'
import { RequireAuth } from '@/components/auth/require-auth'
import { RequireVerification } from '@/components/auth/require-verification'
import { Button } from '@/components/button/button'
import { SelectBox } from '@/components/selectbox/selectbox'
import { useAuth } from '@/context/auth.context'
import {
	getLanguageDisplayName,
	type TranslateRequestInput,
	useAvailableLanguages,
	useTranslate,
} from '@/services/hooks/translate'
import { translateError } from '@/utils/translate-error'
import { PlatformModal } from './components/platform-modal'
import { TranslationInput } from './components/translation-input'
import { TranslationResult } from './components/translation-result'
import { validateTranslateRequest } from './shared'
import { showToast } from '@/common/toast'

export const TranslateComponent: React.FC = () => {
	const { isAuthenticated, user } = useAuth()
	const [toLanguage, setToLanguage] = useState<string>('fa')
	const [inputText, setInputText] = useState<string>('')
	const [translatedText, setTranslatedText] = useState<string>('')
	const [validationError, setValidationError] = useState<string>('')
	const [rateLimitTimer, setRateLimitTimer] = useState<number>(0)
	const [showPlatformModal, setShowPlatformModal] = useState<boolean>(false)

	const isEnabled = (isAuthenticated && user?.verified) || false

	const { data: fetchedLanguages, isLoading: isLoadingLanguages } =
		useAvailableLanguages({ enabled: isEnabled })

	const translateMutation = useTranslate()

	const errorMessage = useMemo(() => {
		if (!validationError) return ''
		return translateError(validationError) as string
	}, [validationError])

	const handleTranslate = async () => {
		if (!isEnabled) {
			showToast('برای استفاده از مترجم لطفا وارد شوید', 'error')
			return
		}

		if (translateMutation.isPending) {
			return
		}

		if (!inputText.trim()) {
			setValidationError('EMPTY_TEXT')
			return
		}

		const request: TranslateRequestInput = {
			from: 'auto',
			to: toLanguage,
			text: inputText,
		}

		const validation = validateTranslateRequest(request)
		if (!validation.isValid) {
			setValidationError(validation.error || '')
			return
		}

		setValidationError('')
		setRateLimitTimer(0)
		translateMutation.mutate(request, {
			onSuccess: (data) => {
				setTranslatedText(data.translated)
				Analytics.event(`translate_success_auto_to_${toLanguage}`)
			},
			onError: (error: any) => {
				const errorData = error.response?.data
				const tryAfter = errorData?.tryAfter
				if (tryAfter && typeof tryAfter === 'number') {
					setRateLimitTimer(tryAfter)
				}

				setValidationError(errorData.message || 'TRANSLATE_ERROR')
				Analytics.event(`translate_error_auto_to_${toLanguage}`)
			},
		})
	}

	const onChangeInputText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (e.target.value === '') {
			setTranslatedText('')
		}

		setInputText(e.target.value)
	}

	useEffect(() => {
		if (validationError && rateLimitTimer === 0) {
			setValidationError('')
		}
	}, [toLanguage, inputText, validationError, rateLimitTimer])

	const decrementTimer = useCallback(() => {
		setRateLimitTimer((prev) => {
			if (prev <= 1) {
				setValidationError('')
				return 0
			}
			return prev - 1
		})
	}, [])

	useEffect(() => {
		let interval: NodeJS.Timeout
		if (rateLimitTimer > 0) {
			interval = setInterval(decrementTimer, 1000)
		}

		return () => {
			if (interval) clearInterval(interval)
		}
	}, [rateLimitTimer, decrementTimer])

	if (isLoadingLanguages) {
		return (
			<div className="flex flex-col items-center justify-center h-64 space-y-3">
				<div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
					<TbLanguage className="w-6 h-6 text-primary animate-pulse" />
				</div>
				<p className="text-sm text-content">بارگذاری زبان‌ها...</p>
			</div>
		)
	}

	const languageOptions =
		fetchedLanguages?.languages?.map((lang) => ({
			label: getLanguageDisplayName(lang),
			value: lang,
		})) || []

	return (
		<RequireAuth mode="preview">
			<RequireVerification mode="preview">
				<div className="flex flex-col gap-2 p-1">
					<div className="flex items-center gap-1">
						<div className="flex-1">
							<SelectBox
								options={languageOptions}
								disabled={true}
								value={'auto'}
								onChange={() => {}}
								className="!w-full !h-6 !text-xs !bg-content hover:!bg-base-200"
								optionClassName="!bg-base-100"
							/>
						</div>

						<Button
							size="xs"
							className="btn btn-ghost !btn-xs !w-6 !h-6 !min-h-6 !p-0"
							disabled={true}
						>
							<div className={`transition-transform duration-300`}>
								<GoArrowSwitch className="w-3 h-3" />
							</div>
						</Button>

						<div className="flex-1">
							<SelectBox
								options={languageOptions.filter(
									(lang) => lang.value !== 'auto'
								)}
								value={toLanguage}
								onChange={setToLanguage}
								className="!w-full !h-6 !text-xs !bg-content hover:!bg-base-200"
								optionClassName="!bg-base-100"
							/>
						</div>
					</div>

					<TranslationInput
						inputText={inputText}
						fromLanguage={'auto'}
						onChangeInputText={onChangeInputText}
					/>

					<TranslationResult
						translatedText={translatedText}
						validationError={validationError}
						errorMessage={errorMessage}
						toLanguage={toLanguage}
						translateMutation={translateMutation}
					/>

					<div className="flex flex-row justify-between w-full gap-1">
						<Button
							onClick={handleTranslate}
							disabled={
								!inputText.trim() ||
								translateMutation.isPending ||
								rateLimitTimer > 0 ||
								fetchedLanguages?.isAvailableService === false
							}
							className="flex-1 !h-7 !min-h-7 !text-xs rounded-2xl"
							isPrimary={true}
							size="sm"
						>
							{fetchedLanguages?.isAvailableService === false ? (
								<div className="flex items-center gap-1 text-muted">
									<TbLanguage className="w-3 h-3" />
									خدمات در دسترس نیست.
								</div>
							) : translateMutation.isPending ? (
								<>
									<div className="loading loading-spinner loading-xs"></div>
									ترجمه...
								</>
							) : rateLimitTimer > 0 ? (
								<>
									<TbLanguage className="w-3 h-3" />
									{rateLimitTimer}ثانیه
								</>
							) : (
								<>
									<TbLanguage className="w-3 h-3" />
									ترجمه
								</>
							)}
						</Button>
						<Button
							className="!text-xs btn-ghost !p-0 !w-7 !h-7"
							isPrimary={false}
							rounded="full"
							size="sm"
							onClick={() => setShowPlatformModal(true)}
						>
							<MdOutlinePrivacyTip size={14} />
						</Button>
					</div>
					<PlatformModal
						isOpen={showPlatformModal}
						onClose={() => setShowPlatformModal(false)}
						platform={{
							link: fetchedLanguages?.platform.link || '-',
							name: fetchedLanguages?.platform.name || '-',
						}}
					/>
				</div>
			</RequireVerification>
		</RequireAuth>
	)
}
