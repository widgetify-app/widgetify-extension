import { useState } from 'react'
import { IoMdHelp } from 'react-icons/io'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import Tooltip from '@/components/toolTip'
import type { FolderPathItem } from '../types/bookmark.types'
import { FolderPath } from './folder-path'

interface FolderHeaderProps {
	folderPath: FolderPathItem[]
	onNavigate: (folderId: string | null, depth: number) => void
}

export function FolderHeader({ folderPath, onNavigate }: FolderHeaderProps) {
	const [isOpen, setIsOpen] = useState(false)
	useEffect(() => {
		if (isOpen) {
			Analytics.event('bookmark_help_opened')
		}
	}, [isOpen])
	return (
		<>
			<div className="flex flex-row justify-between px-1 border-b border-content mb-0.5">
				<FolderPath
					folderPath={folderPath}
					onNavigate={onNavigate}
					className="w-full "
				/>
				<Tooltip content={'آموزش'}>
					<Button
						onClick={() => setIsOpen(true)}
						size="xs"
						className={`h-7 w-7 text-xs font-medium rounded-[0.55rem] transition-colors border-none shadow-none text-muted hover:bg-base-300`}
					>
						<IoMdHelp size={12} />
					</Button>
				</Tooltip>
			</div>

			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				closeOnBackdropClick={true}
				direction="rtl"
				title="راهنمای استفاده از بوکمارک"
			>
				<div className="p-4 space-y-6">
					<div>
						<h3 className="mb-3 text-base font-semibold text-primary">
							💡 ویژگی‌های پوشه‌ها
						</h3>
						<ul className="space-y-3 text-sm leading-relaxed text-muted">
							<li className="flex items-start gap-2">
								<span className="text-success mt-0.5">•</span>
								<span>
									<strong>بینهایت بوکمارک:</strong> در پوشه‌ها می‌توانید
									نامحدود بوکمارک اضافه کنید
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-success mt-0.5">•</span>
								<span>
									<strong>اسکرول خودکار:</strong> وقتی بیشتر از 10 ایتم
									داشتید، لیست قابل اسکرول می‌شود
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-success mt-0.5">•</span>
								<span>
									<strong>سازماندهی بهتر:</strong> بوکمارک‌های مشابه را
									در پوشه‌های جداگانه قرار دهید
								</span>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="mb-3 text-base font-semibold text-primary">
							🎯 نحوه استفاده
						</h3>
						<ul className="space-y-3 text-sm leading-relaxed text-muted">
							<li className="flex items-start gap-2">
								<span className="text-info mt-0.5">1.</span>
								<span>
									<strong>کلیک معمولی:</strong> برای وارد شدن به پوشه
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-info mt-0.5">2.</span>
								<span>
									<strong>Ctrl + کلیک:</strong> برای باز کردن همه
									بوکمارک‌های پوشه
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-info mt-0.5">3.</span>
								<span>
									<strong>کلیک میانی:</strong> برای باز کردن همه
									بوکمارک‌ها در تب‌های جدید
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-info mt-0.5">4.</span>
								<span>
									<strong>کشیدن و رها کردن:</strong> برای تغییر ترتیب
									بوکمارک‌ها
								</span>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="mb-3 text-base font-semibold text-primary">
							⚡ نکات مفید
						</h3>
						<ul className="space-y-3 text-sm leading-relaxed text-muted">
							<li className="flex items-start gap-2">
								<span className="text-warning mt-0.5">💡</span>
								<span>
									از نام‌های توصیفی برای پوشه‌ها استفاده کنید (مثل "کار"،
									"سرگرمی")
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-warning mt-0.5">💡</span>
								<span>پوشه‌های تودرتو برای سازماندهی بهتر ایجاد کنید</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-warning mt-0.5">💡</span>
								<span>
									از مسیر بالای صفحه برای ناوبری سریع استفاده کنید
								</span>
							</li>
						</ul>
					</div>
				</div>
			</Modal>
		</>
	)
}
