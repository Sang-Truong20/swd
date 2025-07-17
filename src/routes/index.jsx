import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import LandingLayout from '../components/layouts/LandingLayout';
import { PATH_NAME } from '../constants';
import AuthPage from '../pages/auth';
import NotFound from '../pages/notfound';
import AdminRoutes from './AdminRoutes';
import GuestRoute from './GuestRoute';
import MemberRoutes from './MemberRoutes';

const LandingPage = lazy(() => import('../pages/landing'));
const MemberPage = lazy(() => import('../pages/member'));
const MemberInfo = lazy(() => import('../pages/member/MemberInfo'));
const ChangePassword = lazy(() => import('../pages/member/ChangePassword'));
const PackageManager = lazy(() => import('../pages/member/PackageManager'));
const AdminHome = lazy(() => import('../pages/admin'));
const LawsPage = lazy(() => import('../pages/laws/LawsList'));
const LawDetail = lazy(() => import('../pages/laws/LawDetail'));
const PaymentPage = lazy(() => import('../pages/payment'));

const withSuspense = (Component) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    }
  >
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    element: (
      <LandingLayout>
        <Outlet />
      </LandingLayout>
    ),
    children: [
      {
        path: PATH_NAME.HOME,
        element: withSuspense(LandingPage),
      },
      {
        path: PATH_NAME.LAWS,
        element: withSuspense(LawsPage),
      },
      {
        path: PATH_NAME.LAW_DETAIL,
        element: withSuspense(LawDetail),
      },
      {
        path: PATH_NAME.PAYMENT,
        element: withSuspense(PaymentPage),
      },
      {
        element: <MemberRoutes />,
        children: [
          {
            path: PATH_NAME.MEMBER,
            element: withSuspense(MemberPage),
            children: [
              {
                path: PATH_NAME.MEMBER_INFO,
                element: withSuspense(MemberInfo),
              },
              {
                path: PATH_NAME.CHANGE_PASSWORD,
                element: withSuspense(ChangePassword),
              },
              {
                path: PATH_NAME.PACKAGE_MAMANGEMENT,
                element: withSuspense(PackageManager),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        path: PATH_NAME.AUTH,
        element: <AuthPage />,
      },
    ],
  },

  {
    element: <AdminRoutes />,
    children: [
      {
        path: PATH_NAME.ADMIN,
        element: withSuspense(AdminHome),
      },
    ],
  },
  {
    path: PATH_NAME.NOT_FOUND,
    element: <NotFound />,
  },
]);

export default router;
