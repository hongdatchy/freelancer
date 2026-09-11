// Firebase Cloud Messaging Service Worker (FCM)
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Khởi tạo Firebase trong Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyDHNffO0LEcr_w1hddE668CjUavyhprZp8",
  authDomain: "thai-huong-schedule.firebaseapp.com",
  projectId: "thai-huong-schedule",
  storageBucket: "thai-huong-schedule.firebasestorage.app",
  messagingSenderId: "264031950878",
  appId: "1:264031950878:web:17f931fa15ae8cec3ab60f",
});

const messaging = firebase.messaging();

// Lắng nghe thông báo đẩy chạy nền khi đóng tab / đóng trình duyệt
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Nhận thông báo FCM ngầm:', payload);

  const notificationTitle =
    payload.notification?.title ||
    payload.data?.title ||
    '[Dược Mỹ Phẩm Thái Hương] Cập nhật tiến độ sản xuất';

  const notificationOptions = {
    body:
      payload.notification?.body ||
      payload.data?.body ||
      'Có cập nhật mốc sản xuất mới cho đơn hàng của bạn.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Xử lý khi người dùng click vào thông báo đẩy
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
