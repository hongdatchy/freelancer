"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { notificationService } from "@/service/notification-service";

interface NotificationContextType {
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType>({
  hasPermission: false,
  requestPermission: async () => false,
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setHasPermission(Notification.permission === "granted");
    }
  }, []);

  const requestPermission = async () => {
    const granted = await notificationService.requestNotificationPermission();
    setHasPermission(granted);
    return granted;
  };

  return (
    <NotificationContext.Provider value={{ hasPermission, requestPermission }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
