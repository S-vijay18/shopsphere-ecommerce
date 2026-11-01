import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AuthModal } from '../components/AuthModal';
import { Toast } from '../components/Toast';

export const MainLayout: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const location = useLocation();

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f3f6]">
      <Header />
      <main className="flex-1">
        <Outlet context={{ showToast }} />
      </main>
      <Footer />
      <AuthModal />
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

