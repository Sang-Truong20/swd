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
const ChatBotPage = lazy(() => import('../pages/member/ChatBot'));
const AdminHome = lazy(() => import('../pages/admin'));
const LawsList = lazy(() => import('../pages/laws/LawsList'));
const LawDetail = lazy(() => import('../pages/laws/LawDetail'));

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
        element: withSuspense(LawsList),
      },
      {
        path: PATH_NAME.LAW_DETAIL,
        element: withSuspense(LawDetail),
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
          {
            path: PATH_NAME.CHAT_BOT,
            element: withSuspense(ChatBotPage),
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
