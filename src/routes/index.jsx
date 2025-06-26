import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const LandingPage = lazy(() => import('../pages/LandingPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const MemberPage = lazy(() => import('../pages/member/MemberPage'));
const AdminHome = lazy(() => import('../pages/admin/AdminHome'));

import { Spin } from 'antd';
import AdminRoutes from './AdminRoutes';
import MemberRoutes from './MemberRoutes';

const withSuspense = (Component) => (
  <Suspense
    fallback={
      <div>
        <Spin size="large" />
      </div>
    }
  >
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(LandingPage),
  },
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/register',
    element: withSuspense(RegisterPage),
  },
  {
    element: <MemberRoutes />,
    children: [
      {
        path: '/member',
        element: withSuspense(MemberPage),
      },
    ],
  },
  {
    element: <AdminRoutes />,
    children: [
      {
        path: '/admin',
        element: withSuspense(AdminHome),
      },
    ],
  },
]);

export default router;
