import { useEffect } from 'react';
import { getToken, messaging, onMessage } from '../configs/firebase';

const WEBPUSH_KEY = import.meta.env.VITE_WEBPUSH_CER;

export const useFirebaseMessaging = () => {
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        getToken(messaging, { vapidKey: WEBPUSH_KEY })
          .then((currentToken) => {
            if (currentToken) {
              console.log('FCM Token:', currentToken);
            } else {
              console.warn(
                'No registration token available. Request permission to generate one.',
              );
            }
          })
          .catch((err) => {
            console.error('An error occurred while retrieving token. ', err);
          });
      }
    });

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      alert(payload?.notification?.title + ': ' + payload?.notification?.body);
    });
  }, []);
};
