import { SectionPanel } from '@/components/section-panel'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import React from 'react'
import { useEffect, useState } from 'react'

interface Shortcut {
	id: string
	windowsKey: string
	macKey: string
	description: string
	category: string
}

// Helper function to format keyboard shortcuts
const formatShortcut = (shortcutText: string) => {
	return shortcutText.split('+').map((key, index, array) => (
		<React.Fragment key={index}>
			<kbd className="kbd">{key.trim()}</kbd>
			{index < array.length - 1 && ' + '}
		</React.Fragment>
	))
}

export function ShortcutsTab() {
	const [isMac, setIsMac] = useState(false)

	useEffect(() => {
		const ua = navigator.userAgent
		setIsMac(/Mac|iPod|iPhone|iPad/.test(ua))
	}, [])
	const shortcuts: Shortcut[] = [
		{
			id: 'open_bookmark_new_tab',
			windowsKey: 'CTRL + Left-click',
			macKey: '⌘ + Left-click',
			description: 'باز کردن بوکمارک در تب جدید',
			category: 'بوکمارک‌ها',
		},
		{
			id: 'open_bookmark_middle_click',
			windowsKey: 'Middle-click',
			macKey: 'Middle-click',
			description: 'باز کردن بوکمارک در تب جدید با دکمه اسکرول',
			category: 'بوکمارک‌ها',
		},
		{
			id: 'open_all_bookmarks',
			windowsKey: 'CTRL + Left-click',
			macKey: '⌘ + Left-click',
			description: 'باز کردن همه بوکمارک‌های یک پوشه',
			category: 'بوکمارک‌ها',
		},
	]

	const categories = shortcuts.reduce(
		(acc, shortcut) => {
			if (!acc[shortcut.category]) {
				acc[shortcut.category] = []
			}
			acc[shortcut.category].push(shortcut)
			return acc
		},
		{} as Record<string, Shortcut[]>
	)

	return (
		<LazyMotion features={domAnimation}>
			<m.div
				className="w-full max-w-xl mx-auto"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				dir="rtl"
			>
				<SectionPanel title="کلیدهای میانبر" delay={0.1}>
					<div className="space-y-5">
						<p className="text-muted">
							کلیدهای میانبر افزونه ویجتی‌فای برای استفاده راحت‌تر و سریع‌تر
						</p>

						{Object.entries(categories).map(
							([category, categoryShortcuts]) => (
								<div key={category} className="mb-6">
									<h3
										className={
											'text-base font-medium mb-3 text-content'
										}
									>
										{category}
									</h3>
									<div className="space-y-2">
										{categoryShortcuts.map((shortcut) => (
											<div
												key={shortcut.id}
												className={
													'flex items-center justify-between p-3 rounded-lg border border-content'
												}
											>
												<span className={'text-content'}>
													{shortcut.description}
												</span>
												<div
													className={
														'px-3 py-1 text-sm font-mono'
													}
												>
													{formatShortcut(
														isMac
															? shortcut.macKey
															: shortcut.windowsKey
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							)
						)}
					</div>
				</SectionPanel>
			</m.div>
		</LazyMotion>
	)
}
