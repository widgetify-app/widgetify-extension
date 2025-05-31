import { AvatarComponent } from '@/components/avatar.component'
import Tooltip from '@/components/toolTip'
import { UserCardPortal } from '@/components/user/user-card-portal'
import type { FriendUser } from '@/services/hooks/friends/friendService.hook'
import { useRef } from 'react'

interface FriendItemProps {
  user: FriendUser
  activeProfileId: string | null
  setActiveProfileId: (id: string | null) => void
}

export function FriendItem({
  user,
  activeProfileId,
  setActiveProfileId,
}: FriendItemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isActive = activeProfileId === user.userId

  const handleClick = () => {
    if (isActive) {
      setActiveProfileId(null)
    } else {
      setActiveProfileId(user.userId)
    }
  }

  return (
    <div className="relative flex justify-center">
      <Tooltip
        content={
          <div className="flex flex-col items-center justify-center h-auto gap-2 max-w-32 min-w-32">
            <div className="flex items-center justify-center w-full gap-2 pb-1 border-b border-gray-300/50">
              <p className="text-xs text-center truncate" dir="ltr">
                {user.username}
              </p>
              <AvatarComponent
                url={user.avatar}
                placeholder={user.username}
                size="xs"
              />
            </div>
            <div className="flex items-center justify-center w-full">
              <p className="w-full text-xs wrap-break-word">
                {user.extras?.activity || undefined}
              </p>
            </div>
          </div>
        }
      >
        <div
          ref={containerRef}
          className="flex flex-col items-center justify-center overflow-hidden transition-all cursor-pointer hover:scale-105"
          onClick={handleClick}
        >
          <AvatarComponent
            url={user.avatar}
            placeholder={user.username}
            size="xs"
          />
        </div>
      </Tooltip>

      <UserCardPortal
        user={user}
        isOpen={isActive}
        onClose={() => setActiveProfileId(null)}
        triggerRef={containerRef as React.RefObject<HTMLElement>}
      />
    </div>
  )
}
