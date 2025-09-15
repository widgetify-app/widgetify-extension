import { getMainClient } from '@/services/api'
import type {
	AvailableLanguagesResponse,
	TranslateApiResponse,
	TranslateRequestInput,
	TranslateSuccessResponse,
} from './translate.types'

export async function translateText(
	request: TranslateRequestInput
): Promise<TranslateApiResponse> {
	const client = await getMainClient()
	const response = await client.post<TranslateSuccessResponse>('/translate', request)
	return response.data
}

export async function getAvailableLanguages(): Promise<AvailableLanguagesResponse> {
	const client = await getMainClient()
	const response = await client.get<AvailableLanguagesResponse>(
		'/translate/available-languages'
	)
	return response.data
}
