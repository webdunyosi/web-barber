import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import BookingPage from './pages/BookingPage';
import StylesPage from './pages/StylesPage';
import BarberProfilePage from './pages/BarberProfilePage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AiChatPage from './pages/AiChatPage';
import LoyaltyPage from './pages/LoyaltyPage';
import BookingsListPage from './pages/BookingsListPage';
import ScrollToTop from './components/layout/ScrollToTop';
import { StepProvider } from './contexts/StepContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

const App = () => {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#18181b',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#18181b',
            },
            style: {
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }
          }
        }}
      />
      <StepProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<BookingPage />} />
              <Route path="/stillar" element={<StylesPage />} />
              <Route path="/sartarosh" element={<BarberProfilePage />} />
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/ai-chat" element={<AiChatPage />} />
              <Route path="/loyalty" element={<LoyaltyPage />} />
              <Route path="/buyurtmalarim" element={<BookingsListPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route>
          </Routes>
        </Router>
      </StepProvider>
    </AuthProvider>
  );
};

export default App;