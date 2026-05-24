import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import ManageStokPage from './pages/admin/ManageStokPage'
import EditProdukPage from './pages/admin/EditProdukPage'

function ProtectedRoute({ children }) {
  const { admin } = useAuth()
  if (!admin) return <Navigate to="/admin/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/produk/:id" element={<DetailPage />} />

      {/* Admin Auth */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Admin Protected */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/admin/stok" element={
        <ProtectedRoute><ManageStokPage /></ProtectedRoute>
      } />
      <Route path="/admin/produk/baru" element={
        <ProtectedRoute><EditProdukPage /></ProtectedRoute>
      } />
      <Route path="/admin/produk/edit/:id" element={
        <ProtectedRoute><EditProdukPage /></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}