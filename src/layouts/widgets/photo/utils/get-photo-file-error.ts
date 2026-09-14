import { MAX_PHOTO_SIZE_BYTES } from '../constants'

export function getPhotoFileError(file: { type: string; size: number }): string | null {
	if (!file.type.startsWith('image/')) {
		return 'لطفا یک فایل تصویری انتخاب کن'
	}

	if (file.size > MAX_PHOTO_SIZE_BYTES) {
		return 'حجم عکس نباید بیشتر از ۱ مگابایت باشه'
	}

	return null
}
