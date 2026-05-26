/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: self.__FIREBASE_API_KEY || 'demo-key',
  authDomain: self.__FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: self.__FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: self.__FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: self.__FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: self.__FIREBASE_APP_ID || '1:000:web:000',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon, click_action } = payload.notification || {}
  const notificationTitle = title || 'Hiideals Technologies'
  const notificationOptions = {
    body: body || 'You have a new notification',
    icon: icon || '/favicon.svg',
    badge: '/favicon.svg',
    data: { url: click_action || payload.data?.url || '/' },
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(clients.openWindow(url))
})
