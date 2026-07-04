import { useEffect, useState } from 'react'
import Modal from '@/components/modal'
import { Button } from '@/components/button/button'
import { getMainClient } from '@/services/api'
import { Icon } from '@/src/icons'

let updateInfo = null

async function checkForUpdates() {
	try {
		const client = getMainClient()
		const { data } = await client.get('/extension/version')

		const currentVersion = browser.runtime.getManifest().version
		const latestVersion = data.chrome.version

		if (latestVersion !== currentVersion) {
			updateInfo = {
				hasUpdate: true,
				currentVersion,
				latestVersion,
				force: data.chrome.force,
				updateUrl: data.chrome.updateUrl,
				downloadUrl: data.chrome.downloadUrl,
				notes: data.chrome.notes,
				versionName: data.chrome.versionName,
			}

			return updateInfo
		} else {
			return null
		}
	} catch (error) {
		console.error('Failed to check for updates:', error)
	}
}

interface UpdateInfo {
	hasUpdate: boolean
	currentVersion: string
	latestVersion: string
	force: boolean
	updateUrl: string
	downloadUrl: string
	notes: string[]
	versionName: string
}

export function UpdateChecker() {
	const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
	const [showModal, setShowModal] = useState(false)
	const [showNotification, setShowNotification] = useState(false)

	const checkUpdateStatus = async () => {
		try {
			const result = await checkForUpdates()
			if (result) {
				setUpdateInfo(result)
				setShowNotification(true)
			}
		} catch (error) {
			console.error('Failed to check update status:', error)
		}
	}

	useEffect(() => {
		checkUpdateStatus()
	}, [])

	const handleOpenModal = () => {
		setShowModal(true)
		setShowNotification(false)
		browser.storage.local.remove('updateInfo')
	}

	const handleDismissNotification = (e: React.MouseEvent) => {
		e.stopPropagation()
		setShowNotification(false)
		browser.storage.local.remove('updateInfo')
	}

	const handleUpdate = () => {
		if (updateInfo?.downloadUrl) {
			window.open(updateInfo.downloadUrl, '_blank')
		}
	}

	if (!updateInfo?.hasUpdate) return null

	return (
		<>
			{showNotification && (
				<div className="fixed right-0 top-1/3 -translate-y-1/2 z-[9999] group">
					<div
						onClick={handleOpenModal}
						className="absolute right-0 flex items-center justify-center gap-2 px-1 py-6 transition-all duration-300 shadow-2xl cursor-pointer bg-gradient-to-br from-primary to-primary/90 rounded-l-2xl group-hover:opacity-0"
					>
						<div className="flex flex-col items-center gap-2">
							<Icon
								name="download"
								className="w-4 h-4 text-white animate-bounce"
							/>
							<div className="text-xs font-semibold text-white rotate-180 writing-mode-vertical whitespace-nowrap">
								نسخه جدید رسید!
							</div>
						</div>
					</div>

					<div
						className="absolute right-0 top-0 w-[280px] translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"
						onClick={handleOpenModal}
					>
						<div className="relative bg-gradient-to-br from-primary/95 to-primary backdrop-blur-lg border-r border-y border-primary/20 rounded-l-2xl shadow-2xl p-4 pr-4 cursor-pointer hover:scale-[1.02] transition-transform duration-200">
							<button
								onClick={handleDismissNotification}
								className="absolute top-2 left-2 p-1.5 rounded-lg hover:bg-white/20 transition-colors z-10"
								aria-label="بستن"
							>
								<Icon name="close" className="w-4 h-4 text-white" />
							</button>

							<div className="flex items-start gap-2">
								<div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl">
									<Icon
										name="download"
										className="w-6 h-6 text-white"
									/>
								</div>
								<div className="flex-1">
									<h4 className="mb-2 text-sm font-semibold text-white">
										نسخه جدید رسیده!
									</h4>
									<p className="text-xs text-white/70">
										برای مشاهده جزئیات کلیک کنید
									</p>
								</div>
							</div>

							<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
						</div>
					</div>
				</div>
			)}

			<Modal
				isOpen={showModal}
				onClose={() => !updateInfo.force && setShowModal(false)}
				title={'📦 نسخه جدید رسید'}
				direction="rtl"
				size="md"
				closeOnBackdropClick={!updateInfo.force}
				showCloseButton={!updateInfo.force}
			>
				<div className="flex flex-col gap-4 p-2 mt-4">
					<div className="space-y-2 text-center">
						<h3 className="text-lg font-semibold">
							بروزرسانی جدید ویجتیفای منتشر شد!
						</h3>
						<div
							className={
								'inline-flex items-center px-3 py-1 mb-2 text-xs font-medium border rounded-full backdrop-blur-sm text-primary/80'
							}
						>
							<span>"{updateInfo.versionName}"</span>
						</div>
					</div>

					{updateInfo.force && (
						<div className="p-3 border rounded-lg bg-error/10 border-error/20">
							<p className="text-sm text-center text-error">
								⚠️ این به‌روزرسانی اجباری است و باید حتماً نصب شود
							</p>
						</div>
					)}

					<div className="p-4 space-y-2 rounded-lg bg-base-200">
						<h4 className="text-sm font-medium">چرا باید آپدیت کنم؟</h4>
						<ul className="pr-4 space-y-1 text-xs opacity-70">
							{updateInfo.notes.map((f) => (
								<li key={`li-${f}`}>• {f}</li>
							))}
						</ul>
					</div>

					<div className="flex flex-col gap-3">
						<Button
							size="md"
							onClick={handleUpdate}
							className="flex items-center justify-center gap-2"
							isPrimary
							rounded="xl"
						>
							<Icon name="download" className="w-4 h-4" />
							<span>دانلود و نصب</span>
						</Button>
						{!updateInfo.force && (
							<Button
								size="md"
								onClick={() => setShowModal(false)}
								rounded="xl"
							>
								بعداً
							</Button>
						)}
					</div>
				</div>
			</Modal>
		</>
	)
}
