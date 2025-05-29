import { precacheAndRoute } from 'workbox-precaching';

self.__WB_MANIFEST; // <-- indispensable pour injecter le manifest

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    console.log("Push event data:", data);
    const options = {
      body: data.body,
      icon: data.icon || "/icons/192.jpg",
      badge: "/icons/192.jpg",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
