import { useEffect } from "react";

export default function NotificationPermission() {
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Permiso de notificación:", permission);
      });
    }
  }, []);

  return null;
}
