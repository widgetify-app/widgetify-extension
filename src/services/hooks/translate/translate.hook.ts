import { useMutation, useQuery } from '@tanstack/react-query'
import type {
	AvailableLanguagesResponse,
	TranslateRequestInput,
	TranslateResponse,
} from './translate.types'
import { getAvailableLanguages, translateText } from './translateService'

export function useTranslate() {
	return useMutation<TranslateResponse, Error, TranslateRequestInput>({
		mutationFn: async (request: TranslateRequestInput) => {
			const response = await translateText(request)

			if ('translated' in response && response.translated) {
				return response as TranslateResponse
			}

			if ('statusCode' in response && response.statusCode && !response.success) {
				const error = new Error(response.message) as Error & {
					statusCode: number
					tryAfter?: number
				}
				error.statusCode = response.statusCode
				error.tryAfter = response.tryAfter
				throw error
			}

			return response as TranslateResponse
		},
		retry: false,
	})
}
interface Options {
	enabled: boolean
}

export function useAvailableLanguages({ enabled }: Options) {
	return useQuery<AvailableLanguagesResponse, Error>({
		queryKey: ['translate', 'available-languages'],
		queryFn: getAvailableLanguages,
		staleTime: 1000 * 60 * 30, // 30 minutes
		retry: 1,
		enabled: enabled,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	})
}
