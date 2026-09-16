import { describe, expect, it } from 'bun:test'
import { getPhotoFileError } from '../utils/get-photo-file-error'

const TYPE_ERROR = 'لطفا یک فایل تصویری انتخاب کن'
const SIZE_ERROR = 'حجم عکس نباید بیشتر از ۱ مگابایت باشه'

describe('getPhotoFileError', () => {
	it('accepts an image under the limit', () => {
		expect(getPhotoFileError({ type: 'image/png', size: 1024 })).toBeNull()
		expect(getPhotoFileError({ type: 'image/webp', size: 0 })).toBeNull()
	})

	it('rejects a non image before it looks at the size', () => {
		expect(getPhotoFileError({ type: 'application/pdf', size: 1 })).toBe(TYPE_ERROR)
		expect(getPhotoFileError({ type: '', size: 1 })).toBe(TYPE_ERROR)
	})

	it('does not treat a type merely containing image as an image', () => {
		expect(getPhotoFileError({ type: 'application/image', size: 1 })).toBe(TYPE_ERROR)
	})
})
