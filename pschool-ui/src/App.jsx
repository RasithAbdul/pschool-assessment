import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SidebarLayout from "./components/Layout/SidebarLayout";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ParentsList from "./components/Parents/ParentList";
import StudentsList from "./components/Students/StudentList";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SidebarLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/parents" replace />} />
            <Route path="parents" element={<ParentsList />} />
            <Route path="students" element={<StudentsList />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
