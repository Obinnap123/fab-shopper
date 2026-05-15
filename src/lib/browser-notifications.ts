"use client";

type BrowserNotificationOptions = {
  body: string;
  icon?: string;
  tag?: string;
};

export async function showBrowserNotification(title: string, options: BrowserNotificationOptions) {
  if (typeof window === "undefined" || typeof Notification === "undefined") {
    return false;
  }

  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") {
    return false;
  }

  new Notification(title, options);
  return true;
}
