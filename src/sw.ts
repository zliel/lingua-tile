/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();
clientsClaim();

self.addEventListener("push", (event) => {
  const data = event.data?.json();
  const count = data?.count;

  if (count === undefined || count === null) return;

  // Set badge if supported
  if (navigator.setAppBadge) {
    navigator.setAppBadge(count);
  }

  const title = "Reviews Overdue";
  const options: NotificationOptions = {
    body: `You have ${count} reviews overdue!`,
    icon: "/android-chrome-192x192.png",
    badge: "/masked-icon.svg",
    data: {
      url: "/learn",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url && "focus" in client) {
            return (client as WindowClient).focus();
          }
        }
        // Otherwise open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(event.notification.data.url || "/");
        }
      }),
  );
});
