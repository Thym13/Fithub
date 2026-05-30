import { createBrowserRouter } from 'react-router';
import { Login } from './components/login';
import { Register } from './components/register';
import { VerifyEmail } from './components/verify-email';
import { OwnerDashboard } from './components/owner-dashboard';
import { ManagerDashboard } from './components/manager-dashboard';
import { ReceptionistDashboard } from './components/receptionist-dashboard';
import { TrainerDashboard } from './components/trainer-dashboard';
import { MemberDashboard } from './components/member-dashboard';
import { ClientDetail } from './components/client-detail';
import { ProtectedRoute } from './components/protected-route';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />
  },
  {
    path: '/owner',
    element: (
      <ProtectedRoute allowedRoles={['manager']}>
        <OwnerDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/manager',
    element: (
      <ProtectedRoute allowedRoles={['manager']}>
        <ManagerDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/receptionist',
    element: (
      <ProtectedRoute allowedRoles={['secretary', 'manager']}>
        <ReceptionistDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/trainer',
    element: (
      <ProtectedRoute allowedRoles={['trainer']}>
        <TrainerDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/trainer/client/:clientId',
    element: (
      <ProtectedRoute allowedRoles={['trainer']}>
        <ClientDetail />
      </ProtectedRoute>
    )
  },
  {
    path: '/member',
    element: (
      <ProtectedRoute allowedRoles={['member']}>
        <MemberDashboard />
      </ProtectedRoute>
    )
  }
]);