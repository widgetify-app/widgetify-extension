import { getFaviconFromUrl } from '@/common/utils/icon'
import { Button, Modal } from '@/components/ui'
import { TextInput } from '@/components/ui'
import { useEffect, useState } from 'react'
import type { Bookmark } from '../../types/bookmark.types'
import { ShowAdvancedButton } from '../shared'
import { AdvancedModal } from './advanced.modal'
import { useIsMutating } from '@tanstack/react-query'
import { BookmarkIconPicker } from '../bookmark-icon.picker'

interface EditBookmarkModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (out: BookmarkUpdateFormFields) => void
	bookmark: Bookmark | null
}

export interface BookmarkUpdateFormFields {
	readonly id?: string
	readonly onlineId?: string
	title: string
	url: string | null
	customImage: File | null
	customBackground: string | null
	customTextColor: string | null
	sticker: string | null
	icon: File | string | null
	isDeletedIcon: boolean
}

const empty: BookmarkUpdateFormFields = {
	id: undefined,
	onlineId: undefined,
	title: '',
	url: '',
	customImage: null,
	customBackground: '',
	customTextColor: '',
	sticker: '',
	icon: null,
	isDeletedIcon: false,
}
type UpdateBookmarkUpdateFormData = <K extends keyof BookmarkUpdateFormFields>(
	key: K,
	value: BookmarkUpdateFormFields[K]
) => void

export function EditBookmarkModal({
	isOpen,
	onClose,
	onSave,
	bookmark,
}: EditBookmarkModalProps) {
	const [formData, setFormData] = useState<BookmarkUpdateFormFields>(
		structuredClone(empty)
	)

	const isUpdating = useIsMutating({ mutationKey: ['updateBookmark'] }) > 0

	const [showAdvanced, setShowAdvanced] = useState(false)
	const [icon, setIcon] = useState<string | null | File>(null)

	const type = bookmark?.type

	const updateFormData: UpdateBookmarkUpdateFormData = (key, value) => {
		if (key === 'icon') {
			// @ts-expect-error
			setIcon(value || null)
		}
		setFormData((prev) => ({ ...prev, [key]: value }))
	}

	const handleSave = () => {
		if (!formData.title?.trim() || !bookmark) return

		onSave({
			title: formData.title.trim(),
			url: formData.url || null,
			customBackground: formData.customBackground || null,
			customImage: formData.customImage,
			customTextColor: formData.customTextColor || null,
			sticker: formData.sticker || null,
			icon: formData.icon,
			id: bookmark.id,
			onlineId: bookmark.onlineId || undefined,
			isDeletedIcon: formData.isDeletedIcon,
		})
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
		if (bookmark) {
			setFormData({
				onlineId: bookmark.onlineId || undefined,
				id: bookmark.id,
				title: bookmark.title,
				customBackground: bookmark.customBackground,
				customImage: null,
				customTextColor: bookmark.customTextColor,
				icon: bookmark.icon || null,
				sticker: bookmark.sticker,
				url: bookmark.url,
				isDeletedIcon: false,
			})
			if (bookmark.icon) {
				setIcon(bookmark.icon)
			} else if (bookmark.type === 'BOOKMARK' && bookmark.url) {
				setIcon(getFaviconFromUrl(bookmark.url))
			} else {
				setIcon(null)
			}
		} else {
			setFormData(structuredClone(empty))
			setIcon(null)
		}
	}, [bookmark, isOpen])

	if (!bookmark) return null

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size="md"
				title={`ویرایش ${type === 'FOLDER' ? 'پوشه' : 'بوکمارک'}`}
				direction="rtl"
				className="overflow-y-hidden!"
				closeOnBackdropClick={false}
			>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						handleSave()
					}}
					onContextMenu={(e) => e.stopPropagation()}
					className="flex flex-col gap-4"
				>
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3 pt-1">
							<BookmarkIconPicker
								onChange={(value) => {
									updateFormData('icon', value)
									if (value) {
										updateFormData('isDeletedIcon', false)
										setIcon(value)
									} else {
										updateFormData('isDeletedIcon', true)
										setIcon(null)
									}
								}}
								value={icon}
								url={formData.url}
							/>

							<div className="flex-1">
								<TextInput
									type="text"
									name="title"
									placeholder={
										type === 'FOLDER' ? 'نام پوشه' : 'عنوان بوکمارک'
									}
									value={formData.title}
									onChange={(value) => updateFormData('title', value)}
									className="w-full px-3.5 py-2.5 text-right transition-all duration-200 rounded-xl"
								/>
							</div>
						</div>

						{type === 'BOOKMARK' && (
							<div>
								<TextInput
									name="url"
									type="text"
									direction="ltr"
									placeholder="https://example.com"
									value={formData.url || ''}
									onChange={(value) => updateFormData('url', value)}
									className="w-full px-3.5 py-2.5 text-left font-mono text-xs transition-all duration-200 rounded-xl"
								/>
							</div>
						)}
					</div>

					<div className="flex items-center justify-between pt-2 border-t border-base-content/10">
						<ShowAdvancedButton
							showAdvanced={showAdvanced}
							setShowAdvanced={setShowAdvanced}
						/>

						<div className="flex items-center gap-2">
							<Button
								type="button"
								onClick={onClose}
								size="md"
								disabled={isUpdating}
								className="w-20 transition-colors duration-300 ease-in-out border-none shadow-none bg-base-300 hover:bg-error/10 text-base-content/80 hover:text-error rounded-2xl"
							>
								لغو
							</Button>
							<Button
								type="submit"
								disabled={
									!formData.title?.trim() ||
									(type === 'BOOKMARK' && !formData.url?.trim()) ||
									isUpdating
								}
								size="md"
								loading={isUpdating}
								className="transition-colors duration-300 ease-in-out border-none shadow-none w-28 rounded-2xl"
								variant="primary"
							>
								ذخیره
							</Button>
						</div>
					</div>
				</form>
			</Modal>

			<AdvancedModal
				bookmark={{
					...formData,
					type: type || 'BOOKMARK',
				}}
				isOpen={showAdvanced}
				onClose={handleAdvancedModalClose}
				title="تنظیمات پیشرفته"
			/>
		</>
	)
}
