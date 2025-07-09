import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { useFirebaseMessaging } from './hooks/useFirebaseMessaging';
import router from './routes';

const queryClient = new QueryClient();

function App() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
  }

  useFirebaseMessaging();

  return (
    <QueryClientProvider client={queryClient}>
      <AntdApp>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
      </AntdApp>
    </QueryClientProvider>
  );
}

export default App;
