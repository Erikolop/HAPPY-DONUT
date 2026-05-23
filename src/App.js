import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StockManagement from "./pages/StockManagement";
import ProductForm from "./pages/ProductForm";
import AdminLayout from "./layouts/AdminLayout";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function RequireAuth({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/glazed" element={<Home initialCategory="Glazed" />} />
        <Route path="/sprinkle" element={<Home initialCategory="Sprinkle" />} />

        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/stok"
          element={
            <RequireAuth>
              <StockManagement />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/produk/tambah"
          element={
            <RequireAuth>
              <ProductForm />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/produk/edit/:id"
          element={
            <RequireAuth>
              <ProductForm />
            </RequireAuth>
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
