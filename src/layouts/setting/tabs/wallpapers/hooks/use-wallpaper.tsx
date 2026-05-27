import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import type { StoredWallpaper, Wallpaper } from '@/common/wallpaper.interface'
import { safeAwait } from '@/services/api'
import { useChangeWallpaper } from '@/services/hooks/extension/updateSetting.hook'
import { translateError } from '@/utils/translate-error'
import Analytics from '../../../../../analytics'
import { showToast } from '@/common/toast'
import { useQueryClient } from '@tanstack/react-query'
import { playAlarm } from '@/common/playAlarm'
import { Button } from '@/components/button/button'
import { TbInfoCircle } from 'react-icons/tb'
import { useAuth } from '@/context/auth.context'
import { useAppearanceSetting } from '@/context/appearance.context'

const UI_LABELS: Record<string, string> = {
	ADVANCED: 'پیشرفته (پیشفرض)',
	SIMPLE: 'ساده و دلنواز',
}
export function useWallpaper(fetchedWallpapers: Wallpaper[] | undefined) {
	const queryClient = useQueryClient()
	const { isAuthenticated } = useAuth()
	const { setUI, ui } = useAppearanceSetting()
	const [selectedBackground, setSelectedBackground] = useState<Wallpaper | null>(null)
	const { mutateAsync } = useChangeWallpaper()
	const [customWallpaper, setCustomWallpaper] = useState<Wallpaper | null>(null)

	useEffect(() => {
		async function getWallpaper() {
			const wallpaper: StoredWallpaper | null = await getFromStorage('wallpaper')
			if (wallpaper) {
				if (wallpaper.id === 'custom-wallpaper') {
					const customWp = await getFromStorage('customWallpaper')
					if (customWp) {
						setCustomWallpaper(customWp)
						setSelectedBackground(customWp)
					}
				} else if (wallpaper.type === 'GRADIENT' && wallpaper.gradient) {
					const gradientWallpaper: Wallpaper = {
						id: wallpaper.id,
						name: wallpaper.id.includes('custom')
							? 'گرادیان سفارشی'
							: 'گرادیان',
						type: 'GRADIENT',
						src: '',
						previewSrc: '',
						gradient: wallpaper.gradient,
					}
					setSelectedBackground(gradientWallpaper)
				} else {
					if (fetchedWallpapers) {
						const foundWallpaper = fetchedWallpapers.find(
							(wp) => wp.id === wallpaper.id
						)
						if (foundWallpaper) {
							setSelectedBackground(foundWallpaper)
						}
					}
				}
			}
		}

		getWallpaper()
	}, [])

	const allWallpapers = () => {
		if (!fetchedWallpapers) return []

		if (customWallpaper) {
			return [...fetchedWallpapers, customWallpaper]
		}

		return fetchedWallpapers
	}

	useEffect(() => {
		if (!selectedBackground) return

		const wallpaperData: StoredWallpaper = {
			id: selectedBackground.id,
			type: selectedBackground.type,
			src: selectedBackground.src,
		}

		// Add gradient data if this is a gradient wallpaper
		if (selectedBackground.type === 'GRADIENT' && selectedBackground.gradient) {
			wallpaperData.gradient = selectedBackground.gradient
		}
		setToStorage('wallpaper', wallpaperData)

		if (selectedBackground.id === 'custom-wallpaper') {
			setToStorage('customWallpaper', selectedBackground)
		}

		callEvent('wallpaperChanged', wallpaperData)
	}, [selectedBackground])

	const handleSelectBackground = async (wallpaper: Wallpaper) => {
		if (wallpaper.isCustom) {
			setToBackground(wallpaper)
			return
		}
		if (wallpaper.coin && !isAuthenticated) {
			return showToast(
				'برای انتخاب این تصویر تصویر زمینه باید وارد حساب کاربری شوید.',
				'error'
			)
		}
		let isSet = false
		if (!wallpaper.coin || wallpaper.isOwned) {
			setToBackground(wallpaper)
			isSet = true
		}

		if (isAuthenticated) {
			const wallpaperId =
				wallpaper.type === 'GRADIENT' ? 'custom-wallpaper' : wallpaper.id

			const [error, responseWallpaper] = await safeAwait<AxiosError, Wallpaper>(
				mutateAsync({ wallpaperId })
			)
			if (error) {
				showToast(translateError(error) as string, 'error')
				return
			}

			if (wallpaper.coin && !wallpaper.isOwned) {
				showToast('هووورا! تصویر زمینه فعال شد 🎉', 'success')
				queryClient.invalidateQueries({ queryKey: ['userProfile'] })
				playAlarm('market')
			}

			if (!isSet) setToBackground(responseWallpaper)
		}

		Analytics.event('wallpaper_changed')
	}

	const handlePreviewBackground = (wallpaper: Wallpaper) => {
		setSelectedBackground(wallpaper)
		Analytics.event('wallpaper_previewed')
	}

	const onChangeUI = (ui: any) => {
		setUI(ui)
	}

	const setToBackground = (wallpaper: Wallpaper) => {
		setSelectedBackground(wallpaper)

		if (isAuthenticated && wallpaper.extensionUI) {
			if (wallpaper.extensionUI !== ui) {
				playAlarm('info')
				showToast(
					<div className="flex items-center justify-between h-20 p-1 px-4 shadow bg-glass flex- bg-base-200 rounded-3xl outline outline-primary/10">
						<div className="flex items-center gap-1">
							<div className="flex items-center justify-center rounded-full text-primary/80">
								<TbInfoCircle size={18} />
							</div>
							<div className="mr-1 text-sm">
								<p>
									حالت ظاهری{' '}
									<strong>{UI_LABELS[wallpaper.extensionUI]}</strong>{' '}
									پیشنهاد شده!
								</p>
								<span className="text-[10px]">
									حالت ظاهری رو میتونید تو تنظیمات تغییر بدید.
								</span>
							</div>
						</div>
						<Button
							size="sm"
							className="px-2 transition-all duration-200 w-fit rounded-xl active:scale-95"
							isPrimary
							onClick={() => onChangeUI(wallpaper.extensionUI as any)}
						>
							اعمال تغییرات
						</Button>
					</div>,
					'info',
					{ position: 'top-left' }
				)
			}
		}
	}

	const handleCustomWallpaperChange = (newWallpaper: Wallpaper) => {
		setCustomWallpaper(newWallpaper)
		handleSelectBackground(newWallpaper)
	}

	return {
		selectedBackground,
		customWallpaper,
		allWallpapers,
		handleSelectBackground,
		handlePreviewBackground,
		handleCustomWallpaperChange,
	}
}
