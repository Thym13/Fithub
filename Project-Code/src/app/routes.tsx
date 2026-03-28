import { createBrowserRouter } from 'react-router';
import { Login } from './components/login';
import { Register } from './components/register';
import { OwnerDashboard } from './components/owner-dashboard';
import { ManagerDashboard } from './components/manager-dashboard';
import { ReceptionistDashboard } from './components/receptionist-dashboard';
import { TrainerDashboard } from './components/trainer-dashboard';
import { MemberDashboard } from './components/member-dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/owner',
    element: <OwnerDashboard />
  },
  {
    path: '/manager',
    element: <ManagerDashboard />
  },
  {
    path: '/receptionist',
    element: <ReceptionistDashboard />
  },
  {
    path: '/trainer',
    element: <TrainerDashboard />
  },
  {
    path: '/member',
    element: <MemberDashboard />
  }
]);