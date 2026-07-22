import { useEffect, useState } from 'react'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { Icon } from '@/src/icons'
import type { BookmarkType } from '../../types/bookmark.types'
import { BookmarkSuggestions } from '../bookmark-suggestions'
import { ShowAdvancedButton, TypeSelector } from '../shared'
import { AdvancedModal } from './advanced.modal'
import { useIsMutating } from '@tanstack/react-query'
import { BookmarkIconPicker } from '../bookmark-icon.picker'

interface AddBookmarkModalProps {
	isOpen: boolean
	onClose: () => void
	onAdd: (bookmark: BookmarkCreateFormFields) => void
	parentId: string | null
	onOpenImport?: () => void
}

export interface BookmarkCreateFormFields {
	title: string
	type: BookmarkType
	parentId: string | null
	url: string | null
	customImage: File | null
	customBackground: string | null
	customTextColor: string | null
	sticker: string | null
	icon: File | null
}

const empty: BookmarkCreateFormFields = {
	title: '',
	url: '',
	customImage: null,
	customBackground: '',
	parentId: '',
	type: 'BOOKMARK',
	customTextColor: '',
	sticker: '',
	icon: null,
}

export type AddBookmarkUpdateFormData = <K extends keyof BookmarkCreateFormFields>(
	key: K,
	value: BookmarkCreateFormFields[K]
) => void

export function AddBookmarkModal({
	isOpen,
	onClose,
	onAdd,
	parentId = null,
	onOpenImport,
}: AddBookmarkModalProps) {
	const [type, setType] = useState<BookmarkType>('BOOKMARK')
	const [showAdvanced, setShowAdvanced] = useState(false)

	const isAdding = useIsMutating({ mutationKey: ['addBookmark'] }) > 0

	const [formData, setFormData] = useState<BookmarkCreateFormFields>(
		structuredClone(empty)
	)

	const updateFormData: AddBookmarkUpdateFormData = <
		K extends keyof BookmarkCreateFormFields,
	>(
		key: K,
		value: BookmarkCreateFormFields[K]
	) => {
		setFormData((prev) => ({ ...prev, [key]: value }))
	}

	const handleUrlChange = (value: string) => {
		const newUrl = value.trim()
		updateFormData('url', newUrl)

		updateFormData('icon', null)

		if (formData.title.trim() === '' && newUrl !== '') {
			let hostName = ''
			try {
				hostName = new URL(newUrl).hostname
				if (hostName && hostName.split('.').length > 2) {
					hostName = hostName.split('.')[1]
				}
			} catch {
				hostName = newUrl
			}

			updateFormData('title', hostName)
		}
	}

	const handleAdd = (e: React.FormEvent) => {
		e.preventDefault()

		if (!formData.title.trim()) return

		let newUrl = formData.url
		if (newUrl && !newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
			newUrl = `https://${newUrl}`
		}
		const baseBookmark: BookmarkCreateFormFields = {
			title: formData.title.trim(),
			url: type === 'BOOKMARK' && newUrl ? newUrl.trim() : null,
			type,
			parentId,
			customImage: formData.customImage,
			customBackground: formData.customBackground || null,
			customTextColor: formData.customTextColor || null,
			sticker: formData.sticker || null,
			icon: formData.icon,
		}

		onAdd(baseBookmark)
	}

	const resetForm = () => {
		setFormData(structuredClone(empty))
		setType('BOOKMARK')
		setShowAdvanced(false)
	}

	const onCloseHandler = () => {
		resetForm()
		onClose()
	}

	const handleSuggestionSelect = (suggestion: {
		title: string
		url: string
		icon: string | null
	}) => {
		updateFormData('title', suggestion.title)
		updateFormData('url', suggestion.url)
	}

	const handleAdvancedModalClose = (
		data: {
			background: string | null
			textColor: string | null
			sticker: string | null
		} | null
	) => {
		setShowAdvanced(false)

		if (data) {
			if (data.background !== undefined) {
				updateFormData('customBackground', data.background)
			}

			if (data.textColor !== undefined) {
				updateFormData('customTextColor', data.textColor)
			}

			if (data.sticker !== undefined) {
				updateFormData('sticker', data.sticker)
			}
		}
	}

	useEffect(() => {
		if (isOpen) {
			resetForm()
		}
	}, [isOpen])

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => onCloseHandler()}
			size="md"
			title={`${type === 'FOLDER' ? 'پوشه جدید' : 'بوکمارک جدید'}`}
			direction="rtl"
			className="overflow-y-hidden!"
			closeOnBackdropClick={false}
		>
			<form
				onSubmit={handleAdd}
				className="flex flex-col justify-between gap-2 overflow-y-auto h-96"
			>
				<div className="mt-1 overflow-hidden">
					<TypeSelector type={type} setType={setType} />
					{onOpenImport && (
						<button
							type="button"
							onClick={onOpenImport}
							className="flex items-center justify-center w-fit mx-auto px-3 gap-1.5 mt-2 py-1.5 text-[11px] font-medium transition-colors rounded-xl cursor-pointer hover:text-primary text-base-content/80 bg-base-200 hover:bg-primary/10"
						>
							<Icon name="download" size={12} />
							درون‌ریزی از بوکمارک‌های مرورگر
						</button>
					)}
					<div className="flex items-center gap-2 mt-2">
						<TextInput
							type="text"
							name="title"
							placeholder={type === 'FOLDER' ? 'نام پوشه' : 'عنوان بوکمارک'}
							value={formData.title}
							onChange={(v) => updateFormData('title', v)}
							className={
								'w-full px-4 py-3 text-right rounded-lg transition-all duration-200 '
							}
						/>

						<BookmarkIconPicker
							onChange={(value) => updateFormData('icon', value)}
							value={formData.icon}
							url={formData.url}
						/>
					</div>
					<div className="relative h-12.5">
						{type === 'BOOKMARK' && (
							<TextInput
								type="text"
								name="url"
								placeholder="آدرس لینک"
								value={formData.url || ''}
								onChange={(v) => handleUrlChange(v)}
								className={
									'mt-2 w-full px-4 py-3 text-right absolute rounded-lg transition-all duration-300'
								}
							/>
						)}
					</div>
					{type === 'BOOKMARK' && (
						<BookmarkSuggestions onSelect={handleSuggestionSelect} />
					)}

					<AdvancedModal
						bookmark={formData}
						isOpen={showAdvanced}
						onClose={handleAdvancedModalClose}
						title={'تنظیمات پیشرفته'}
					/>
				</div>

				<div className="flex justify-between h-10 gap-x-4">
					<ShowAdvancedButton
						showAdvanced={showAdvanced}
						setShowAdvanced={setShowAdvanced}
					/>

					<div className="flex items-center gap-x-2">
						<Button
							onClick={onCloseHandler}
							size="md"
							className="w-20 transition-colors duration-300 ease-in-out border-none shadow-none btn bg-base-300 hover:bg-error/10 text-base-content/80 hover:text-error rounded-2xl"
						>
							لغو
						</Button>
						<Button
							type="submit"
							disabled={
								!formData.title?.trim() ||
								(type === 'BOOKMARK' && !formData.url?.trim()) ||
								isAdding
							}
							size="md"
							isPrimary={true}
							loading={isAdding}
							className={
								'btn w-28 border-none shadow-none text-secondary rounded-2xl transition-colors duration-300 ease-in-out'
							}
						>
							ذخیره
						</Button>
					</div>
				</div>
			</form>
		</Modal>
	)
}
