// Firebase service worker para FCM
// Este arquivo deve estar na pasta public/

importScripts('https://www.gstatic.com/firebasejs/11.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.9.0/firebase-messaging-compat.js');

// Configuração do Firebase (substitua pelas suas configurações)
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789",
  measurementId: "G-XXXXXXXXXX"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Manipula mensagens em background
messaging.onBackgroundMessage((payload) => {
  console.log('Mensagem recebida em background: ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

