import {
  ReactNode,
  useContext,
  useState,
  createContext,
  useCallback,
} from "react"

type Notification = {
  level: "success" | "danger" | "warning" | "info"
  message: string
}

type TNotificationContext = {
  notification: Notification | undefined
  notify: (newNotification: Notification | undefined) => void
}

export const NotificationContext = createContext<
  TNotificationContext | undefined
>(undefined)

export const NotificationContextProvider = (props: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification | undefined>()
  const notify = useCallback(
    (newNotification?: Notification) => setNotification(newNotification),
    [],
  )

  return (
    <>
      <NotificationContext.Provider value={{ notification, notify }}>
        {props.children}
      </NotificationContext.Provider>
    </>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context || !context.notify) {
    throw new Error(
      "useNotification must be used in components within NotificationContextProvider",
    )
  }
  return context
}

export const useNotify = () => {
  const { notify } = useNotification()
  return notify
}
