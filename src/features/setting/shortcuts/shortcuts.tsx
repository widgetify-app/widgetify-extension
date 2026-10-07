import { Kbd, SectionPanel } from '@/components/ui'
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
			<Kbd>{key.trim()}</Kbd>
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
		{
			id: 'toggle_theme',
			windowsKey: 'CTRL + ALT + T',
			macKey: '⌘ + ALT + T',
			description: 'تغییر تم',
			category: 'ظاهری',
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
		<div className="flex flex-col gap-4" dir="rtl">
			{Object.entries(categories).map(([category, categoryShortcuts]) => (
				<SectionPanel key={category} title={category} size="sm">
					<div className="space-y-2">
						{categoryShortcuts.map((shortcut) => (
							<div
								key={shortcut.id}
								className="flex items-center justify-between gap-3 p-3 border rounded-xl border-surface-3"
							>
								<span className="text-sm text-fg">
									{shortcut.description}
								</span>
								<div className="text-sm shrink-0" dir="ltr">
									{formatShortcut(
										isMac ? shortcut.macKey : shortcut.windowsKey
									)}
								</div>
							</div>
						))}
					</div>
				</SectionPanel>
			))}
		</div>
	)
}
