import { SectionPanel } from '@/components/section-panel'
import {
  getBorderColor,
  getDescriptionTextStyle,
  getHeadingTextStyle,
  getTextColor,
  useTheme,
} from '@/context/theme.context'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Shortcut {
  id: string
  windowsKey: string
  macKey: string
  description: string
  category: string
}

export function ShortcutsTab() {
  const { theme } = useTheme()
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
    {} as Record<string, Shortcut[]>,
  )

  const getKeyStyle = () => {
    switch (theme) {
      case 'light':
        return 'bg-gray-100 text-gray-700'
      case 'dark':
        return 'bg-neutral-800/80'
      default:
        return 'bg-black/20 text-gray-200'
    }
  }

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
            <p className={getDescriptionTextStyle(theme)}>
              کلیدهای میانبر افزونه ویجتی‌فای برای استفاده راحت‌تر و سریع‌تر
            </p>

            {Object.entries(categories).map(([category, categoryShortcuts]) => (
              <div key={category} className="mb-6">
                <h3
                  className={`text-base font-medium mb-3 ${getHeadingTextStyle(theme)}`}
                >
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut) => (
                    <div
                      key={shortcut.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${getBorderColor(theme)} ${getBorderColor(theme)}`}
                    >
                      <span className={getTextColor(theme)}>
                        {shortcut.description}
                      </span>
                      <kbd
                        className={`px-3 py-1 text-sm font-mono rounded-md border ${getKeyStyle()} ${getTextColor(theme)} opacity-75`}
                      >
                        {isMac ? shortcut.macKey : shortcut.windowsKey}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionPanel>
      </m.div>
    </LazyMotion>
  )
}
