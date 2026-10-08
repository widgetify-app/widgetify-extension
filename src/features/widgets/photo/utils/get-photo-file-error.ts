import { t } from '@/common/i18n'

export function getPhotoFileError(file: { type: string; size: number }): string | null {
	if (!file.type.startsWith('image/')) {
		return t('widgets.photo.typeError')
	}

	return null
}
