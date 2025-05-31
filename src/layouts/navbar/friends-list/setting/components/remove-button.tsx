import Tooltip from '@/components/toolTip'
import type { Friend } from '@/services/hooks/friends/friendService.hook'
import { FiUserX } from 'react-icons/fi'

type Props = {
  type: 'REMOVE' | 'REJECT'
  friend: Friend
  onClick: (friendId: string) => void
  disabled?: boolean
}
export function RemoveFriendButton({ type, friend, onClick, disabled }: Props) {
  return (
    <Tooltip content={type === 'REMOVE' ? 'حذف دوست' : 'رد درخواست دوستی'}>
      <button
        onClick={() => onClick(friend.id)}
        disabled={disabled}
        className="p-2 mr-2 text-red-500 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <FiUserX size={18} />
      </button>
    </Tooltip>
  )
}
