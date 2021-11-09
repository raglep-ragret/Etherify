import { useAppSelector } from "../redux/hooks";
import { selectNotifications } from "../redux/slices/notificationSlice";
import Notification from "./Notification";

export default function NotificationCenter() {
  const notifications = useAppSelector(selectNotifications);

  return (
    <>
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start mt-16"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {notifications.map((notification) => (
            <Notification
              id={notification.id}
              key={notification.id}
              message={notification.message}
              title={notification.title}
              type={notification.type}
            />
          ))}
        </div>
      </div>
    </>
  );
}
