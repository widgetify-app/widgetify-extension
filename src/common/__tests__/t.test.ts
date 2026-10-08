import { describe, expect, it } from 'bun:test'
import { t } from '@/common/i18n'

describe('t', () => {
	it('looks up a catalog string', () => {
		expect(t('common.coin.name')).toBe('ویج‌کوین')
	})

	it('replaces named parameters', () => {
		expect(t('ui.slider.slide', { n: 3 })).toBe('اسلاید 3')
	})

	it('leaves an unknown placeholder when a parameter is missing at runtime', () => {
		const broken = t as (
			key: string,
			params?: Record<string, string | number>
		) => string
		expect(broken('ui.slider.slide', {})).toBe('اسلاید {n}')
	})

	it('looks up confirmation copy', () => {
		expect(t('ui.common.confirmAction')).toBe('این کار انجام بشه؟')
		expect(t('ui.common.areYouSure')).toBe('مطمئنی؟')
		expect(t('ui.common.confirm')).toBe('تایید')
		expect(t('ui.common.cancel')).toBe('انصراف')
		expect(t('ui.common.close')).toBe('بستن')
		expect(t('ui.common.moment')).toBe('یه لحظه…')
		expect(t('ui.common.loading')).toBe('در حال بارگذاری')
		expect(t('ui.common.notifications')).toBe('اعلان‌ها')
		expect(t('ui.common.pickColor')).toBe('انتخاب رنگ')
		expect(t('ui.common.previous')).toBe('قبلی')
		expect(t('ui.common.next')).toBe('بعدی')
		expect(t('ui.vip.pro')).toBe('پرو')
		expect(t('ui.slider.prevImage')).toBe('عکس قبلی')
		expect(t('ui.slider.nextImage')).toBe('عکس بعدی')
		expect(t('ui.slider.role')).toBe('اسلایدر')
		expect(t('ui.slider.images')).toBe('تصاویر')
		expect(t('ui.date.weekday.sat')).toBe('ش')
		expect(t('ui.date.weekday.sun')).toBe('ی')
		expect(t('ui.date.weekday.mon')).toBe('د')
		expect(t('ui.date.weekday.tue')).toBe('س')
		expect(t('ui.date.weekday.wed')).toBe('چ')
		expect(t('ui.date.weekday.thu')).toBe('پ')
		expect(t('ui.date.weekday.fri')).toBe('ج')
	})
})
