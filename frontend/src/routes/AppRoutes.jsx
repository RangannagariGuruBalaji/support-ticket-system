import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleProtectedRoute from '../components/common/RoleProtectedRoute';

import Login from '../pages/Login';
import Register from '../pages/Register';
import CustomerDashboard from '../pages/CustomerDashboard';
import CreateTicket from '../pages/CreateTicket';
import TicketDetails from '../pages/TicketDetails';
import AgentDashboard from '../pages/AgentDashboard';
import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Authenticated Routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/tickets/:id" element={<TicketDetails />} />

      {/* Customer Routes */}
      <Route element={<RoleProtectedRoute allowedRoles="customer" />}>
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/create-ticket" element={<CreateTicket />} />
      </Route>

      {/* Support Agent Routes */}
      <Route element={<RoleProtectedRoute allowedRoles="agent" />}>
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
      </Route>
    </Route>

    {/* Root & Catch-all Fallback */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
