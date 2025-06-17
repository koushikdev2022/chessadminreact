import React from 'react';
const Login = React.lazy(() => import('../pages/Auth/Login/Login'));
import InsideLayout from '../ui/layout/InsideLayout';
import OutsideLayout from '../ui/layout/OutsideLayout';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import ForgotPassword from '../pages/Auth/ForgotPassword/ForgotPassword.jsx';

import Register from '../pages/Auth/Register/Register.jsx';

import ResetPassword from '../pages/Auth/ForgotPassword/ResetPassword.jsx';
import Transaction from '../pages/Transaction/Transaction.jsx';
import Plans from '../pages/Plans/Plans.jsx';
import EditPlanDetails from '../pages/EditPlanDetails/EditPlanDetails.jsx';
import UserRedirectPage from '../pages/Transaction/UserRedirectPage.jsx';
import CreatePlan from '../pages/Plans/CreatePlan.jsx';
import Wallet from '../pages/Wallet/Wallet.jsx';
import VideoAudioPage from '../pages/VideoAudioPage/VideoAudioPage.jsx';
import TransactionList from '../pages/TransactionList/TransactionList.jsx';
import ManageCourses from '../pages/ManageCourses/ManageCourses.jsx';
import ManageCoaches from '../pages/ManageCoaches/ManageCoaches.jsx';
import ManageParents from '../pages/ManageParents/ManageParents.jsx';
import ManageRoles from '../pages/ManageRoles/ManageRoles.jsx';
import CoachSessions from '../pages/ManageCoaches/CoachSessions.jsx';
import BatchDetails from '../pages/ManageCoaches/BatchDetails.jsx';
import SessionDetails from '../pages/ManageCoaches/SessionDetails.jsx';
import AddCoach from '../pages/ManageCoaches/AddCoach.jsx';
import CoachGeneratePassword from '../pages/ManageCoaches/CoachGeneratePassword.jsx';
import LevelList from '../pages/Managelevel/LevelList.jsx';
import TopicList from '../pages/ManageTopic/TopicList.jsx';
import ModuleList from '../pages/ManageModule/ModuleList.jsx';




const allRoutes = [
  {
    path: '/',
    element: <OutsideLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: 'login', element: <Login /> },
    ],
  },
  {
    path: '/forgot-password',
    element: <OutsideLayout />,
    children: [
      { index: true, element: <ForgotPassword /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ],
  },
  {
    path: '/reset-password/:token',
    element: <OutsideLayout />,
    children: [
      { index: true, element: <ResetPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
    ],
  },
  {
    path: '/register',
    element: <OutsideLayout />,
    children: [
      { index: true, element: <Register /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/dashboard',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '/transaction',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <Transaction />,
      },
    ],
  },
  {
    path: '/create-plan',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <CreatePlan />,
      },
    ],
  },
  {
    path: '/middlePage',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <UserRedirectPage />,
      },
    ],
  },
  {
    path: '/manage-plans',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <Plans />,
      },
    ],
  },
  {
    path: '/add-coach',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <AddCoach />,
      },
    ],
  },
  {
    path: '/manage-level',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <LevelList />,
      },
    ],
  },

  {
    path: '/set-password/:token',
    element: <OutsideLayout />,
    children: [
      {
        index: true,
        element: <CoachGeneratePassword />,
      },
    ],
  },

  {
    path: '/edit-plan-details/:id',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <EditPlanDetails />,
      },
    ],
  },
  {
    path: '/user-wallet/:id',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <Wallet />,
      },
    ],
  },
  {
    path: '/user-video/:id',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <VideoAudioPage />,
      },
    ],
  },
  {
    path: '/user-transaction/:id',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <TransactionList />,
      },
    ],
  },
  {
    path: '/manage-courses',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageCourses />,
      },
    ],
  },
  {
    path: '/manage-coaches',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageCoaches />,
      },
    ],
  },
  {
    path: '/manage-parents',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageParents />,
      },
    ],
  },
  {
    path: '/manage-roles',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageRoles />,
      },
    ],
  },
  {
    path: '/coach-sessions',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <CoachSessions />,
      },
    ],
  },
  {
    path: '/batch-details',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <BatchDetails />,
      },
    ],
  },
  {
    path: '/session-details',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <SessionDetails />,
      },
    ],
  },

  {
    path: '/manage-topic',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <TopicList />,
      },
    ],
  },

  {
    path: '/manage-module',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ModuleList />,
      },
    ],
  },

  {
    path: '*',
    element: 'Outside page not found',
  },
];
export default allRoutes;
