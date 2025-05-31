import { SectionPanel } from '@/components/section-panel'
import { TextInput } from '@/components/text-input'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import {
  getButtonStyles,
  getTextColor,
  useTheme,
} from '@/context/theme.context'
import { FriendsList } from '@/layouts/navbar/friends-list/setting/components/friends-List'
import {
  type Friend,
  useHandleFriendRequest,
  useSendFriendRequest,
} from '@/services/hooks/friends/friendService.hook'
import { translateError } from '@/utils/translate-error'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiUserCheck } from 'react-icons/fi'
import { RemoveFriendButton } from '../components/remove-button'

export const FriendRequestsTab = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [username, setUsername] = useState('')
  const [translatedError, setTranslatedError] = useState<string | null>(null)
  const { mutate: sendFriendRequest, isPending: isSending } =
    useSendFriendRequest()

  const { mutate: handleFriendAction, isPending: isProcessing } =
    useHandleFriendRequest()

  const handleSendRequest = () => {
    if (!user?.username) {
      toast.error(
        'برای ارسال درخواست دوستی، ابتدا باید نام کاربری خود را در پروفایل تنظیم کنید.',
      )
      return
    }
    if (!username.trim()) return

    setTranslatedError(null)

    sendFriendRequest(
      { username },
      {
        onSuccess: () => {
          setUsername('')
          toast.success('درخواست دوستی با موفقیت ارسال شد')
          setTranslatedError(null)
        },
        onError: (err) => {
          const message = translateError(err)
          if (typeof message === 'string') {
            toast.error(message)
          } else {
            setTranslatedError(message.username)
          }
        },
      },
    )
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    if (translatedError) {
      setTranslatedError(null)
    }
  }

  const acceptFriend = (friendId: string) => {
    handleFriendAction({
      friendId,
      state: 'accepted',
    })
  }

  const rejectFriend = (friendId: string) => {
    handleFriendAction({
      friendId,
      state: 'rejected',
    })
  }

  const renderFriendActions = (friend: Friend) => (
    <div className="flex space-x-2">
      {!friend.sendByMe ? (
        <>
          <Tooltip content="پذیرفتن دوستی">
            <button
              onClick={() => acceptFriend(friend.id)}
              disabled={isProcessing}
              className="p-2 text-green-500 rounded-lg cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <FiUserCheck size={18} />
            </button>
          </Tooltip>
          <RemoveFriendButton
            friend={friend}
            onClick={() => rejectFriend(friend.id)}
            type="REJECT"
            disabled={isProcessing}
          />
        </>
      ) : (
        <p className={`text-sm ${getTextColor(theme)} opacity-70`}>ارسال شده</p>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <SectionPanel title="درخواست دوستی جدید" size="sm">
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${getTextColor(theme)}`}>
            نام کاربری
          </label>
          <div className="flex">
            <TextInput
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="نام کاربری دوست خود را وارد کنید"
              className="w-full"
            />
            <button
              onClick={handleSendRequest}
              disabled={isSending || !username.trim()}
              className={`${getButtonStyles(theme, true)} cursor-pointer mr-2 px-4 py-2 rounded-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSending ? 'در حال ارسال...' : 'ارسال درخواست'}
            </button>
          </div>
          {translatedError && (
            <p className="text-sm text-red-500">{translatedError}</p>
          )}
          {!user?.username && (
            <div
              className={
                'p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700'
              }
            >
              <p className={`text-sm ${getTextColor(theme)}`}>
                برای ارسال درخواست دوستی، ابتدا باید نام کاربری خود را در بخش
                پروفایل تنظیم کنید.
              </p>
            </div>
          )}
        </div>
      </SectionPanel>

      <SectionPanel title="درخواست‌های دوستی" size="sm">
        <FriendsList
          status="PENDING"
          renderFriendActions={renderFriendActions}
          emptyMessage="درخواست دوستی جدیدی ندارید"
        />
      </SectionPanel>
    </div>
  )
}
