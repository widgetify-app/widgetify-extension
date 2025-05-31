import { CheckBoxWithDescription } from '@/components/checkbox-description.component'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { ToggleSwitch } from '@/components/toggle-switch.component'
import {
  getBorderColor,
  getButtonStyles,
  getCardBackground,
  getContainerBackground,
  getDescriptionTextStyle,
  getHeadingTextStyle,
  getTextColor,
  useTheme,
} from '@/context/theme.context'
import clsx from 'clsx'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { useState } from 'react'
import { BiRss } from 'react-icons/bi'
import { VscAdd, VscTrash } from 'react-icons/vsc'
import type { RssNewsState } from '../news.interface'

const SUGGESTED_FEEDS = [
  {
    name: 'زومیت',
    url: 'https://www.zoomit.ir/feed/',
  },
  {
    name: '⚽ ورزش 3',
    url: 'https://www.varzesh3.com/rss/all',
  },
  {
    name: 'خبر فارسی',
    url: 'https://khabarfarsi.com/rss/top',
  },
]

interface RssFeedManagerProps {
  isOpen: boolean
  onClose: (rssState: RssNewsState & { changed: boolean }) => void
  rssNews: RssNewsState
}

export const RssFeedManager = ({
  isOpen,
  onClose,
  rssNews,
}: RssFeedManagerProps) => {
  if (!isOpen) return null
  const { theme } = useTheme()
  const [newFeed, setNewFeed] = useState<{ name: string; url: string }>({
    name: '',
    url: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [rssState, setRssState] = useState<RssNewsState>(rssNews)

  const toggleDefaultNews = () => {
    const newState = { ...rssState, useDefaultNews: !rssState.useDefaultNews }
    setRssState(newState)
  }

  const addNewFeed = () => {
    if (!newFeed.name.trim() || !newFeed.url.trim()) {
      setError('نام و آدرس فید الزامی است')
      return
    }

    // Validate URL
    try {
      new URL(newFeed.url)
    } catch (e) {
      setError('آدرس فید معتبر نیست')
      return
    }

    const newId = `feed-${Date.now()}`

    setRssState({
      ...rssState,
      customFeeds: [
        ...rssState.customFeeds,
        {
          id: newId,
          name: newFeed.name,
          url: newFeed.url,
          enabled: true,
        },
      ],
    })

    setNewFeed({ name: '', url: '' })
    setError(null)
  }

  const addSuggestedFeed = (suggestedFeed: { name: string; url: string }) => {
    const feedExists = rssState.customFeeds.some(
      (feed) => feed.url.toLowerCase() === suggestedFeed.url.toLowerCase(),
    )

    if (feedExists) {
      setError(`فید "${suggestedFeed.name}" قبلاً اضافه شده است`)
      return
    }

    const newId = `feed-${Date.now()}`

    const newFeed = {
      id: newId,
      name: suggestedFeed.name,
      url: suggestedFeed.url,
      enabled: true,
    }

    setRssState({
      ...rssState,
      customFeeds: [...rssState.customFeeds, newFeed],
    })
    setNewFeed({ name: '', url: '' })

    setError(null)
  }

  const validateUrl = (url: string) => {
    if (!url.trim()) return

    try {
      new URL(url)
      setError(null)
    } catch (e) {
      setError('آدرس فید معتبر نیست')
    }
  }

  const isFeedAlreadyAdded = (url: string): boolean => {
    return rssState.customFeeds.some(
      (feed) => feed.url.toLowerCase() === url.toLowerCase(),
    )
  }

  const getErrorStyle = () => {
    switch (theme) {
      case 'light':
        return 'bg-red-50 text-red-600'
      case 'dark':
        return 'bg-red-900/30 text-red-300'
      default: // glass
        return 'bg-red-900/20 backdrop-blur-sm text-red-300'
    }
  }

  const onRemoveFeed = (id: string) => {
    setRssState({
      ...rssState,
      customFeeds: rssState.customFeeds.filter((feed) => feed.id !== id),
    })
  }

  const onToggleFeed = (id: string) => {
    const feedIndex = rssState.customFeeds.findIndex((feed) => feed.id === id)
    if (feedIndex !== -1) {
      const updatedFeeds = [...rssState.customFeeds]
      updatedFeeds[feedIndex] = {
        ...updatedFeeds[feedIndex],
        enabled: !updatedFeeds[feedIndex].enabled,
      }

      setRssState({
        ...rssState,
        customFeeds: updatedFeeds,
      })
    }
  }

  const onCloseModal = () => {
    // Check if the state has changed
    const hasChanged = JSON.stringify(rssState) !== JSON.stringify(rssNews)
    if (hasChanged) {
      onClose({ ...rssState, changed: true })
    } else {
      onClose({ ...rssState, changed: false })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseModal}
      title="مدیریت فیدهای خبری"
      size="lg"
      direction="rtl"
    >
      <LazyMotion features={domAnimation}>
        <div className="flex flex-col w-full gap-6 p-4 mx-auto overflow-y-auto h-96">
          <CheckBoxWithDescription
            isEnabled={rssState.useDefaultNews}
            onToggle={toggleDefaultNews}
            title="استفاده از منابع خبری پیش‌فرض"
            description="با فعال کردن این گزینه، اخبار از منابع پیش‌فرض نمایش داده می‌شوند"
          />

          <section
            className={`p-4 rounded-xl border ${getContainerBackground(theme)} ${getBorderColor(theme)}`}
          >
            <h3
              className={`mb-3 text-sm font-medium ${getHeadingTextStyle(theme)}`}
            >
              افزودن فید RSS جدید
            </h3>
            <div className="flex flex-col gap-3">
              <TextInput
                type="text"
                placeholder="نام فید (مثال: دیجیاتو)"
                value={newFeed.name}
                onChange={(value) => setNewFeed({ ...newFeed, name: value })}
              />
              <TextInput
                type="url"
                placeholder="آدرس RSS (مثال: https://digiato.com/feed)"
                value={newFeed.url}
                onChange={(value) => {
                  setNewFeed({ ...newFeed, url: value })
                  validateUrl(value)
                }}
              />

              <AnimatePresence>
                {error && (
                  <m.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className={`p-2 text-sm rounded ${getErrorStyle()}`}>
                      {error}
                    </p>
                  </m.div>
                )}
              </AnimatePresence>

              <m.button
                onClick={addNewFeed}
                className={clsx(
                  `flex items-center justify-center gap-2 transition-colors rounded-md cursor-pointer ${getButtonStyles(theme, true)} !px-4 !py-2`,
                )}
              >
                <VscAdd size={16} />
                <span>افزودن فید جدید</span>
              </m.button>
            </div>
          </section>

          {/* Suggested Feeds Section */}
          <section className="mt-2">
            <div className="flex items-center justify-between mb-3">
              <h3
                className={`text-sm font-medium ${getHeadingTextStyle(theme)}`}
              >
                فیدهای پیشنهادی
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {SUGGESTED_FEEDS.filter(
                (feed) => !isFeedAlreadyAdded(feed.url),
              ).map((feed) => (
                <m.div
                  key={feed.url}
                  className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer ${getCardBackground(theme)} ${getBorderColor(theme)}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addSuggestedFeed(feed)}
                >
                  <span
                    className={`font-medium text-light text-center ${getTextColor(theme)}`}
                  >
                    {feed.name}
                  </span>
                </m.div>
              ))}
            </div>
          </section>

          <section className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3
                className={`text-sm font-medium ${getHeadingTextStyle(theme)}`}
              >
                فیدهای شما
              </h3>
              {rssState.customFeeds.length > 0 && (
                <div className={`text-xs ${getDescriptionTextStyle(theme)}`}>
                  {rssState.customFeeds.length} فید
                </div>
              )}
            </div>
            <FeedsList
              feeds={rssState.customFeeds}
              onToggleFeed={(id) => onToggleFeed(id)}
              onRemoveFeed={onRemoveFeed}
              theme={theme}
            />
          </section>
        </div>
      </LazyMotion>
    </Modal>
  )
}

interface FeedsListProps {
  feeds: Array<{
    id: string
    name: string
    url: string
    enabled: boolean
  }>
  isLoading?: boolean
  onToggleFeed: (id: string) => void
  onRemoveFeed: (id: string) => void
  theme: string
}

const FeedsList = ({
  feeds,
  onToggleFeed,
  onRemoveFeed,
  theme,
}: FeedsListProps) => {
  return (
    <div className="min-h-[150px]">
      {feeds.length === 0 ? (
        <m.div
          className={`flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg ${getBorderColor(theme)}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <BiRss
            className={`mb-3 opacity-50 ${getTextColor(theme)}`}
            size={32}
          />
          <p
            className={`mb-1 text-sm font-medium opacity-70 ${getTextColor(theme)}`}
          >
            هیچ فید RSS اضافه نشده است
          </p>
          <p className={`text-xs opacity-50 ${getDescriptionTextStyle(theme)}`}>
            از فرم بالا برای افزودن فید استفاده کنید
          </p>
        </m.div>
      ) : (
        <div className="space-y-2">
          {feeds.map((feed) => (
            <FeedItem
              key={feed.id}
              feed={feed}
              onToggle={() => onToggleFeed(feed.id)}
              onRemove={() => onRemoveFeed(feed.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface FeedItemProps {
  feed: {
    id: string
    name: string
    url: string
    enabled: boolean
  }
  disabled?: boolean
  onToggle: () => void
  onRemove: () => void
}

const FeedItem = ({
  feed,
  disabled = false,
  onToggle,
  onRemove,
}: FeedItemProps) => {
  const { theme } = useTheme()

  const getDeleteButtonStyle = () => {
    if (disabled)
      return 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-red-500'

    switch (theme) {
      case 'light':
        return 'text-red-500 hover:text-red-700 hover:bg-red-50'
      case 'dark':
        return 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
      default: // glass
        return 'text-red-400 hover:text-red-300 hover:bg-red-900/30'
    }
  }

  const getTextStyle = () => {
    const baseStyle = feed.enabled ? 'font-medium' : 'line-through opacity-70'
    return `${baseStyle} ${getTextColor(theme)}`
  }

  const getUrlStyle = () => {
    return theme === 'light' ? 'text-gray-500' : 'text-gray-400'
  }

  return (
    <m.div
      className={clsx(
        `flex items-center justify-between px-4 py-3 transition-colors rounded-lg ${getCardBackground(theme)} border ${getBorderColor(theme)}`,
        !feed.enabled && 'opacity-60',
        disabled && 'cursor-not-allowed',
      )}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15, transition: { duration: 0.2 } }}
      layout
      whileHover={{ scale: disabled ? 1 : 1.01 }}
    >
      <div className="flex items-center flex-1 gap-3">
        <ToggleSwitch
          enabled={feed.enabled}
          disabled={disabled}
          onToggle={onToggle}
        />
        <div className="overflow-hidden">
          <span className={clsx('block truncate', getTextStyle())}>
            {feed.name}
          </span>
          <span className={`block text-xs truncate ${getUrlStyle()}`}>
            {feed.url}
          </span>
        </div>
      </div>
      <m.button
        onClick={onRemove}
        disabled={disabled}
        className={clsx(
          `p-2 ml-2 transition-colors cursor-pointer rounded-full ${getDeleteButtonStyle()}`,
        )}
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
      >
        <VscTrash size={18} />
      </m.button>
    </m.div>
  )
}
