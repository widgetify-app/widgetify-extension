import { SectionPanel } from '@/components/section-panel'
import { ConfigKey } from '../../../../common/constant/config.key'
import { RiArticleLine } from 'react-icons/ri'
import { Icon } from '@/src/icons'

export function AboutUsTab() {
	return (
		<div className="w-full max-w-2xl mx-auto" dir="rtl">
			<div className="flex flex-col items-center p-3 text-center">
				<h1
					className={
						'mb-1 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600'
					}
				>
					ویجتیفای
				</h1>
				<div
					className={
						'inline-flex items-center px-3 py-1 mb-2 text-xs font-medium border rounded-full backdrop-blur-sm text-primary/80'
					}
				>
					<span>نسخه "{ConfigKey.VERSION_NAME}"</span>
				</div>

				<p className={'max-w-lg mb-2 text-sm leading-relaxed text-content'}>
					ویجتیفای یک افزونه واسه مرورگر شماست که صفحه جدید را با ابزارهای
					کاربردی و سبک زیبا به محیطی کارآمد و شخصی‌سازی شده تبدیل می‌کند.
				</p>
			</div>

			<SectionPanel title="ارتباطات و شبکه های اجتماعی">
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<a
						href="https://widgetify.ir"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-between p-4 transition-all duration-200 border group rounded-4xl border-base-content/5 bg-base-200/20 hover:bg-base-200/50 hover:border-primary/20"
					>
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center w-10 h-10 transition-transform rounded-xl bg-primary/10 text-primary group-hover:scale-110">
								<Icon name="globe" size={18} />
							</div>
							<div className="text-right">
								<h3 className="text-xs font-bold text-base-content">
									وب‌سایت رسمی
								</h3>
								<p className="text-[10px] text-base-content/40 mt-0.5">
									widgetify.ir
								</p>
							</div>
						</div>
						<Icon
							name="externalLink"
							size={12}
							className="transition-colors text-base-content/20 group-hover:text-primary"
						/>
					</a>

					<a
						href="https://blog.widgetify.ir"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-between p-4 transition-all duration-200 border group rounded-4xl border-base-content/5 bg-base-200/20 hover:bg-base-200/50 hover:border-secondary/20"
					>
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center w-10 h-10 transition-transform rounded-xl bg-secondary/10 text-secondary group-hover:scale-110">
								<RiArticleLine size={18} />
							</div>
							<div className="text-right">
								<h3 className="text-xs font-bold text-base-content">
									وبلاگ رسمی
								</h3>
								<p className="text-[10px] text-base-content/40 mt-0.5">
									blog.widgetify.ir
								</p>
							</div>
						</div>
						<Icon
							name="externalLink"
							size={12}
							className="transition-colors text-base-content/20 group-hover:text-secondary"
						/>
					</a>

					<a
						href="https://t.me/widgetify"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-between p-4 transition-all duration-200 border group rounded-4xl border-base-content/5 bg-base-200/20 hover:bg-base-200/50 hover:border-info/20"
					>
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center w-10 h-10 transition-transform rounded-xl bg-info/10 text-info group-hover:scale-110">
								<Icon name="telegramLogo" size={18} />
							</div>
							<div className="text-right">
								<h3 className="text-xs font-bold text-base-content">
									کانال تلگرام
								</h3>
								<p className="text-[10px] text-base-content/40 mt-0.5">
									t.me/widgetify
								</p>
							</div>
						</div>
						<Icon
							name="externalLink"
							size={12}
							className="transition-colors text-base-content/20 group-hover:text-info"
						/>
					</a>

					<a
						href="https://ble.ir/widgetify"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-between p-4 transition-all duration-200 border group rounded-4xl border-base-content/5 bg-base-200/20 hover:bg-base-200/50 hover:border-success/20"
					>
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center w-10 h-10 transition-transform rounded-xl bg-success/10 text-success group-hover:scale-110">
								<svg
									viewBox="0 0 710.27 750"
									xmlns="http://www.w3.org/2000/svg"
									className="w-[18px] h-[18px]"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M561.14,15.47c-.2,0-.39,0-.58-.08-5.32-.72-10.67-1.35-16.07-1.85-1.81-.16-3.65-.27-5.48-.41-3.91-.3-7.81-.58-11.76-.75-2.75-.12-5.52-.15-8.28-.2-2.33,0-4.63-.18-7-.18-1.06,0-2.12.05-3.18.07-.74,0-1.46,0-2.19,0-1.59,0-3.16.12-4.73.17-2.28.06-4.57.13-6.84.23-2.48.12-4.93.27-7.39.45-2.26.15-4.52.3-6.77.5-2.46.22-4.88.47-7.33.73-2.22.24-4.45.47-6.66.76-2.43.3-4.84.67-7.26,1-2.2.32-4.4.63-6.57,1-2.41.41-4.79.86-7.17,1.31-2.17.4-4.34.79-6.48,1.24-2.39.5-4.74,1-7.1,1.59-2.13.48-4.25.95-6.35,1.48-2.38.59-4.72,1.23-7.07,1.87-2.07.56-4.15,1.1-6.2,1.7-2.34.67-4.65,1.41-7,2.14-2,.64-4.07,1.26-6.09,1.93-2.3.76-4.58,1.59-6.85,2.4-2,.72-4,1.41-6,2.15-2.28.86-4.53,1.78-6.8,2.69-1.92.78-3.87,1.52-5.79,2.33-2.28,1-4.53,2-6.78,3-1.86.83-3.73,1.63-5.58,2.5-2.26,1.05-4.48,2.17-6.71,3.27-1.8.89-3.61,1.74-5.4,2.66-2.24,1.16-4.45,2.37-6.66,3.58-1.73.94-3.48,1.84-5.19,2.8-2.28,1.28-4.5,2.63-6.74,4-1.61,1-3.23,1.87-4.82,2.85-2.42,1.49-4.78,3-7.17,4.58-1.37.89-15.09,10.27-15.09,10.27s-64.7-49.31-90.52-62.76-56.7,5.29-56.7,34.4v316.3c0,188.28,146.52,342.23,331.74,354.29,1.07.08,2.14.18,3.21.24,3.56.2,7.15.28,10.72.38,2.23.06,4.41.2,6.65.23l1.41,0c.47,0,.94,0,1.42,0,2.67,0,5.3-.15,8-.2,3-.07,6-.09,9-.23s6.2-.4,9.28-.63,5.89-.39,8.81-.67c3.07-.3,6.1-.72,9.14-1.1s5.82-.68,8.71-1.1,6-1,9-1.53,5.73-1,8.58-1.54,5.91-1.31,8.85-2,5.62-1.23,8.38-1.93c2.93-.75,5.8-1.6,8.69-2.41s5.51-1.5,8.22-2.33c2.87-.89,5.68-1.87,8.52-2.83,2.68-.89,5.39-1.76,8-2.72s5.55-2.14,8.32-3.22,5.27-2,7.88-3.11,5.42-2.39,8.11-3.61,5.14-2.25,7.67-3.47,5.27-2.65,7.88-4,5-2.51,7.5-3.84,5.08-2.88,7.6-4.33,4.92-2.76,7.33-4.21,4.94-3.12,7.41-4.7,4.73-3,7-4.52,4.79-3.36,7.17-5.05,4.58-3.19,6.81-4.84,4.62-3.59,6.92-5.38,4.4-3.39,6.54-5.15,4.48-3.83,6.7-5.75,4.2-3.56,6.24-5.41c2.19-2,4.3-4.06,6.44-6.1,2-1.88,4-3.73,5.95-5.67,2.09-2.09,4.1-4.25,6.14-6.4,1.89-2,3.82-3.92,5.67-5.94,2-2.19,3.89-4.46,5.83-6.7,1.79-2.07,3.63-4.09,5.37-6.2,1.89-2.27,3.67-4.62,5.49-6.94s3.45-4.29,5.11-6.5c1.76-2.36,3.42-4.79,5.13-7.18s3.26-4.48,4.8-6.77c1.67-2.45,3.22-5,4.83-7.47,1.49-2.32,3-4.6,4.46-6.95,1.54-2.53,3-5.14,4.46-7.72,1.38-2.39,2.81-4.76,4.14-7.19,1.43-2.65,2.77-5.35,4.13-8,1.25-2.43,2.54-4.83,3.74-7.29,1.33-2.76,2.54-5.58,3.81-8.37,1.11-2.47,2.28-4.91,3.33-7.4,1.21-2.85,2.29-5.76,3.43-8.64,1-2.5,2-5,3-7.52,1.09-2.94,2-5.95,3-8.94.85-2.54,1.77-5,2.57-7.59.95-3.06,1.77-6.16,2.64-9.25.72-2.55,1.51-5.07,2.16-7.64.82-3.16,1.49-6.37,2.23-9.57.58-2.56,1.23-5.07,1.76-7.66.68-3.28,1.2-6.61,1.78-9.92.45-2.54,1-5,1.36-7.6.53-3.49.92-7,1.34-10.54.3-2.43.68-4.82.92-7.28.41-4,.65-8,.91-12,.14-2,.36-4.07.47-6.13.3-5.74.43-11.53.44-17.35,0-.32,0-.64,0-1C867.15,187.69,734,39.4,561.14,15.47ZM719.32,321.7,513.12,527.92a69.34,69.34,0,0,1-98,0L304.7,417.51a69.3,69.3,0,0,1,98-98l61.41,61.41L621.32,223.7a69.3,69.3,0,1,1,98,98Z"
										transform="translate(-156.87 -12)"
									/>
								</svg>
							</div>
							<div className="text-right">
								<h3 className="text-xs font-bold text-base-content">
									پیام‌رسان بله
								</h3>
								<p className="text-[10px] text-base-content/40 mt-0.5">
									ble.ir/widgetify
								</p>
							</div>
						</div>
						<Icon
							name="externalLink"
							size={12}
							className="transition-colors text-base-content/20 group-hover:text-success"
						/>
					</a>
				</div>
			</SectionPanel>

			{/* Footer */}
			<div
				className={
					'flex items-center justify-center mt-8 space-x-1 space-x-reverse text-sm text-content opacity-75'
				}
			>
				<span>ساخته شده با</span>💙<span>در ایران</span>
			</div>

			<div className={'mt-2 mb-4 text-xs text-center text-content opacity-55'}>
				© ویجتیفای - تمامی حقوق محفوظ است
			</div>
		</div>
	)
}
