import { FC, useEffect } from "react"
import { useNotification } from "../../contexts/NotificationContext"

type NotificationsProps = {
  /**
   * Duration in milliseconds before disappearing.
   */
  duration: number
}

export const Notifications: FC<NotificationsProps> = ({ duration }) => {
  const { notification, notify } = useNotification()

  useEffect(() => {
    if (!notification) return

    const timeout = setTimeout(() => {
      notify(undefined)
    }, duration)

    return () => {
      clearTimeout(timeout)
    }
  }, [notification])

  if (!notification || notification.message === "") {
    return
  }
  if (!notification.level) {
    notification.level = "info"
  }

  return (
    <>
      <div className="position-fixed bottom-0 start-0 p-4">
        <div className={`alert alert-${notification.level}`}>
          {notification.message}
        </div>
      </div>
    </>
  )
}
