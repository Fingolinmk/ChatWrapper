// frontend/app/layout.tsx
"use client";
import { usePathname } from 'next/navigation';
import useAuthStore from '../store/auth';
import useTokenExpiryCheck from '../store/useStore';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css'
import LoginPage from './login/page';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { token } = useAuthStore();
  useTokenExpiryCheck();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';

  return (
    <html lang="en">
      <body>
        <div className="d-flex flex-column min-vh-100">
          <header className="bg-light p-3 d-none d-md-block">
            <div className="container d-flex justify-content-between align-items-center">
              <div className='max-vh-15'>
                <h1>Chat-Wrapper</h1>
                <h5>the h is silent</h5>
              </div>
            </div>
          </header>
          <main className="flex-grow-1 p-1">
            {token ? children : (isLoginPage ? <LoginPage /> : (isRegisterPage ? children : <LoginPage />))}
          </main>
          <footer className="bg-light p-3 text-right">
            <h3 className="cursive-text">Footer</h3>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default Layout;