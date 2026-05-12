import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Destinations from './pages/Destinations';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/users" element={
            <PrivateRoute>
              <Layout>
                <UserManagement />
              </Layout>
            </PrivateRoute>
          } />

          {/* Placeholder routes for other features */}
          <Route path="/destinations" element={
            <PrivateRoute>
              <Layout>
                <Destinations />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/bookings" element={
            <PrivateRoute>
              <Layout>
                <div className="p-8"><h1 className="text-3xl font-bold">Bookings Management (Coming Soon)</h1></div>
              </Layout>
            </PrivateRoute>
          } />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
